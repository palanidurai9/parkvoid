import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 });

  const body = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  const event = JSON.parse(body) as { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string } } } };
  const payment = event.payload?.payment?.entity;
  if (event.event === 'payment.captured' && payment?.id && payment.order_id) {
    await prisma.booking.updateMany({
      where: { paymentOrderId: payment.order_id, status: 'PENDING' },
      data: { status: 'PAID', paymentId: payment.id, qrCode: `PV-${crypto.randomUUID()}` },
    });
  }
  if (event.event === 'payment.failed' && payment?.order_id) {
    await prisma.booking.updateMany({ where: { paymentOrderId: payment.order_id, status: 'PENDING' }, data: { status: 'CANCELLED' } });
  }

  return NextResponse.json({ received: true });
}
