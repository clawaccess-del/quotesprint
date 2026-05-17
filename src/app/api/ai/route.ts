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
  sequence: 3,
  social: 2,
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

  const company = String(body.company || '').slice(0, 1200);
  const industry = String(body.industry || '').slice(0, 120);
  const source = String(body.source || '').slice(0, 3000);
  const instruction = String(body.instruction || '').slice(0, 800);

  const prompt = `Company and brand context:\n${company}\n\nIndustry/job context: ${industry}\n\nCustomer-facing draft or notes:\n${source}\n\nTask: ${action}. ${instruction}\n\nReturn only polished customer-facing copy. Avoid internal notes, placeholders, or explanations.`;

  const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You write concise, specific, customer-facing sales copy for home-service businesses. Use the provided company voice and industry context. Never mention that you are AI.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.6,
      max_tokens: action === 'sequence' || action === 'social' ? 650 : 420,
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
