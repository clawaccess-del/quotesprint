import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, verifyAccessToken } from '@/lib/access';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type DownloadProduct = 'starter' | 'pro' | 'agency';

const planRank: Record<string, number> = {
  starter: 1,
  pro: 2,
  agency: 3,
  live: 2,
  live_ai: 2,
};

const productRank: Record<DownloadProduct, number> = {
  starter: 1,
  pro: 2,
  agency: 3,
};

const productTitles: Record<DownloadProduct, string> = {
  starter: 'LeadSprint Starter Kit',
  pro: 'LeadSprint Pro Kit',
  agency: 'LeadSprint Agency License Kit',
};

function isDownloadProduct(value: string | null): value is DownloadProduct {
  return value === 'starter' || value === 'pro' || value === 'agency';
}

function kitContent(product: DownloadProduct) {
  const shared = `# ${productTitles[product]}\n\nLeadSprint is a lightweight lead management workflow for home-service businesses. Use this offline kit alongside the live workspace to keep lead response, quoting, follow-up, and pipeline review consistent.\n\n## Speed-to-lead checklist\n- Reply within 5 minutes when possible.\n- Capture name, phone, email, address, service need, urgency, photos, and preferred appointment windows.\n- Confirm the next step in one sentence.\n- Save the lead status as New, Quoted, Followed up, Won, or Lost.\n\n## Lead intake script\nThanks for reaching out. I can help with that. To point you in the right direction, can you send the service address, a quick description of what is happening, and a couple photos if possible? Once I have that, I can give you the clearest next step and timing.\n\n## Estimate delivery SMS\nHi {{first_name}}, thanks again for the details. Based on what you shared, the working estimate is {{estimate_total}} with {{deposit_amount}} due to reserve the appointment. If you want us to hold the next available opening, reply YES and I will send the next step.\n\n## Follow-up sequence\nDay 0: Send estimate and deposit/reservation next step.\nDay 1: Quick check-in while the job is still fresh.\nDay 3: Ask whether timing, scope, or budget changed.\nDay 7: Final helpful check-in before closing the open quote.\n\n## Pipeline review\nReview open leads daily. Move anything that has been quoted but not answered into Followed up. Mark Won or Lost with a reason so your future follow-up gets sharper.\n`;

  if (product === 'starter') return shared;

  const pro = `\n## Objection handling\nPrice: If you want to control cost, we can separate the must-do work from optional upgrades so you can choose the simplest next step.\nTiming: If this week is tight, I can give you the next available window and keep the quote active until then.\nComparing quotes: Totally fair. The biggest thing is making sure each quote includes the same scope, materials, prep, and cleanup so you are comparing apples to apples.\n\n## Seasonal campaign prompts\n- Slow week: reach back out to estimates from the last 30 days with a simple schedule-opening message.\n- Busy week: ask new leads to send photos first so you can prioritize urgent jobs.\n- Weather/event week: lead with prevention, safety, or deadline-based booking language.\n`;

  if (product === 'pro') return shared + pro;

  return shared + pro + `\n## Agency usage notes\nUse this workflow with multiple local-service clients. Create one company profile per client, document their tone, service area, proof points, offer, and follow-up rules, then keep each client pipeline separate.\n\n## Client onboarding checklist\n- Business name, service area, trade, and ideal jobs.\n- Brand voice and trust promise.\n- Common objections and preferred responses.\n- Deposit policy and booking process.\n- Lead sources and desired status stages.\n`;
}

export async function GET(request: NextRequest) {
  const access = verifyAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  if (!access) return NextResponse.json({ ok: false, message: 'Login required.' }, { status: 401 });

  const product = request.nextUrl.searchParams.get('product');
  if (!isDownloadProduct(product)) return NextResponse.json({ ok: false, message: 'Unknown download.' }, { status: 400 });

  if ((planRank[access.plan] || 0) < productRank[product]) {
    return NextResponse.json({ ok: false, message: 'This download is not included with your plan.' }, { status: 403 });
  }

  return new NextResponse(kitContent(product), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="leadsprint-${product}-kit.md"`,
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
