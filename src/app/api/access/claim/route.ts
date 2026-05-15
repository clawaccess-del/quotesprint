import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ACCESS_COOKIE, accessMaxAgeSeconds, createAccessToken } from '@/lib/access';

const allowedPlans = new Set(['starter', 'pro', 'agency', 'live', 'live_ai']);

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const secret = process.env.STRIPE_SECRET_KEY;

  if (!sessionId || !secret) {
    return NextResponse.redirect(`${siteUrl}/access?error=missing-session`);
  }

  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['subscription'] });
    const plan = session.metadata?.plan || 'pro';
    const mode = session.mode === 'subscription' ? 'subscription' : 'payment';
    const subscription = typeof session.subscription === 'object' ? session.subscription : null;
    const subscriptionOk = mode === 'subscription' && subscription && ['active', 'trialing'].includes(subscription.status);
    const paymentOk = mode === 'payment' && session.payment_status === 'paid';

    if (!allowedPlans.has(plan) || (!paymentOk && !subscriptionOk)) {
      return NextResponse.redirect(`${siteUrl}/access?error=not-paid`);
    }

    const maxAge = accessMaxAgeSeconds(mode);
    const token = createAccessToken({
      plan,
      mode,
      sessionId: session.id,
      customerEmail: session.customer_details?.email || undefined,
      expiresAt: Date.now() + maxAge * 1000,
    });

    const response = NextResponse.redirect(`${siteUrl}/app?access=granted`);
    response.cookies.set(ACCESS_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge,
    });
    return response;
  } catch {
    return NextResponse.redirect(`${siteUrl}/access?error=invalid-session`);
  }
}
