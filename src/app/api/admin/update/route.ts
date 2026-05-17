import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin';
import { createClientUpdate } from '@/lib/supabase';

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.redirect(new URL('/admin?error=auth', request.url), 303);

  const formData = await request.formData();
  const recipientMode = String(formData.get('recipientMode') || 'all');
  const selectedEmails = formData.getAll('customerEmails').map((value) => String(value).trim().toLowerCase()).filter(Boolean);
  const recipients = recipientMode === 'selected' ? selectedEmails : ['all'];

  const update = {
    title: String(formData.get('title') || ''),
    message: String(formData.get('message') || ''),
    imageUrl: String(formData.get('imageUrl') || ''),
    linkUrl: String(formData.get('linkUrl') || ''),
    videoUrl: String(formData.get('videoUrl') || ''),
  };

  if (!update.title || !update.message || !recipients.length) {
    return NextResponse.redirect(new URL('/admin?tab=updates&error=missing', request.url), 303);
  }

  await Promise.all(recipients.map((customerEmail) => createClientUpdate({ customerEmail, ...update })));

  return NextResponse.redirect(new URL('/admin?tab=updates&update=sent', request.url), 303);
}
