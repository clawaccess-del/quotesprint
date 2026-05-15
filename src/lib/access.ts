import crypto from 'node:crypto';

export type AccessGrant = {
  plan: string;
  mode: 'payment' | 'subscription';
  sessionId: string;
  customerEmail?: string;
  expiresAt: number;
};

export type AiUsage = {
  month: string;
  used: number;
};

export const ACCESS_COOKIE = 'qs_access';
export const AI_USAGE_COOKIE = 'qs_ai_usage';
export const AI_MONTHLY_CREDITS = 100;

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

export function createSignedToken(data: unknown) {
  const payload = base64url(JSON.stringify(data));
  return `${payload}.${sign(payload)}`;
}

export function verifySignedToken<T>(token?: string): T | null {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;
  return JSON.parse(unbase64url(payload)) as T;
}

export function createAccessToken(grant: AccessGrant) {
  return createSignedToken(grant);
}

export function verifyAccessToken(token?: string): AccessGrant | null {
  const grant = verifySignedToken<AccessGrant>(token);
  if (!grant || !grant.expiresAt || grant.expiresAt < Date.now()) return null;
  return grant;
}

export function createAiUsageToken(usage: AiUsage) {
  return createSignedToken(usage);
}

export function verifyAiUsageToken(token?: string): AiUsage | null {
  return verifySignedToken<AiUsage>(token);
}

export function currentUsageMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function accessMaxAgeSeconds(mode: 'payment' | 'subscription') {
  return mode === 'subscription' ? 60 * 60 * 24 * 31 : 60 * 60 * 24 * 365;
}
