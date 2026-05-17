import { NextResponse } from 'next/server';

function clean(value: FormDataEntryValue | null) {
  return String(value || '').trim();
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.FOUNDING_APPLICATION_TO;
  const from = process.env.AUTH_EMAIL_FROM || 'LeadSprint <login@quotesprint.app>';

  const application = {
    company: clean(formData.get('company')),
    name: clean(formData.get('name')),
    email: clean(formData.get('email')),
    phone: clean(formData.get('phone')),
    industry: clean(formData.get('industry')),
    serviceArea: clean(formData.get('service_area')),
    monthlyLeads: clean(formData.get('monthly_leads')),
    biggestProblem: clean(formData.get('biggest_problem')),
    featureRequests: clean(formData.get('feature_requests')),
  };

  if (!application.company || !application.name || !application.email || !application.industry || !application.biggestProblem) {
    return NextResponse.redirect(`${siteUrl}/founding-teams?error=missing#apply`, 303);
  }

  if (!apiKey || !to) {
    console.error('Founding application email is not configured. Set RESEND_API_KEY and FOUNDING_APPLICATION_TO.');
    return NextResponse.redirect(`${siteUrl}/founding-teams?error=config#apply`, 303);
  }

  const rows = [
    ['Company', application.company],
    ['Name', application.name],
    ['Email', application.email],
    ['Phone', application.phone],
    ['Industry', application.industry],
    ['Service area', application.serviceArea],
    ['Monthly leads', application.monthlyLeads],
    ['Biggest follow-up problem', application.biggestProblem],
    ['Feature or integration requests', application.featureRequests],
  ];

  const htmlRows = rows.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong><br/>${escapeHtml(value || 'Not provided').replaceAll('\n', '<br/>')}</p>`).join('\n');
  const textRows = rows.map(([label, value]) => `${label}:\n${value || 'Not provided'}`).join('\n\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: application.email,
        subject: `LeadSprint founding partner application — ${application.company}`,
        html: `<h1>New LeadSprint founding partner application</h1>${htmlRows}`,
        text: `New LeadSprint founding partner application\n\n${textRows}`,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Resend failed: ${response.status} ${body}`);
    }
  } catch (error) {
    console.error('Founding application email failed', error);
    return NextResponse.redirect(`${siteUrl}/founding-teams?error=send#apply`, 303);
  }

  return NextResponse.redirect(`${siteUrl}/founding-teams?applied=1#apply`, 303);
}
