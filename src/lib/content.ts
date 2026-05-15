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
    blurb: 'Keep every estimate, follow-up, and close opportunity moving with live quote history, sequences, and performance tracking.',
    features: ['Saved quote history', 'Follow-up sequence generator', 'Monthly industry script drops', 'Win-rate and pipeline tracker', 'Advanced tone and objection copy'],
    featured: true,
  },
];

export const plans = [...oneTimePlans, ...subscriptionPlans];

export const industries = ['HVAC', 'plumbing', 'painting', 'landscaping', 'cleaning', 'roofing', 'handyman', 'pest control'];

export const customerBenefits = [
  'Respond while the customer is still ready to book.',
  'Send estimates that sound confident, clear, and professional.',
  'Follow up without guessing what to say next.',
  'Track which quotes are open, won, or lost so no job disappears in the inbox.',
];

export const monthlyScriptDrops = [
  {
    title: 'Seasonal urgency packs',
    copy: 'Fresh scripts for weather spikes, peak-season demand, slow weeks, storm calls, and end-of-month booking pushes.',
  },
  {
    title: 'Trade-specific follow-up angles',
    copy: 'HVAC, roofing, plumbing, cleaning, painting, landscaping, handyman, and pest-control language that fits the job.',
  },
  {
    title: 'Objection handling updates',
    copy: 'New responses for price shoppers, delayed decisions, competitor comparisons, deposit hesitation, and scheduling friction.',
  },
];
