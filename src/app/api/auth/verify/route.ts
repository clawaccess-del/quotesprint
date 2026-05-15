import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, accessMaxAgeSeconds, createAccessToken, verifySignedToken } from '@/lib/access';

type LoginToken = {
  plan: string;
  mode: 'payment' | 'subscription';
  sessionId: string;
  customerEmail?: string;
  expiresAt: number;
};

const allowedPlans = new Set(['starter', 'pro', 'agency', 'live', 'live_ai']);

export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const token = request.nextUrl.searchParams.get('token') || undefined;
  const grant = verifySignedToken<LoginToken>(token);

  if (!grant || !grant.expiresAt || grant.expiresAt < Date.now() || !allowedPlans.has(grant.plan)) {
    return NextResponse.redirect(`${siteUrl}/login?error=invalid-link`);
  }

  const maxAge = accessMaxAgeSeconds(grant.mode);
  const accessToken = createAccessToken({
    plan: grant.plan,
    mode: grant.mode,
    sessionId: grant.sessionId,
    customerEmail: grant.customerEmail,
    expiresAt: Date.now() + maxAge * 1000,
  });

  const response = NextResponse.redirect(`${siteUrl}/app?access=granted`);
  response.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
  return response;
}
