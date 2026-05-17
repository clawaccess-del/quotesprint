import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, createAdminToken, validateAdminLogin } from '@/lib/admin';

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get('username') || '');
  const password = String(formData.get('password') || '');

  if (!validateAdminLogin(username, password)) {
    return NextResponse.redirect(new URL('/admin?error=1', request.url), 303);
  }

  const response = NextResponse.redirect(new URL('/admin', request.url), 303);
  response.cookies.set(ADMIN_COOKIE, createAdminToken(username), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return response;
}
