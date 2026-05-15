import crypto from 'node:crypto';

export type AccessGrant = {
  plan: string;
  mode: 'payment' | 'subscription';
  sessionId: string;
  customerEmail?: string;
  expiresAt: number;
};

export const ACCESS_COOKIE = 'qs_access';

function signingSecret() {
  return process.env.ACCESS_SIGNING_SECRET || process.env.STRIPE_SECRET_KEY || 'quotesprint-dev-secret';
}

function base64url(input: string) {
  return Buffer.from(input).toString('base64url');
}

function unbase64url(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function sign(payload: string) {
  return crypto.createHmac('sha256', signingSecret()).update(payload).digest('base64url');
}

export function createAccessToken(grant: AccessGrant) {
  const payload = base64url(JSON.stringify(grant));
  return `${payload}.${sign(payload)}`;
}

export function verifyAccessToken(token?: string): AccessGrant | null {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  const expected = sign(payload);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const grant = JSON.parse(unbase64url(payload)) as AccessGrant;
  if (!grant.expiresAt || grant.expiresAt < Date.now()) return null;
  return grant;
}

export function accessMaxAgeSeconds(mode: 'payment' | 'subscription') {
  return mode === 'subscription' ? 60 * 60 * 24 * 31 : 60 * 60 * 24 * 365;
}
