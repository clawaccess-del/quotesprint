import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, verifyAccessToken } from '@/lib/access';
import { saveLead } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const access = verifyAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  const email = access?.customerEmail?.toLowerCase();
  if (!access || !email) return NextResponse.json({ ok: false, message: 'Login required.' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (!body.lead?.name) return NextResponse.json({ ok: false, message: 'Lead name required.' }, { status: 400 });

  try {
    await saveLead(email, body.lead);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Lead save failed', error);
    return NextResponse.json({ ok: false, message: 'Could not save lead.' }, { status: 503 });
  }
}
