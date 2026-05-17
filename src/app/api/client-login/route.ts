import { NextResponse } from 'next/server';
import { ACCESS_COOKIE, accessMaxAgeSeconds, createAccessToken } from '@/lib/access';
import { verifyClientPasswordLogin } from '@/lib/supabase';

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get('username') || '');
  const password = String(formData.get('password') || '');
  const client = await verifyClientPasswordLogin(username, password).catch((error) => {
    console.error('Client login failed', error);
    return null;
  });

  if (!client) return NextResponse.redirect(new URL('/login?error=client', request.url), 303);

  const grant = {
    plan: client.plan,
    mode: 'subscription' as const,
    sessionId: `client:${client.accountId}`,
    customerEmail: client.email,
    expiresAt: Date.now() + accessMaxAgeSeconds('subscription') * 1000,
  };
  const response = NextResponse.redirect(new URL('/app?welcome=1', request.url), 303);
  response.cookies.set(ACCESS_COOKIE, createAccessToken(grant), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: accessMaxAgeSeconds('subscription'),
  });
  return response;
}
