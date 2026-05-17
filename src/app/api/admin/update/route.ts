import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin';
import { createClientUpdate } from '@/lib/supabase';

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.redirect(new URL('/admin?error=auth', request.url), 303);

  const formData = await request.formData();
  await createClientUpdate({
    customerEmail: String(formData.get('customerEmail') || 'all'),
    title: String(formData.get('title') || ''),
    message: String(formData.get('message') || ''),
    imageUrl: String(formData.get('imageUrl') || ''),
    linkUrl: String(formData.get('linkUrl') || ''),
    videoUrl: String(formData.get('videoUrl') || ''),
  });

  return NextResponse.redirect(new URL('/admin?update=sent', request.url), 303);
}
