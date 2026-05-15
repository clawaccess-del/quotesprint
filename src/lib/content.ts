export const brand = {
  name: 'QuoteSprint',
  tagline: 'Quote faster. Follow up sharper. Win the job before the lead goes cold.',
  description:
    'A speed-to-lead quote and follow-up kit for home-service businesses that need professional estimates, instant scripts, and repeatable sales workflows without buying a heavy CRM.',
};

export const plans = [
  {
    id: 'starter',
    name: 'Starter Kit',
    price: '$29',
    cadence: 'one-time',
    blurb: 'Templates and calculators for solo operators who need a better follow-up system today.',
    features: ['QuoteSprint quote builder', 'SMS and email follow-up scripts', 'Lead response checklist', 'Estimate confidence calculator'],
  },
  {
    id: 'pro',
    name: 'Pro Kit',
    price: '$79',
    cadence: 'one-time',
    blurb: 'The full operating kit for busy contractors, landscapers, cleaners, painters, and repair crews.',
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

export const industries = ['HVAC', 'plumbing', 'painting', 'landscaping', 'cleaning', 'roofing', 'handyman', 'pest control'];

export const researchNotes = [
  'Digital products work best when they solve a specific expensive problem, can be built once, and can be sold repeatedly.',
  'Home-service leads are highly time-sensitive, and fast first response is a measurable competitive advantage.',
  'Small operators often do not need another full CRM. They need sharper first-touch scripts, better quote framing, and faster follow-up.',
];
