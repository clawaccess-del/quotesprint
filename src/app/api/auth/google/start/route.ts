import { NextResponse } from 'next/server';
import { createSignedToken } from '@/lib/access';

export async function GET(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const googleRedirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || `${siteUrl}/api/auth/google/callback`;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) return NextResponse.redirect(`${siteUrl}/login?error=google-not-configured`);

  const state = createSignedToken({ expiresAt: Date.now() + 10 * 60 * 1000, nonce: crypto.randomUUID() });
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: googleRedirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
