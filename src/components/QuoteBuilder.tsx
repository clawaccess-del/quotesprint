'use client';

import { useEffect, useMemo, useState } from 'react';

type QuoteStatus = 'open' | 'won' | 'lost';
type SavedQuote = {
  id: string;
  customer: string;
  jobType: string;
  total: number;
  depositDue: number;
  status: QuoteStatus;
  createdAt: string;
};

const jobTypes = ['HVAC repair', 'plumbing repair', 'painting project', 'landscaping visit', 'cleaning service', 'roof inspection', 'handyman job', 'pest control visit'];
const urgencyMultipliers: Record<string, number> = { normal: 1, soon: 1.12, emergency: 1.28 };
const tones: Record<string, string> = {
  direct: 'clear, confident, and to the point',
  warm: 'friendly, reassuring, and service-minded',
  premium: 'polished, calm, and high-trust',
};

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
  const [tone, setTone] = useState('direct');
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem('quotesprint-quotes');
    if (raw) setSavedQuotes(JSON.parse(raw));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('quotesprint-quotes', JSON.stringify(savedQuotes));
  }, [savedQuotes]);

  const result = useMemo(() => {
    const subtotal = laborHours * laborRate + materials;
    const total = subtotal * urgencyMultipliers[urgency];
    const depositDue = total * (deposit / 100);
    const firstName = customer.trim().split(' ')[0] || 'there';
    const timePhrase = urgency === 'emergency' ? 'today' : urgency === 'soon' ? 'this week' : 'when your schedule allows';
    const tonePhrase = tones[tone];
    const reason = urgency === 'emergency'
      ? 'because urgent service windows fill quickly'
      : urgency === 'soon'
        ? 'so we can keep your project moving while the details are fresh'
        : 'so you have a clear next step whenever you are ready';

    return {
      total,
      depositDue,
      sms: `Hi ${firstName}, this is ${business}. I put together the ${jobType.toLowerCase()} estimate: ${money(total)}. We can reserve your spot ${timePhrase} with a ${deposit}% deposit of ${money(depositDue)}. Want me to hold that opening?`,
      email: `Subject: ${jobType} estimate from ${business}\n\nHi ${firstName},\n\nThanks for reaching out. Your working estimate is ${money(total)}. That includes the expected labor, materials, and scheduling priority for this request.\n\nTo reserve the next available opening, the deposit is ${money(depositDue)} (${deposit}%). Once that is confirmed, we will lock in the appointment window and send any prep details you need.\n\nIf anything changes after inspection, we will walk you through it before work begins.\n\nBest,\n${business}`,
      call: `Open with: “Hi ${firstName}, this is ${business}. I saw your request for ${jobType.toLowerCase()} and wanted to help you get a clear answer quickly.”\n\nQualify: confirm address, timing, access, photos, and whether the issue needs priority scheduling.\n\nClose: “The working estimate is ${money(total)}. I can reserve the next opening with ${money(depositDue)} down ${reason}. Should I hold that spot for you?”`,
      aiAssist: `Use a ${tonePhrase} tone. Position the estimate as ${money(total)}, explain that the ${money(depositDue)} deposit reserves the appointment, and make the next step easy: reply yes to hold the opening or send one concern for a quick clarification.`,
      sequence: [
        `Day 0: Hi ${firstName}, this is ${business}. Your ${jobType.toLowerCase()} estimate is ${money(total)}. I can reserve the next opening with ${money(depositDue)} down. Want me to hold it?`,
        `Day 1: Quick follow-up, ${firstName}. I still have your ${jobType.toLowerCase()} estimate ready. If you want the current opening, I can reserve it with the ${deposit}% deposit.`,
        `Day 3: Hi ${firstName}, checking before we release this estimate window. Do you want us to keep the ${money(total)} ${jobType.toLowerCase()} quote active?`,
        `Day 7: Last touch from ${business}. If this project is still on your list, reply with “ready” and we will help you get scheduled.`
      ],
    };
  }, [business, customer, jobType, laborHours, laborRate, materials, urgency, deposit, tone]);

  const stats = useMemo(() => {
    const totalQuoted = savedQuotes.reduce((sum, quote) => sum + quote.total, 0);
    const won = savedQuotes.filter((quote) => quote.status === 'won');
    const open = savedQuotes.filter((quote) => quote.status === 'open');
    const winRate = savedQuotes.length ? Math.round((won.length / savedQuotes.length) * 100) : 0;
    return { totalQuoted, won: won.length, open: open.length, winRate };
  }, [savedQuotes]);

  function saveQuote() {
    const quote: SavedQuote = {
      id: crypto.randomUUID(),
      customer,
      jobType,
      total: result.total,
      depositDue: result.depositDue,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setSavedQuotes((quotes) => [quote, ...quotes].slice(0, 12));
  }

  function updateStatus(id: string, status: QuoteStatus) {
    setSavedQuotes((quotes) => quotes.map((quote) => quote.id === id ? { ...quote, status } : quote));
  }

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
        <label>Copy style<select value={tone} onChange={(e) => setTone(e.target.value)}><option value="direct">Direct</option><option value="warm">Warm</option><option value="premium">Premium</option></select></label>
        <button type="button" className="button full" onClick={saveQuote}>Save this quote</button>
      </form>
      <div className="output-panel">
        <div className="estimate-box">
          <small>Working estimate</small>
          <strong>{money(result.total)}</strong>
          <span>Deposit due: {money(result.depositDue)}</span>
        </div>
        <div className="mini-stats">
          <div><strong>{savedQuotes.length}</strong><span>saved quotes</span></div>
          <div><strong>{money(stats.totalQuoted)}</strong><span>quoted pipeline</span></div>
          <div><strong>{stats.winRate}%</strong><span>tracked win rate</span></div>
        </div>
        <Output title="SMS follow-up" text={result.sms} />
        <Output title="Email follow-up" text={result.email} />
        <Output title="Call script" text={result.call} />
        <Output title="Advanced copy direction" text={result.aiAssist} />
        <article className="copy-card">
          <h3>Follow-up sequence</h3>
          <ol className="sequence-list">{result.sequence.map((step) => <li key={step}>{step}</li>)}</ol>
        </article>
        <article className="copy-card">
          <h3>Saved quote history</h3>
          {savedQuotes.length ? (
            <div className="quote-list">
              {savedQuotes.map((quote) => (
                <div className="quote-row" key={quote.id}>
                  <div><strong>{quote.customer}</strong><span>{quote.jobType} · {money(quote.total)}</span></div>
                  <select value={quote.status} onChange={(e) => updateStatus(quote.id, e.target.value as QuoteStatus)} aria-label={`Status for ${quote.customer}`}>
                    <option value="open">Open</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              ))}
            </div>
          ) : <p>Save a quote to start tracking open estimates, won work, and lost opportunities.</p>}
        </article>
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
