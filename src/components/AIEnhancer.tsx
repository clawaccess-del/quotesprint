'use client';

import { useState } from 'react';

export function AIEnhancer({ enabled }: { enabled: boolean }) {
  const [action, setAction] = useState('rewrite');
  const [company, setCompany] = useState('Brand voice: clear, helpful, no-pressure. Differentiator: fast response, clean work, clear next steps.');
  const [industry, setIndustry] = useState('HVAC repair');
  const [source, setSource] = useState('Hi Jordan, your estimate is $521. We can reserve an opening this week with $156 down.');
  const [instruction, setInstruction] = useState('Make this sound more specific, confident, and customer-friendly.');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');
  const [remaining, setRemaining] = useState<number | null>(null);

  async function generate() {
    setStatus('Generating...');
    setOutput('');
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, company, industry, source, instruction }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.message || 'AI generation is unavailable.');
      return;
    }
    setOutput(data.output || '');
    setRemaining(data.remaining);
    setStatus(`Generated. ${data.remaining} AI credits left this month.`);
  }

  if (!enabled) {
    return (
      <section className="ai-panel locked">
        <span className="eyebrow">AI add-on</span>
        <h2>Need deeper customization?</h2>
        <p>LeadSprint Live works without AI. Upgrade to Live + AI when you want brand-voice rewrites, richer objection handling, and expanded follow-up sequences with 50 monthly AI credits.</p>
        <a className="button" href="/checkout?plan=live_ai">Upgrade to Live + AI</a>
      </section>
    );
  }

  return (
    <section className="ai-panel">
      <span className="eyebrow">Live + AI credits</span>
      <h2>Rewrite any quote or follow-up in your brand voice.</h2>
      <p>Use credits only when the playbook output needs a more custom touch. The non-AI builder remains available at all times.</p>
      <div className="ai-grid">
        <label>AI task
          <select value={action} onChange={(event) => setAction(event.target.value)}>
            <option value="rewrite">Rewrite or polish, 1 credit</option>
            <option value="objection">Handle an objection, 1 credit</option>
            <option value="email">Write a fuller email, 2 credits</option>
            <option value="sequence">Create an expanded sequence, 4 credits</option>
          </select>
        </label>
        <label>Industry or job type<input value={industry} onChange={(event) => setIndustry(event.target.value)} /></label>
      </div>
      <label>Company and brand context<textarea rows={3} value={company} onChange={(event) => setCompany(event.target.value)} /></label>
      <label>Draft, quote, or customer notes<textarea rows={4} value={source} onChange={(event) => setSource(event.target.value)} /></label>
      <label>What should AI improve?<textarea rows={2} value={instruction} onChange={(event) => setInstruction(event.target.value)} /></label>
      <button className="button" type="button" onClick={generate}>Use AI credits</button>
      {status ? <p className="fine-print">{status}</p> : null}
      {remaining !== null ? <p className="fine-print">Monthly cap: {remaining} of 50 credits remaining.</p> : null}
      {output ? <article className="copy-card"><h3>AI-enhanced copy</h3><pre>{output}</pre></article> : null}
    </section>
  );
}
