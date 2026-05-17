import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin';
import { upsertClientAccount } from '@/lib/supabase';

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.redirect(new URL('/admin?error=auth', request.url), 303);

  const formData = await request.formData();
  await upsertClientAccount({
    id: String(formData.get('id') || '') || undefined,
    email: String(formData.get('email') || ''),
    companyName: String(formData.get('companyName') || ''),
    contactName: String(formData.get('contactName') || ''),
    portalUsername: String(formData.get('portalUsername') || ''),
    password: String(formData.get('password') || '') || undefined,
    plan: String(formData.get('plan') || 'live_ai'),
    status: String(formData.get('status') || 'trial') as any,
    notes: String(formData.get('notes') || ''),
  });

  return NextResponse.redirect(new URL('/admin?client=saved', request.url), 303);
}
