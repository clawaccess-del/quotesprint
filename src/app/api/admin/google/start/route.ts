import { NextResponse } from 'next/server';
import { createSignedToken } from '@/lib/access';

export async function GET(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) return NextResponse.redirect(`${siteUrl}/admin?error=google-not-configured`);

  const state = createSignedToken({
    expiresAt: Date.now() + 10 * 60 * 1000,
    nonce: crypto.randomUUID(),
    purpose: 'admin',
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${siteUrl}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
