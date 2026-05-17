import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, verifyAccessToken } from '@/lib/access';
import { saveLead } from '@/lib/supabase';

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

export async function POST(request: NextRequest) {
  const access = verifyAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  const email = access?.customerEmail?.toLowerCase();
  if (!access || !email) return freshJson({ ok: false, message: 'Login required.' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (!body.lead?.name) return freshJson({ ok: false, message: 'Lead name required.' }, { status: 400 });

  try {
    await saveLead(email, body.lead);
    return freshJson({ ok: true, savedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Lead save failed', error);
    return freshJson({ ok: false, message: 'Could not save lead.' }, { status: 503 });
  }
}
