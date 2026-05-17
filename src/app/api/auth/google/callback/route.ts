import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ACCESS_COOKIE, accessMaxAgeSeconds, createAccessToken, verifySignedToken } from '@/lib/access';
import { ADMIN_COOKIE, createAdminTokenForEmail, isAdminGoogleEmail } from '@/lib/admin';
import { findStripeEntitlementByEmail } from '@/lib/entitlements';

type GoogleState = { expiresAt: number; nonce: string; purpose?: 'admin' | 'customer' };
type GoogleTokenResponse = { id_token?: string; error?: string };
type GoogleProfile = { email?: string; email_verified?: boolean };

function parseJwtPayload<T>(token: string): T | null {
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state') || undefined;
  const parsedState = verifySignedToken<GoogleState>(state);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const isAdminLogin = parsedState?.purpose === 'admin';
  const errorTarget = isAdminLogin ? 'admin' : 'login';

  if (!code || !parsedState || parsedState.expiresAt < Date.now() || !clientId || !clientSecret || (!isAdminLogin && !stripeSecret)) {
    return NextResponse.redirect(`${siteUrl}/${errorTarget}?error=google-login`);
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${siteUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenJson = (await tokenResponse.json()) as GoogleTokenResponse;
    const profile = tokenJson.id_token ? parseJwtPayload<GoogleProfile>(tokenJson.id_token) : null;
    const email = profile?.email?.trim().toLowerCase();

    if (!tokenResponse.ok || !email || profile?.email_verified === false) {
      return NextResponse.redirect(`${siteUrl}/${errorTarget}?error=google-email`);
    }

    if (isAdminLogin) {
      if (!isAdminGoogleEmail(email)) return NextResponse.redirect(`${siteUrl}/admin?error=not-owner`);
      const response = NextResponse.redirect(`${siteUrl}/admin?access=granted`);
      response.cookies.set(ADMIN_COOKIE, createAdminTokenForEmail(email), {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12,
      });
      return response;
    }

    const stripe = new Stripe(stripeSecret!);
    const entitlement = await findStripeEntitlementByEmail(stripe, email);

    if (!entitlement) return NextResponse.redirect(`${siteUrl}/login?error=no-purchase`);

    const maxAge = accessMaxAgeSeconds(entitlement.mode);
    const accessToken = createAccessToken({
      plan: entitlement.plan,
      mode: entitlement.mode,
      sessionId: entitlement.sessionId,
      customerEmail: entitlement.customerEmail || email,
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
  } catch (error) {
    console.error('Google login failed', error);
    return NextResponse.redirect(`${siteUrl}/${errorTarget}?error=google-login`);
  }
}
