import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, verifyAccessToken } from '@/lib/access';
import { createTicket, listTickets } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const access = verifyAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  const email = access?.customerEmail?.toLowerCase();
  if (!access || !email) return NextResponse.json({ ok: false, message: 'Login required.' }, { status: 401 });
  const tickets = await listTickets(email);
  return NextResponse.json({ ok: true, tickets });
}

export async function POST(request: NextRequest) {
  const access = verifyAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  const email = access?.customerEmail?.toLowerCase();
  if (!access || !email) return NextResponse.redirect(new URL('/login', request.url), 303);
  const formData = await request.formData();
  const subject = String(formData.get('subject') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const priority = String(formData.get('priority') || 'normal') as any;
  if (subject && message) await createTicket(email, { subject, message, priority });
  return NextResponse.redirect(new URL('/support?ticket=created', request.url), 303);
}
