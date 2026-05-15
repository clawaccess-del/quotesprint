import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, verifyAccessToken } from '@/lib/access';
import { saveQuote, updateQuoteStatus } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const access = verifyAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  const email = access?.customerEmail?.toLowerCase();
  if (!access || !email) return NextResponse.json({ ok: false, message: 'Login required.' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  try {
    if (body.quote) await saveQuote(email, body.quote);
    else if (body.id && body.status) await updateQuoteStatus(email, body.id, body.status);
    else return NextResponse.json({ ok: false, message: 'Quote or status update required.' }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Quote save failed', error);
    return NextResponse.json({ ok: false, message: 'Could not save quote.' }, { status: 503 });
  }
}
