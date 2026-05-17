import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, verifyAccessToken } from '@/lib/access';
import { getCompanyProfile, getLeads, getQuotes, saveCompanyProfile } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const freshJson = (body: unknown, init?: ResponseInit) => NextResponse.json(body, {
  ...init,
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    ...(init?.headers || {}),
  },
});

export async function GET(request: NextRequest) {
  const access = verifyAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  const email = access?.customerEmail?.toLowerCase();
  if (!access || !email) return freshJson({ ok: false, message: 'Login required.' }, { status: 401 });

  try {
    const [profile, quotes, leads] = await Promise.all([getCompanyProfile(email), getQuotes(email), getLeads(email)]);
    return freshJson({ ok: true, email, profile, quotes, leads, refreshedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Account load failed', error);
    return freshJson({ ok: false, message: 'Account storage is not ready yet.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const access = verifyAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  const email = access?.customerEmail?.toLowerCase();
  if (!access || !email) return freshJson({ ok: false, message: 'Login required.' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (!body.profile) return freshJson({ ok: false, message: 'Profile required.' }, { status: 400 });

  try {
    await saveCompanyProfile(email, body.profile);
    return freshJson({ ok: true, savedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Profile save failed', error);
    return freshJson({ ok: false, message: 'Could not save profile.' }, { status: 503 });
  }
}
