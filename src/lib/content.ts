export const brand = {
  name: 'LeadSprint',
  tagline: 'Capture the lead, quote the job, follow up, and keep every opportunity moving.',
  description:
    'A lightweight lead management system for home-service businesses that need fast intake, professional estimates, organized follow-up, and simple pipeline tracking without buying a heavy CRM.',
};

export const oneTimePlans = [
  {
    id: 'starter',
    name: 'Starter Kit',
    price: '$29',
    cadence: 'one-time',
    blurb: 'A focused toolkit for solo operators who want cleaner lead intake, quotes, and follow-up today.',
    features: ['Lead response checklist', 'Quote and deposit calculator', 'SMS and email follow-up scripts', 'Estimate confidence calculator'],
  },
  {
    id: 'pro',
    name: 'Pro Kit',
    price: '$79',
    cadence: 'one-time',
    blurb: 'The complete workflow kit for busy contractors, landscapers, cleaners, painters, and repair crews.',
    features: ['Everything in Starter', 'Deposit and urgency language', 'Objection handling scripts', 'Job-type prompt library', 'Seasonal campaign calendar'],
    featured: true,
  },
  {
    id: 'agency',
    name: 'Agency License',
    price: '$199',
    cadence: 'one-time',
    blurb: 'Use LeadSprint workflows with multiple local-service clients or inside a small agency.',
    features: ['Everything in Pro', 'Client onboarding checklist', 'White-label script guidance', 'Multi-client campaign templates', 'Commercial usage license'],
  },
];

export const subscriptionPlans = [
  {
    id: 'live',
    name: 'LeadSprint Live',
    price: '$29',
    cadence: 'per month',
    blurb: 'Keep every lead, estimate, follow-up, and close opportunity moving with company-specific history, sequences, and performance tracking. No AI usage required.',
    features: ['Company profile and brand voice memory', 'Lead and customer history', 'Industry-specific quote playbooks', 'Follow-up sequence generator', 'Monthly sales workflow drops', 'Win-rate and pipeline tracker'],
    featured: true,
  },
  {
    id: 'live_ai',
    name: 'LeadSprint Live + AI',
    price: '$49',
    cadence: 'per month',
    blurb: 'Everything in LeadSprint Live, plus usage-limited AI credits for deeper brand-voice rewrites and job-specific sales copy.',
    features: ['Everything in LeadSprint Live', '50 AI credits per month', 'Brand-voice rewrites', 'Custom objection handling', 'Expanded follow-up sequences', 'Hard usage cap to protect cost'],
  },
];

export const plans = [...oneTimePlans, ...subscriptionPlans];

export const industries = ['HVAC', 'plumbing', 'electrical', 'painting', 'landscaping', 'cleaning', 'roofing', 'garage door', 'tree service', 'pool service', 'pressure washing', 'junk removal', 'flooring', 'remodeling', 'handyman', 'pest control'];

export const customerBenefits = [
  'Capture new leads before they get buried in calls, texts, and inboxes.',
  'Respond while the customer is still ready to book.',
  'Send estimates that sound confident, clear, and professional.',
  'Track every opportunity from new lead to quoted, followed-up, won, or lost.',
];

export const monthlyScriptDrops = [
  {
    title: 'Lead command center',
    copy: 'LeadSprint Live keeps working with company profiles, customer records, quote history, follow-up stages, and pipeline tracking even if you never use the AI add-on.',
  },
  {
    title: 'Usage-limited AI layer',
    copy: 'Live + AI includes monthly credits for brand-voice rewrites, deeper objections, and expanded sequences without unlimited API exposure.',
  },
  {
    title: 'Trade-specific sales workflows',
    copy: 'HVAC, roofing, plumbing, cleaning, painting, landscaping, handyman, and pest-control workflows that fit the lead, the job, and the next step.',
  },
];
