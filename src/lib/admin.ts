import { cookies } from 'next/headers';
import { createSignedToken, verifySignedToken } from '@/lib/access';
import { verifyPassword } from '@/lib/security';

export const ADMIN_COOKIE = 'ls_admin';

type AdminSession = {
  username: string;
  role: 'owner';
  expiresAt: number;
};

export function configuredAdminUsername() {
  return process.env.ADMIN_USERNAME || 'Tysan';
}

export function configuredAdminGoogleEmails() {
  return (process.env.ADMIN_GOOGLE_EMAILS || process.env.ADMIN_GOOGLE_EMAIL || 'clawaccess@gmail.com,Tysanseo@gmail.com')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminGoogleEmail(email?: string | null) {
  if (!email) return false;
  return configuredAdminGoogleEmails().includes(email.trim().toLowerCase());
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD);
}

export function validateAdminLogin(username: string, password: string) {
  const expectedUsername = configuredAdminUsername().trim().toLowerCase();
  if (username.trim().toLowerCase() !== expectedUsername) return false;

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (passwordHash) return verifyPassword(password, passwordHash);

  const plainPassword = process.env.ADMIN_PASSWORD;
  return Boolean(plainPassword && password === plainPassword);
}

export function createAdminToken(username: string) {
  return createSignedToken({ username, role: 'owner', expiresAt: Date.now() + 1000 * 60 * 60 * 12 } satisfies AdminSession);
}

export function createAdminTokenForEmail(email: string) {
  return createAdminToken(email.trim().toLowerCase());
}

export function verifyAdminToken(token?: string) {
  const session = verifySignedToken<AdminSession>(token);
  if (!session || session.role !== 'owner' || session.expiresAt < Date.now()) return null;
  return session;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
