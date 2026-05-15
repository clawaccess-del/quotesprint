import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, verifyAccessToken } from '@/lib/access';
import { getCompanyProfile, getLeads, getQuotes, saveCompanyProfile } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const access = verifyAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  const email = access?.customerEmail?.toLowerCase();
  if (!access || !email) return NextResponse.json({ ok: false, message: 'Login required.' }, { status: 401 });

  try {
    const [profile, quotes, leads] = await Promise.all([getCompanyProfile(email), getQuotes(email), getLeads(email)]);
    return NextResponse.json({ ok: true, email, profile, quotes, leads });
  } catch (error) {
    console.error('Account load failed', error);
    return NextResponse.json({ ok: false, message: 'Account storage is not ready yet.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const access = verifyAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  const email = access?.customerEmail?.toLowerCase();
  if (!access || !email) return NextResponse.json({ ok: false, message: 'Login required.' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (!body.profile) return NextResponse.json({ ok: false, message: 'Profile required.' }, { status: 400 });

  try {
    await saveCompanyProfile(email, body.profile);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Profile save failed', error);
    return NextResponse.json({ ok: false, message: 'Could not save profile.' }, { status: 503 });
  }
}
