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

type IndustryPlaybook = {
  label: string;
  proofPoint: string;
  urgencyReason: string;
  prepNote: string;
  qualify: string;
  objection: string;
  risk: string;
  closeBenefit: string;
};

const jobTypes = [
  'HVAC repair',
  'plumbing repair',
  'painting project',
  'landscaping visit',
  'cleaning service',
  'roof inspection',
  'handyman job',
  'pest control visit',
  'electrical repair',
  'garage door repair',
  'tree service',
  'pool service',
  'pressure washing',
  'junk removal',
  'flooring project',
  'remodeling estimate',
];

const playbooks: Record<string, IndustryPlaybook> = {
  'HVAC repair': {
    label: 'HVAC',
    proofPoint: 'licensed comfort diagnostics, clear repair options, and no-pressure guidance before work begins',
    urgencyReason: 'temperature swings can turn a small comfort issue into an urgent household problem',
    prepNote: 'Please make sure the thermostat, indoor unit, outdoor unit, and electrical panel are accessible before we arrive.',
    qualify: 'system age, thermostat behavior, unusual sounds, airflow, filter condition, and whether the home is losing heating or cooling now',
    objection: 'If the price feels unexpected, we can separate the must-fix repair from optional efficiency improvements so you can decide clearly.',
    risk: 'Waiting can strain the system, raise energy use, and make the appointment window harder to hold during peak weather.',
    closeBenefit: 'restore comfort and avoid a longer outage window',
  },
  'plumbing repair': {
    label: 'plumbing',
    proofPoint: 'clean repair work, clear water-shutoff guidance, and practical options before anything is opened up',
    urgencyReason: 'water problems can spread quickly and become more expensive when they sit',
    prepNote: 'Please clear the area around the fixture or leak and note where the main shutoff is if you know it.',
    qualify: 'active leak status, fixture location, water shutoff access, drainage symptoms, recent repairs, and photos of the affected area',
    objection: 'If you want to control cost, we can start with the immediate repair and quote any optional upgrades separately.',
    risk: 'Delaying can increase water damage, odors, drywall issues, and emergency scheduling costs.',
    closeBenefit: 'stop the issue before it spreads',
  },
  'painting project': {
    label: 'painting',
    proofPoint: 'careful prep, clean lines, protected surfaces, and a finish schedule that respects your home',
    urgencyReason: 'paint schedules fill quickly when weather and room availability line up',
    prepNote: 'Please note wall condition, color goals, furniture access, and any areas that need patching or trim detail.',
    qualify: 'square footage, surface condition, color changes, trim needs, ceiling height, furniture moving, and desired finish date',
    objection: 'If budget is the concern, we can phase the project by room or separate prep, walls, trim, and ceiling options.',
    risk: 'Waiting can push the project into a busier schedule and delay rooms you want finished for guests, listing photos, or seasonal plans.',
    closeBenefit: 'lock in the finish date and avoid schedule drift',
  },
  'landscaping visit': {
    label: 'landscaping',
    proofPoint: 'practical outdoor planning, clean execution, and recommendations that fit the property instead of overbuilding it',
    urgencyReason: 'landscape timing depends on weather, growth cycles, and crew availability',
    prepNote: 'Please share photos of the yard, access points, drainage concerns, and the areas you want handled first.',
    qualify: 'yard size, access, drainage, sun exposure, cleanup needs, plant or mulch preferences, and recurring maintenance goals',
    objection: 'If the full scope feels large, we can break it into a first cleanup, priority install, and maintenance plan.',
    risk: 'Delaying can let weeds, drainage, or overgrowth add more labor before the next available visit.',
    closeBenefit: 'get the property back under control while the timing is right',
  },
  'cleaning service': {
    label: 'cleaning',
    proofPoint: 'reliable arrival windows, room-by-room scope clarity, and a clean checklist before the visit starts',
    urgencyReason: 'cleaning slots go quickly before move-outs, events, holidays, and busy weekends',
    prepNote: 'Please note bedrooms, bathrooms, pets, parking, access instructions, and any priority areas.',
    qualify: 'home size, room count, cleaning level, pets, access, supplies, priority areas, and whether this is one-time or recurring',
    objection: 'If the full clean is more than expected, we can focus the first visit on kitchens, baths, floors, and the highest-impact areas.',
    risk: 'Waiting can make the clean longer, especially before events, move-outs, inspections, or recurring service starts.',
    closeBenefit: 'secure the cleaning window before the schedule fills',
  },
  'roof inspection': {
    label: 'roofing',
    proofPoint: 'documented inspection notes, clear photo findings, and repair-first guidance when replacement is not necessary',
    urgencyReason: 'roof issues can worsen with the next rain, wind, or heat cycle',
    prepNote: 'Please share any leak photos, ceiling stains, attic access notes, and the approximate roof age if you know it.',
    qualify: 'roof age, leak location, storm timing, shingle condition, attic access, insurance involvement, and visible interior damage',
    objection: 'If you are not ready for a large repair, we can start with the inspection and separate urgent fixes from longer-term recommendations.',
    risk: 'Delaying can turn a small flashing, shingle, or seal issue into interior water damage.',
    closeBenefit: 'find the issue before the next weather event',
  },
  'handyman job': {
    label: 'handyman',
    proofPoint: 'clear task lists, practical repair options, and one visit planned around the highest-priority fixes',
    urgencyReason: 'small repairs stack up and appointment blocks are easiest to use when the list is clear',
    prepNote: 'Please send photos, measurements, product links if parts are needed, and your top three priorities.',
    qualify: 'task list, photos, measurements, parts availability, wall type, access, and whether multiple small repairs should be bundled',
    objection: 'If the list is too much for one visit, we can prioritize safety, function, and the most visible repairs first.',
    risk: 'Waiting can leave small issues unfinished and make it harder to bundle the work efficiently.',
    closeBenefit: 'knock out the repair list with a clear plan',
  },
  'pest control visit': {
    label: 'pest control',
    proofPoint: 'targeted treatment plans, prevention guidance, and clear expectations for what happens after service',
    urgencyReason: 'pest activity can spread when entry points, nests, or food sources stay active',
    prepNote: 'Please note where you are seeing activity, whether pets or children are in the home, and any recent treatments.',
    qualify: 'pest type, activity location, frequency, entry points, pets, children, previous treatments, and indoor or outdoor concerns',
    objection: 'If you are unsure about treatment, we can begin with inspection and prevention steps before recommending a larger plan.',
    risk: 'Delaying can allow activity to spread, nests to grow, or entry points to stay open.',
    closeBenefit: 'identify the source and stop the activity early',
  },

  'electrical repair': {
    label: 'electrical',
    proofPoint: 'safe diagnostics, code-aware repair options, and clear explanations before panels, outlets, or fixtures are opened',
    urgencyReason: 'electrical issues can create safety risks and disrupt daily routines when they are ignored',
    prepNote: 'Please note the affected rooms, breaker behavior, fixture or outlet type, and any burning smells, flickering, or tripping patterns.',
    qualify: 'breaker activity, affected rooms, fixture type, age of the panel, recent changes, visible damage, and whether power is currently out',
    objection: 'If the full scope feels uncertain, we can start with diagnosis and separate the safety-critical repair from optional upgrades.',
    risk: 'Waiting can leave a safety issue unresolved, make troubleshooting harder, or allow repeated breaker trips to continue.',
    closeBenefit: 'restore safe, reliable power with a clear repair plan',
  },
  'garage door repair': {
    label: 'garage door',
    proofPoint: 'practical door diagnostics, spring and opener guidance, and repair-first recommendations when replacement is not needed',
    urgencyReason: 'a stuck or unreliable garage door can affect home access, security, and daily schedules',
    prepNote: 'Please keep vehicles clear of the door if possible and share whether the opener runs, the spring is broken, or the door is off track.',
    qualify: 'door movement, opener behavior, spring condition, track alignment, remote issues, door size, and whether the car is trapped inside',
    objection: 'If budget is the concern, we can separate the immediate function repair from quieter opener or door upgrade options.',
    risk: 'Waiting can make the door harder to move safely and may increase strain on tracks, rollers, springs, or the opener.',
    closeBenefit: 'get the door moving safely again and protect access to the home',
  },
  'tree service': {
    label: 'tree service',
    proofPoint: 'property-aware tree work, cleanup clarity, and recommendations that balance safety, health, and budget',
    urgencyReason: 'tree timing depends on weather, access, crew availability, and whether limbs are threatening structures or utilities',
    prepNote: 'Please share photos from multiple angles, note nearby structures or lines, and describe access for equipment or haul-off.',
    qualify: 'tree size, location, limb risk, storm damage, access, haul-off needs, stump grinding, and proximity to structures or utilities',
    objection: 'If the full removal feels like too much, we can separate urgent safety cuts, pruning, haul-off, and stump work.',
    risk: 'Waiting can increase property risk if weak limbs, storm damage, or overgrowth are already present.',
    closeBenefit: 'reduce property risk and get the cleanup scheduled safely',
  },
  'pool service': {
    label: 'pool service',
    proofPoint: 'clear water diagnostics, equipment checks, and maintenance recommendations that keep the pool usable',
    urgencyReason: 'pool problems can get more expensive when chemistry, algae, leaks, or equipment issues sit too long',
    prepNote: 'Please note pool size, water condition, equipment symptoms, last service date, and whether the pump is running.',
    qualify: 'water clarity, chemical history, pump behavior, filter type, pool size, leak signs, algae level, and recurring maintenance goals',
    objection: 'If the full cleanup is more than expected, we can start with water recovery and equipment diagnosis, then separate ongoing maintenance.',
    risk: 'Waiting can let water quality decline, strain equipment, and make the recovery visit more involved.',
    closeBenefit: 'get the pool back on track before the issue compounds',
  },
  'pressure washing': {
    label: 'pressure washing',
    proofPoint: 'surface-safe cleaning, clear scope, and the right pressure or soft-wash method for each material',
    urgencyReason: 'exterior cleaning schedules fill quickly around weather, listings, events, and seasonal curb-appeal projects',
    prepNote: 'Please share photos, note the surfaces to clean, water access, stains, and any delicate paint, siding, plants, or outdoor furniture.',
    qualify: 'surface type, square footage, staining, water access, height, plant protection, driveway or siding needs, and desired timing',
    objection: 'If the full exterior is too much at once, we can prioritize the driveway, entry, siding, or highest-visibility areas first.',
    risk: 'Waiting can let mildew, algae, and staining become more visible and harder to clean efficiently.',
    closeBenefit: 'refresh the property while the weather and schedule line up',
  },
  'junk removal': {
    label: 'junk removal',
    proofPoint: 'clear volume estimates, careful removal, and a simple haul-away plan before the crew arrives',
    urgencyReason: 'removal windows go quickly before moves, cleanouts, renovations, and weekend projects',
    prepNote: 'Please send photos of the items, note stairs or elevator access, parking, heavy materials, and anything that may require special disposal.',
    qualify: 'item volume, item type, stairs, parking, heavy materials, donation potential, disposal restrictions, and preferred pickup window',
    objection: 'If the total load is bigger than planned, we can prioritize the must-go items and quote the rest separately.',
    risk: 'Waiting can slow down moves, cleanouts, renovations, or listing prep when unwanted items stay in the way.',
    closeBenefit: 'clear the space quickly with a simple pickup plan',
  },
  'flooring project': {
    label: 'flooring',
    proofPoint: 'careful measurements, prep clarity, and flooring recommendations that fit the room, traffic, and budget',
    urgencyReason: 'flooring projects depend on material availability, room access, and installation calendar openings',
    prepNote: 'Please share room measurements, current flooring type, subfloor concerns, material preference, and whether furniture needs moving.',
    qualify: 'square footage, material type, subfloor condition, removal needs, stairs, transitions, furniture moving, and desired completion date',
    objection: 'If the project feels large, we can separate material, prep, removal, and installation options so the decision is clearer.',
    risk: 'Waiting can push installation dates out and delay rooms needed for move-ins, listings, rentals, or family use.',
    closeBenefit: 'lock in the material and installation window with a clear scope',
  },
  'remodeling estimate': {
    label: 'remodeling',
    proofPoint: 'scope clarity, phased options, and practical remodeling guidance before decisions become expensive',
    urgencyReason: 'remodeling timelines depend on scope, selections, permitting, materials, and contractor availability',
    prepNote: 'Please share photos, rough measurements, must-haves, budget range, timeline, and any inspiration images or product choices.',
    qualify: 'room type, scope, measurements, selections, budget range, timeline, permits, structural changes, and whether the home is occupied',
    objection: 'If the full remodel is more than expected, we can phase the work or separate must-have improvements from optional upgrades.',
    risk: 'Waiting can delay selections, scheduling, and material ordering, especially when the project has a target completion date.',
    closeBenefit: 'turn the idea into a clear scope, timeline, and next step',
  },
};

const urgencyMultipliers: Record<string, number> = { normal: 1, soon: 1.12, emergency: 1.28 };
const tones: Record<string, string> = {
  direct: 'clear, confident, and to the point',
  warm: 'friendly, reassuring, and service-minded',
  premium: 'polished, calm, and high-trust',
};

function money(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function servicePhrase(jobType: string) {
  return jobType.startsWith('HVAC') ? jobType : jobType.toLowerCase();
}

function lowerFirst(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export function QuoteBuilder({ accountEmail, aiEnabled }: { accountEmail?: string; aiEnabled?: boolean }) {
  const [business, setBusiness] = useState('Acme Home Services');
  const [serviceArea, setServiceArea] = useState('the local area');
  const [brandVoice, setBrandVoice] = useState('clear, helpful, and no-pressure');
  const [differentiator, setDifferentiator] = useState('fast response, clean work, and clear next steps');
  const [guarantee, setGuarantee] = useState('we explain any change before work begins');
  const [customer, setCustomer] = useState('Jordan');
  const [jobType, setJobType] = useState(jobTypes[0]);
  const [laborHours, setLaborHours] = useState(3);
  const [laborRate, setLaborRate] = useState(95);
  const [materials, setMaterials] = useState(180);
  const [urgency, setUrgency] = useState('soon');
  const [deposit, setDeposit] = useState(30);
  const [tone, setTone] = useState('direct');
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [customizedCopy, setCustomizedCopy] = useState<Record<string, string>>({});
  const [aiStatus, setAiStatus] = useState('');
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);

  useEffect(() => {
    const quoteRaw = window.localStorage.getItem('quotesprint-quotes');
    const profileRaw = window.localStorage.getItem('quotesprint-company-profile');
    if (quoteRaw) setSavedQuotes(JSON.parse(quoteRaw));
    if (profileRaw) {
      const profile = JSON.parse(profileRaw);
      setBusiness(profile.business || 'Acme Home Services');
      setServiceArea(profile.serviceArea || 'the local area');
      setBrandVoice(profile.brandVoice || 'clear, helpful, and no-pressure');
      setDifferentiator(profile.differentiator || 'fast response, clean work, and clear next steps');
      setGuarantee(profile.guarantee || 'we explain any change before work begins');
    }

    fetch('/api/account')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!data?.ok) return;
        if (data.profile) {
          setBusiness(data.profile.business || 'Acme Home Services');
          setServiceArea(data.profile.serviceArea || 'the local area');
          setBrandVoice(data.profile.brandVoice || 'clear, helpful, and no-pressure');
          setDifferentiator(data.profile.differentiator || 'fast response, clean work, and clear next steps');
          setGuarantee(data.profile.guarantee || 'we explain any change before work begins');
        }
        if (Array.isArray(data.quotes)) setSavedQuotes(data.quotes);
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('quotesprint-quotes', JSON.stringify(savedQuotes));
  }, [savedQuotes]);

  useEffect(() => {
    const profile = { business, serviceArea, brandVoice, differentiator, guarantee };
    window.localStorage.setItem('quotesprint-company-profile', JSON.stringify(profile));
    const timeout = window.setTimeout(() => {
      fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      }).catch(() => null);
    }, 600);
    return () => window.clearTimeout(timeout);
  }, [business, serviceArea, brandVoice, differentiator, guarantee]);

  useEffect(() => {
    setCustomizedCopy({});
    setAiStatus('Generated text updated from the current quote options.');
  }, [business, serviceArea, brandVoice, differentiator, guarantee, customer, jobType, laborHours, laborRate, materials, urgency, deposit, tone]);

  const result = useMemo(() => {
    const subtotal = laborHours * laborRate + materials;
    const total = subtotal * urgencyMultipliers[urgency];
    const depositDue = total * (deposit / 100);
    const firstName = customer.trim().split(' ')[0] || 'there';
    const timePhrase = urgency === 'emergency' ? 'an opening today' : urgency === 'soon' ? 'an opening this week' : 'an opening when your schedule allows';
    const serviceRequest = servicePhrase(jobType);
    const riskSentence = lowerFirst(playbooks[jobType].risk);
    const playbook = playbooks[jobType];
    const tonePhrase = `${tones[tone]}, with a brand voice that feels ${brandVoice}`;
    const bookingReason = urgency === 'emergency'
      ? `${playbook.urgencyReason}, so reserving the appointment now protects the fastest available response`
      : urgency === 'soon'
        ? `${playbook.urgencyReason}, so holding the slot now keeps the project moving`
        : `it gives you a clear next step without pressure`;

    return {
      total,
      depositDue,
      playbook,
      sms: `Hi ${firstName}, this is ${business}. I reviewed the ${serviceRequest} details and put together a working estimate of ${money(total)}. For ${serviceArea}, our focus is ${differentiator}. We can reserve ${timePhrase} with ${money(depositDue)} down. Want me to hold it?`,
      email: `Subject: ${jobType} estimate from ${business}\n\nHi ${firstName},\n\nThanks for reaching out to ${business}. Your working estimate is ${money(total)} for this ${serviceRequest}. That includes the expected labor, materials, and scheduling priority based on what you shared.\n\nWhat matters for this type of work: ${playbook.risk}\n\nWhy customers choose us: ${differentiator}. Our approach is ${playbook.proofPoint}.\n\nTo reserve the next available opening, the deposit is ${money(depositDue)} (${deposit}%). ${playbook.prepNote}\n\nIf anything changes after we see the job in person, ${guarantee}.\n\nBest,\n${business}`,
      call: `Open with: “Hi ${firstName}, this is ${business}. I saw your ${serviceRequest} request and wanted to help you get a clear answer quickly.”\n\nMatch the brand voice: ${tonePhrase}.\n\nQualify for this job: ask about ${playbook.qualify}.\n\nBuild confidence: “For this kind of work, we focus on ${playbook.proofPoint}. The main reason to handle it now is that ${riskSentence}”\n\nClose: “The working estimate is ${money(total)}. I can reserve the next opening with ${money(depositDue)} down because ${bookingReason}. Should I hold that spot for you?”`,
      sequence: [
        `Day 0: Hi ${firstName}, this is ${business}. Your ${serviceRequest} estimate is ${money(total)}. Because ${playbook.urgencyReason}, I can reserve the next opening with ${money(depositDue)} down. Want me to hold it?`,
        `Day 1: Quick follow-up, ${firstName}. For this ${serviceRequest}, the main thing to avoid is that ${riskSentence} If you want the current opening, I can reserve it with the ${deposit}% deposit.`,
        `Day 3: Hi ${firstName}, checking before we release this ${serviceRequest} estimate window. ${playbook.prepNote} Do you want us to keep the ${money(total)} quote active?`,
        `Day 7: Last touch from ${business}. If this is still on your list, reply “ready” and we will help you ${playbook.closeBenefit}.`
      ],
      objectionReply: `If ${firstName} hesitates on price: “I understand. ${playbook.objection} The estimate is ${money(total)}, and the ${money(depositDue)} deposit simply reserves the appointment so we can keep the schedule clear for you.”`,
    };
  }, [business, serviceArea, brandVoice, differentiator, guarantee, customer, jobType, laborHours, laborRate, materials, urgency, deposit, tone]);

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
    setSavedQuotes((quotes) => [quote, ...quotes].slice(0, 50));
    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quote }),
    }).catch(() => null);
  }

  function updateStatus(id: string, status: QuoteStatus) {
    setSavedQuotes((quotes) => quotes.map((quote) => quote.id === id ? { ...quote, status } : quote));
    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).catch(() => null);
  }

  async function enhanceCopy(title: string, text: string, action = 'rewrite') {
    if (generatingSection) return;
    setGeneratingSection(title);
    setAiStatus(`Customizing ${title.toLowerCase()}...`);
    const company = `Business: ${business}\nService area: ${serviceArea}\nBrand voice: ${brandVoice}\nWhy customers choose us: ${differentiator}\nTrust promise: ${guarantee}`;
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        company,
        industry: jobType,
        source: text,
        instruction: `Add a deeper customization layer for ${customer}. Keep it customer-facing, specific to the job type, and ready to send.`,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setAiStatus(data.message || 'AI customization is unavailable.');
      setGeneratingSection(null);
      return;
    }
    if (data.output) setCustomizedCopy((copy) => ({ ...copy, [title]: data.output }));
    setAiStatus(`Customized ${title.toLowerCase()}. ${data.remaining} AI credits left this month.`);
    setGeneratingSection(null);
  }

  return (
    <section className="builder-grid">
      <form className="builder-panel">
        <div className="form-section-title">Company profile</div>
        <label>Business name<input value={business} onChange={(e) => setBusiness(e.target.value)} /></label>
        <label>Service area<input value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} placeholder="Charleston, SC" /></label>
        <label>Brand voice<input value={brandVoice} onChange={(e) => setBrandVoice(e.target.value)} placeholder="friendly, expert, premium, direct" /></label>
        <label>Why customers choose you<textarea value={differentiator} onChange={(e) => setDifferentiator(e.target.value)} rows={3} /></label>
        <label>Trust promise<textarea value={guarantee} onChange={(e) => setGuarantee(e.target.value)} rows={2} /></label>

        <div className="form-section-title">Quote details</div>
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
        <button type="button" className="button secondary full" onClick={() => { setCustomizedCopy({}); setAiStatus('Generated text refreshed from the current quote options.'); }}>Refresh generated text</button>
        <button type="button" className="button full" onClick={saveQuote}>Save this quote</button>
      </form>
      <div className="output-panel">
        <div className="estimate-box">
          <small>{result.playbook.label} working estimate</small>
          <strong>{money(result.total)}</strong>
          <span>Deposit due: {money(result.depositDue)}</span>
        </div>
        <div className="industry-card">
          <strong>{result.playbook.label} playbook applied</strong>
          <p>{result.playbook.risk}</p>
          <span>{result.playbook.prepNote}</span>
        </div>
        {accountEmail ? <p className="fine-print">Saving to account: {accountEmail}</p> : null}
        <div className="mini-stats">
          <div><strong>{savedQuotes.length}</strong><span>saved quotes</span></div>
          <div><strong>{money(stats.totalQuoted)}</strong><span>quoted pipeline</span></div>
          <div><strong>{stats.winRate}%</strong><span>tracked win rate</span></div>
        </div>
        <div className="ai-inline-panel"><span className="eyebrow">Live preview</span><p>Change the quote options on the left to update these scripts before saving. Saving only adds the current quote to history.</p>{aiStatus ? <p className="fine-print">{aiStatus}</p> : null}{aiEnabled ? <p className="fine-print">Use AI when a section needs an extra custom pass for the customer, job, and brand voice.</p> : null}</div>
        <Output title="SMS follow-up" text={customizedCopy['SMS follow-up'] || result.sms} customized={Boolean(customizedCopy['SMS follow-up'])} aiEnabled={aiEnabled} generating={generatingSection === 'SMS follow-up'} disabled={Boolean(generatingSection)} onEnhance={() => enhanceCopy('SMS follow-up', customizedCopy['SMS follow-up'] || result.sms, 'rewrite')} />
        <Output title="Email follow-up" text={customizedCopy['Email follow-up'] || result.email} customized={Boolean(customizedCopy['Email follow-up'])} aiEnabled={aiEnabled} generating={generatingSection === 'Email follow-up'} disabled={Boolean(generatingSection)} onEnhance={() => enhanceCopy('Email follow-up', customizedCopy['Email follow-up'] || result.email, 'email')} />
        <Output title="Call script" text={customizedCopy['Call script'] || result.call} customized={Boolean(customizedCopy['Call script'])} aiEnabled={aiEnabled} generating={generatingSection === 'Call script'} disabled={Boolean(generatingSection)} onEnhance={() => enhanceCopy('Call script', customizedCopy['Call script'] || result.call, 'rewrite')} />
        <Output title="Objection response" text={customizedCopy['Objection response'] || result.objectionReply} customized={Boolean(customizedCopy['Objection response'])} aiEnabled={aiEnabled} generating={generatingSection === 'Objection response'} disabled={Boolean(generatingSection)} onEnhance={() => enhanceCopy('Objection response', customizedCopy['Objection response'] || result.objectionReply, 'objection')} />
        <article className="copy-card">
          <div className="card-title-row"><h3>Follow-up sequence {customizedCopy['Follow-up sequence'] ? <span className="customized-badge">AI customized</span> : null}</h3>{aiEnabled ? <button className="button mini" type="button" disabled={Boolean(generatingSection)} onClick={() => enhanceCopy('Follow-up sequence', customizedCopy['Follow-up sequence'] || result.sequence.join('\n'), 'sequence')}>{generatingSection === 'Follow-up sequence' ? <><span className="spinner" /> Generating</> : customizedCopy['Follow-up sequence'] ? 'Customize again' : 'Customize with AI'}</button> : null}</div>
          {customizedCopy['Follow-up sequence'] ? <pre>{customizedCopy['Follow-up sequence']}</pre> : <ol className="sequence-list">{result.sequence.map((step) => <li key={step}>{step}</li>)}</ol>}
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

function Output({ title, text, customized, aiEnabled, generating, disabled, onEnhance }: { title: string; text: string; customized?: boolean; aiEnabled?: boolean; generating?: boolean; disabled?: boolean; onEnhance?: () => void }) {
  return (
    <article className="copy-card">
      <div className="card-title-row"><h3>{title} {customized ? <span className="customized-badge">AI customized</span> : null}</h3>{aiEnabled ? <button className="button mini" type="button" disabled={disabled} onClick={onEnhance}>{generating ? <><span className="spinner" /> Generating</> : customized ? 'Customize again' : 'Customize with AI'}</button> : null}</div>
      <pre>{text}</pre>
    </article>
  );
}
