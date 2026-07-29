'use server';

import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { createHmac, timingSafeEqual } from 'crypto';

type BookingInput = { slotId: string; startTime: string; duration: number };

function paymentMode() {
  return process.env.PAYMENTS_MODE === 'demo' ? 'demo' : 'razorpay';
}

async function reserveBooking(input: BookingInput) {
  const driver = await requireRole('DRIVER');
  const startTime = new Date(input.startTime);
  const duration = Number(input.duration);
  if (Number.isNaN(startTime.getTime()) || duration < 1 || duration > 24) return { success: false, error: 'Choose a valid start time and duration.' };
  if (startTime.getTime() < Date.now() - 5 * 60 * 1000) return { success: false, error: 'Bookings must start in the future.' };
  const slot = await prisma.parkingSlot.findFirst({ where: { id: input.slotId, isActive: true, isApproved: true } });
  if (!slot) return { success: false, error: 'This parking spot is no longer available.' };
  const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
  const conflict = await prisma.booking.findFirst({ where: { slotId: slot.id, status: { in: ['PAID', 'CONFIRMED', 'ACTIVE'] }, startTime: { lt: endTime }, endTime: { gt: startTime } } });
  if (conflict) return { success: false, error: 'This parking spot is already reserved for that time.' };

  const amount = Number(slot.pricePerHour) * duration + 10;
  const booking = await prisma.booking.create({ data: { slotId: slot.id, driverId: driver.id, startTime, endTime, amount, platformFee: 10, status: 'PENDING' } });
  return booking;
}

export async function startBookingCheckout(input: BookingInput) {
  const booking = await reserveBooking(input);
  if (paymentMode() === 'demo') return { success: true, mode: 'demo' as const, bookingId: booking.id };

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return { success: false, error: 'Payments are not configured. Please contact support.' };

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: Math.round(Number(booking.amount) * 100), currency: 'INR', receipt: booking.id }),
    });
    if (!response.ok) throw new Error('Razorpay order creation failed.');
    const order = await response.json() as { id: string };
    await prisma.booking.update({ where: { id: booking.id }, data: { paymentOrderId: order.id } });
    return { success: true, mode: 'razorpay' as const, bookingId: booking.id, orderId: order.id, amount: Number(booking.amount) };
  } catch {
    await prisma.booking.delete({ where: { id: booking.id } });
    return { success: false, error: 'Unable to start payment. Please try again.' };
  }
}

export async function confirmDemoBooking(bookingId: string) {
  if (paymentMode() !== 'demo') return { success: false, error: 'Demo payments are disabled.' };
  const driver = await requireRole('DRIVER');
  const booking = await prisma.booking.updateMany({ where: { id: bookingId, driverId: driver.id, status: 'PENDING' }, data: { status: 'PAID', paymentId: `demo_${crypto.randomUUID()}`, qrCode: `PV-${crypto.randomUUID()}` } });
  if (!booking.count) return { success: false, error: 'This booking is no longer available.' };
  revalidatePath('/dashboard');
  return { success: true };
}

export async function verifyBookingPayment(input: { bookingId: string; paymentId: string; orderId: string; signature: string }) {
  const driver = await requireRole('DRIVER');
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return { success: false, error: 'Payments are not configured.' };
  const expected = createHmac('sha256', keySecret).update(`${input.orderId}|${input.paymentId}`).digest('hex');
  if (expected.length !== input.signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(input.signature))) return { success: false, error: 'Payment verification failed.' };
  const updated = await prisma.booking.updateMany({ where: { id: input.bookingId, driverId: driver.id, paymentOrderId: input.orderId, status: 'PENDING' }, data: { status: 'PAID', paymentId: input.paymentId, qrCode: `PV-${crypto.randomUUID()}` } });
  if (!updated.count) return { success: false, error: 'This payment cannot be applied to the booking.' };
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getDriverBookings() {
  const driver = await requireRole('DRIVER');
  const bookings = await prisma.booking.findMany({ where: { driverId: driver.id }, include: { slot: true }, orderBy: { createdAt: 'desc' } });
  return bookings.map((booking) => ({ ...booking, amount: Number(booking.amount), startTime: booking.startTime.toISOString(), endTime: booking.endTime.toISOString(), createdAt: booking.createdAt.toISOString(), status: booking.status.toLowerCase(), slot: { ...booking.slot, pricePerHour: Number(booking.slot.pricePerHour), images: JSON.parse(booking.slot.images || '[]'), status: booking.slot.isActive ? 'active' : booking.slot.isApproved ? 'inactive' : 'pending', vehicleType: booking.slot.vehicleType.toLowerCase(), openTime: booking.slot.openTime ?? '00:00', closeTime: booking.slot.closeTime ?? '23:59' } }));
}

export async function getDriverBooking(bookingId: string) {
  const driver = await requireRole('DRIVER');
  const booking = await prisma.booking.findFirst({ where: { id: bookingId, driverId: driver.id }, include: { slot: true } });
  if (!booking) return null;
  return { ...booking, amount: Number(booking.amount), startTime: booking.startTime.toISOString(), endTime: booking.endTime.toISOString(), createdAt: booking.createdAt.toISOString(), status: booking.status.toLowerCase(), slot: { ...booking.slot, pricePerHour: Number(booking.slot.pricePerHour), images: JSON.parse(booking.slot.images || '[]'), status: booking.slot.isActive ? 'active' : booking.slot.isApproved ? 'inactive' : 'pending', vehicleType: booking.slot.vehicleType.toLowerCase(), openTime: booking.slot.openTime ?? '00:00', closeTime: booking.slot.closeTime ?? '23:59' } };
}
