'use client';

import { useMemo, useState } from 'react';

const jobTypes = ['HVAC repair', 'plumbing repair', 'painting project', 'landscaping visit', 'cleaning service', 'roof inspection', 'handyman job'];
const urgencyMultipliers: Record<string, number> = { normal: 1, soon: 1.12, emergency: 1.28 };

function money(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function QuoteBuilder() {
  const [business, setBusiness] = useState('Acme Home Services');
  const [customer, setCustomer] = useState('Jordan');
  const [jobType, setJobType] = useState(jobTypes[0]);
  const [laborHours, setLaborHours] = useState(3);
  const [laborRate, setLaborRate] = useState(95);
  const [materials, setMaterials] = useState(180);
  const [urgency, setUrgency] = useState('soon');
  const [deposit, setDeposit] = useState(30);

  const result = useMemo(() => {
    const subtotal = laborHours * laborRate + materials;
    const total = subtotal * urgencyMultipliers[urgency];
    const depositDue = total * (deposit / 100);
    const firstName = customer.trim().split(' ')[0] || 'there';
    const timePhrase = urgency === 'emergency' ? 'today' : urgency === 'soon' ? 'this week' : 'when your schedule allows';
    return {
      total,
      depositDue,
      sms: `Hi ${firstName}, this is ${business}. Based on the ${jobType.toLowerCase()} details, the working estimate is ${money(total)}. We can reserve your spot ${timePhrase} with a ${deposit}% deposit of ${money(depositDue)}. Want me to hold that opening?`,
      email: `Subject: ${jobType} estimate from ${business}\n\nHi ${firstName},\n\nThanks for reaching out. Based on the details you shared, your working estimate is ${money(total)}. That includes labor, materials, and the current scheduling urgency.\n\nTo reserve the next opening, the deposit is ${money(depositDue)} (${deposit}%). Once confirmed, we will lock in the appointment window and send a simple prep checklist.\n\nIf anything changes after inspection, we will explain it before work begins.\n\nBest,\n${business}`,
      call: `Open with: “Hi ${firstName}, this is ${business}. I saw your request for ${jobType.toLowerCase()} and wanted to catch you before you had to keep calling around.”\n\nQualify: confirm address, timing, access, photos, and whether the issue is urgent.\n\nClose: “The working range is around ${money(total)}. I can hold the next opening with ${money(depositDue)} down. Should I reserve that for you?”`,
    };
  }, [business, customer, jobType, laborHours, laborRate, materials, urgency, deposit]);

  return (
    <section className="builder-grid">
      <form className="builder-panel">
        <label>Business name<input value={business} onChange={(e) => setBusiness(e.target.value)} /></label>
        <label>Customer name<input value={customer} onChange={(e) => setCustomer(e.target.value)} /></label>
        <label>Job type<select value={jobType} onChange={(e) => setJobType(e.target.value)}>{jobTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <div className="two-col">
          <label>Labor hours<input type="number" min="1" value={laborHours} onChange={(e) => setLaborHours(Number(e.target.value))} /></label>
          <label>Hourly rate<input type="number" min="25" value={laborRate} onChange={(e) => setLaborRate(Number(e.target.value))} /></label>
        </div>
        <div className="two-col">
          <label>Materials<input type="number" min="0" value={materials} onChange={(e) => setMaterials(Number(e.target.value))} /></label>
          <label>Deposit %<input type="number" min="0" max="100" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} /></label>
        </div>
        <label>Urgency<select value={urgency} onChange={(e) => setUrgency(e.target.value)}><option value="normal">Flexible</option><option value="soon">Soon</option><option value="emergency">Emergency</option></select></label>
      </form>
      <div className="output-panel">
        <div className="estimate-box">
          <small>Working estimate</small>
          <strong>{money(result.total)}</strong>
          <span>Deposit due: {money(result.depositDue)}</span>
        </div>
        <Output title="SMS follow-up" text={result.sms} />
        <Output title="Email follow-up" text={result.email} />
        <Output title="Call script" text={result.call} />
      </div>
    </section>
  );
}

function Output({ title, text }: { title: string; text: string }) {
  return (
    <article className="copy-card">
      <h3>{title}</h3>
      <pre>{text}</pre>
    </article>
  );
}
