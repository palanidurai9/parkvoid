import { NextResponse } from 'next/server';
import { getSessionUser, serializeUser } from '@/lib/session';

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({ user: user ? serializeUser(user) : null });
}
