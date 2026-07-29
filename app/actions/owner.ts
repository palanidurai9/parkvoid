'use server';

import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/session';
import { revalidatePath } from 'next/cache';

const SLOT_LIMITS: Record<string, number> = { FREE: 1, STARTER: 2, PRO: 10 };

export async function getOwnerDashboard() {
  const owner = await requireRole('OWNER');
  const [slots, bookings, subscription] = await Promise.all([
    prisma.parkingSlot.findMany({ where: { ownerId: owner.id }, orderBy: { createdAt: 'desc' } }),
    prisma.booking.findMany({ where: { slot: { ownerId: owner.id } }, orderBy: { createdAt: 'desc' } }),
    prisma.subscription.findFirst({ where: { ownerId: owner.id }, orderBy: { currentPeriodEnd: 'desc' } }),
  ]);
  const commission = owner.subPlan === 'PRO' ? 0.05 : owner.subPlan === 'STARTER' ? 0.1 : 0.15;
  const gross = bookings.filter((booking) => ['PAID', 'CONFIRMED', 'COMPLETED', 'ACTIVE'].includes(booking.status)).reduce((sum, booking) => sum + Number(booking.amount), 0);
  return {
    owner: { ...owner, walletBalance: Number(owner.walletBalance) },
    slots: slots.map((slot) => ({ ...slot, pricePerHour: Number(slot.pricePerHour), images: JSON.parse(slot.images || '[]'), status: slot.isActive ? 'active' : slot.isApproved ? 'inactive' : 'pending', vehicleType: slot.vehicleType.toLowerCase() })),
    bookings: bookings.map((booking) => ({ ...booking, amount: Number(booking.amount), startTime: booking.startTime.toISOString(), endTime: booking.endTime.toISOString(), createdAt: booking.createdAt.toISOString(), status: booking.status.toLowerCase() })),
    subscription: subscription ? { ...subscription } : null,
    earnings: Math.floor(gross * (1 - commission)),
  };
}

export async function getOwnerStats() {
  const dashboard = await getOwnerDashboard();
  return {
    totalSlots: dashboard.slots.length,
    activeSlots: dashboard.slots.filter((slot) => slot.status === 'active').length,
    totalBookings: dashboard.bookings.length,
    totalEarnings: dashboard.earnings,
  };
}

export async function addParkingSlot(data: { title: string; address: string; lat: number; lng: number; pricePerHour: number; vehicleType: string; description?: string; openTime?: string; closeTime?: string; images?: string[] }) {
  const owner = await requireRole('OWNER');
  if (!data.title?.trim() || !data.address?.trim() || !Number.isFinite(Number(data.pricePerHour)) || Number(data.pricePerHour) <= 0) return { success: false, error: 'Enter a title, address, and a valid hourly price.' };
  if (!Number.isFinite(Number(data.lat)) || !Number.isFinite(Number(data.lng))) return { success: false, error: 'Select a valid parking location.' };

  const currentCount = await prisma.parkingSlot.count({ where: { ownerId: owner.id } });
  const plan = owner.subPlan ?? 'FREE';
  if (currentCount >= (SLOT_LIMITS[plan] ?? 1)) return { success: false, error: `Your ${plan.toLowerCase()} plan has reached its listing limit.` };

  await prisma.parkingSlot.create({ data: {
    ownerId: owner.id,
    title: data.title.trim(),
    address: data.address.trim(),
    lat: Number(data.lat), lng: Number(data.lng), pricePerHour: Number(data.pricePerHour),
    vehicleType: data.vehicleType.toUpperCase(), description: data.description?.trim(),
    openTime: data.openTime ?? '00:00', closeTime: data.closeTime ?? '23:59',
    images: JSON.stringify(data.images ?? []), isActive: false, isApproved: false,
  } });
  revalidatePath('/dashboard/owner');
  revalidatePath('/search');
  return { success: true };
}

export async function deleteParkingSlot(slotId: string) {
  const owner = await requireRole('OWNER');
  await prisma.parkingSlot.deleteMany({ where: { id: slotId, ownerId: owner.id } });
  revalidatePath('/dashboard/owner');
  revalidatePath('/search');
}
