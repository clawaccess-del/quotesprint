import { NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_COOKIE,
  AI_MONTHLY_CREDITS,
  AI_USAGE_COOKIE,
  createAiUsageToken,
  currentUsageMonth,
  verifyAccessToken,
  verifyAiUsageToken,
} from '@/lib/access';

const creditCost: Record<string, number> = {
  rewrite: 1,
  objection: 1,
  email: 2,
  sequence: 4,
  social: 2,
  'follow-up-coach': 1,
};

export async function POST(request: NextRequest) {
  const access = verifyAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  if (!access) return NextResponse.json({ ok: false, message: 'Paid access is required.' }, { status: 401 });
  if (access.plan !== 'live_ai') return NextResponse.json({ ok: false, message: 'LeadSprint Live + AI is required for AI credits.' }, { status: 403 });

  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey) return NextResponse.json({ ok: false, message: 'AI generation is not active yet. Add OPENAI_API_KEY to enable this feature.' }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const action = String(body.action || 'rewrite');
  const cost = creditCost[action] || 1;
  const month = currentUsageMonth();
  const existing = verifyAiUsageToken(request.cookies.get(AI_USAGE_COOKIE)?.value);
  const usage = existing?.month === month ? existing : { month, used: 0 };
  const remaining = AI_MONTHLY_CREDITS - usage.used;

  if (remaining < cost) {
    return NextResponse.json({ ok: false, message: 'Monthly AI credits are used up. Upgrade or wait for next month.', remaining: 0 }, { status: 402 });
  }

  const company = String(body.company || '').slice(0, 1800);
  const industry = String(body.industry || '').slice(0, 220);
  const source = String(body.source || '').slice(0, 2200);
  const instruction = String(body.instruction || '').slice(0, 900);

  const prompt = `Company profile, use this as the source of truth:\n${company}\n\nIndustry/job context: ${industry}\n\nCustomer-facing draft or customer notes:\n${source}\n\nTask: ${action}. ${instruction}\n\nBefore writing, adapt the message to BOTH the company profile and the customer/lead information. If lead notes, next step, address, source, requested service, customer reply, appointment date, or quote details mention a specific service or situation, speak directly to that service/situation instead of relying only on the generic job type. Preserve useful facts from the draft, but do not produce generic copy that could fit any company or any customer. Return only polished customer-facing copy. Avoid internal notes, placeholders, or explanations.`;

  const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You write concise, specific, customer-facing sales copy for home-service businesses. The company profile and customer/lead information are mandatory context, not optional background. Every answer should sound like it came from that exact company to that exact customer. Use the lead notes, requested service, customer reply, address/service area, next step, appointment date, source, quote amount, industry, offer/specialty, brand voice, differentiator, trust promise, and contact details when relevant. Never mention that you are AI. Never output placeholders or internal notes.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.6,
      max_tokens: action === 'sequence' ? 520 : action === 'social' ? 420 : 320,
    }),
  });

  if (!aiResponse.ok) {
    return NextResponse.json({ ok: false, message: 'AI generation failed. Your credit was not used.' }, { status: 502 });
  }

  const data = await aiResponse.json();
  const output = data.choices?.[0]?.message?.content?.trim();
  const nextUsage = { month, used: usage.used + cost };
  const response = NextResponse.json({ ok: true, output, used: nextUsage.used, remaining: AI_MONTHLY_CREDITS - nextUsage.used, cost });
  response.cookies.set(AI_USAGE_COOKIE, createAiUsageToken(nextUsage), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 32,
  });
  return response;
}
