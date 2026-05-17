import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin';
import { updateTicket } from '@/lib/supabase';

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.redirect(new URL('/admin?error=auth', request.url), 303);

  const formData = await request.formData();
  const id = String(formData.get('id') || '');
  if (id) {
    await updateTicket(id, {
      status: String(formData.get('status') || 'new') as any,
      priority: String(formData.get('priority') || 'normal') as any,
      adminResponse: String(formData.get('adminResponse') || ''),
    });
  }

  return NextResponse.redirect(new URL('/admin?tickets=updated', request.url), 303);
}
