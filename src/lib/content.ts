export const brand = {
  name: 'QuoteSprint',
  tagline: 'Quote faster. Follow up sharper. Win the job before the lead goes cold.',
  description:
    'A speed-to-lead quote, follow-up, and tracking system for home-service businesses that need professional estimates, instant scripts, and repeatable sales workflows without buying a heavy CRM.',
};

export const oneTimePlans = [
  {
    id: 'starter',
    name: 'Starter Kit',
    price: '$29',
    cadence: 'one-time',
    blurb: 'A focused toolkit for solo operators who want cleaner quotes and better follow-up today.',
    features: ['Quote and deposit calculator', 'SMS and email follow-up scripts', 'Lead response checklist', 'Estimate confidence calculator'],
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
    blurb: 'Use QuoteSprint workflows with multiple local-service clients or inside a small agency.',
    features: ['Everything in Pro', 'Client onboarding checklist', 'White-label script guidance', 'Multi-client campaign templates', 'Commercial usage license'],
  },
];

export const subscriptionPlans = [
  {
    id: 'live',
    name: 'QuoteSprint Live',
    price: '$29',
    cadence: 'per month',
    blurb: 'Keep every estimate, follow-up, and close opportunity moving with company-specific quote history, sequences, and performance tracking. No AI usage required.',
    features: ['Company profile and brand voice memory', 'Industry-specific quote playbooks', 'Saved quote history', 'Follow-up sequence generator', 'Monthly industry script drops', 'Win-rate and pipeline tracker'],
    featured: true,
  },
  {
    id: 'live_ai',
    name: 'QuoteSprint Live + AI',
    price: '$49',
    cadence: 'per month',
    blurb: 'Everything in QuoteSprint Live, plus usage-limited AI credits for deeper brand-voice rewrites and job-specific sales copy.',
    features: ['Everything in QuoteSprint Live', '100 AI credits per month', 'Brand-voice rewrites', 'Custom objection handling', 'Expanded follow-up sequences', 'Hard usage cap to protect cost'],
  },
];

export const plans = [...oneTimePlans, ...subscriptionPlans];

export const industries = ['HVAC', 'plumbing', 'electrical', 'painting', 'landscaping', 'cleaning', 'roofing', 'garage door', 'tree service', 'pool service', 'pressure washing', 'junk removal', 'flooring', 'remodeling', 'handyman', 'pest control'];

export const customerBenefits = [
  'Respond while the customer is still ready to book.',
  'Send estimates that sound confident, clear, and professional.',
  'Follow up without guessing what to say next.',
  'Track which quotes are open, won, or lost so no job disappears in the inbox.',
];

export const monthlyScriptDrops = [
  {
    title: 'Non-AI core system',
    copy: 'QuoteSprint Live keeps working with company profiles, industry playbooks, quote history, and tracking even if you never use the AI add-on.',
  },
  {
    title: 'Usage-limited AI layer',
    copy: 'Live + AI includes monthly credits for brand-voice rewrites, deeper objections, and expanded sequences without unlimited API exposure.',
  },
  {
    title: 'Trade-specific follow-up angles',
    copy: 'HVAC, roofing, plumbing, cleaning, painting, landscaping, handyman, and pest-control language that fits the job.',
  },
];
