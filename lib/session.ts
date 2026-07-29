import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const COOKIE_NAME = 'parkvoid_session';
const SESSION_DAYS = 30;

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error('JWT_SECRET must be configured.');
  return value;
}

function hash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function sign(token: string) {
  return createHmac('sha256', secret()).update(token).digest('hex');
}

function encode(token: string) {
  return `${token}.${sign(token)}`;
}

function decode(value?: string) {
  if (!value) return null;
  const [token, signature] = value.split('.');
  if (!token || !signature) return null;
  const expected = sign(token);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return token;
}

export type SessionUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  role: string;
  walletBalance: { toString(): string };
  subPlan: string | null;
  subStatus: string | null;
  kycStatus: string;
};

export function serializeUser(user: SessionUser) {
  return {
    ...user,
    role: user.role.toLowerCase(),
    subscriptionPlan: user.subPlan?.toLowerCase() ?? 'free',
    subscriptionStatus: user.subStatus?.toLowerCase() ?? 'active',
    name: user.name ?? user.phone,
  };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { userId, tokenHash: hash(token), expiresAt } });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encode(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = decode(cookieStore.get(COOKIE_NAME)?.value);
  if (token) await prisma.session.deleteMany({ where: { tokenHash: hash(token) } });
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = decode(cookieStore.get(COOKIE_NAME)?.value);
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hash(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return null;
  }
  return session.user;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error('Authentication required.');
  return user;
}

export async function requireRole(...roles: string[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new Error('You do not have permission to perform this action.');
  return user;
}
