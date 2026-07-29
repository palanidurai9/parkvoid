import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, serializeUser } from '@/lib/session';

export async function POST(request: Request) {
  const { phone, adminCode } = await request.json();
  const normalizedPhone = String(phone ?? '').replace(/\D/g, '').slice(-10);
  if (normalizedPhone.length !== 10) return NextResponse.json({ error: 'Enter a valid 10-digit phone number.' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (!user) return NextResponse.json({ error: 'Account not found. Contact support to register.' }, { status: 404 });
  if (user.role === 'ADMIN' && (!process.env.ADMIN_ACCESS_CODE || adminCode !== process.env.ADMIN_ACCESS_CODE)) {
    return NextResponse.json({ error: 'Administrator credentials are required.' }, { status: 403 });
  }

  await createSession(user.id);
  return NextResponse.json({ user: serializeUser(user) });
}
