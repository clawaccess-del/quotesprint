import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, AI_MONTHLY_CREDITS, AI_USAGE_COOKIE, currentUsageMonth, verifyAccessToken, verifyAiUsageToken } from '@/lib/access';

export async function GET(request: NextRequest) {
  const access = verifyAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  if (!access) return NextResponse.json({ ok: false, message: 'Paid access is required.' }, { status: 401 });
  const month = currentUsageMonth();
  const existing = verifyAiUsageToken(request.cookies.get(AI_USAGE_COOKIE)?.value);
  const usage = existing?.month === month ? existing : { month, used: 0 };
  return NextResponse.json({ ok: true, enabled: access.plan === 'live_ai', month, used: usage.used, remaining: AI_MONTHLY_CREDITS - usage.used, total: AI_MONTHLY_CREDITS });
}
