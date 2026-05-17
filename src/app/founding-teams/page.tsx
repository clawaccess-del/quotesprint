import Link from 'next/link';

const industries = ['HVAC', 'Plumbing', 'Painting', 'Roofing', 'Landscaping', 'Cleaning', 'Remodeling', 'Garage door', 'Pest control', 'Electrical'];
const expectations = ['Use LeadSprint with real leads for 6 months', 'Share honest product feedback', 'Join one short setup/feedback call if selected', 'Optional testimonial only if the product genuinely helps'];

export const metadata = {
  title: 'LeadSprint Founding Team Trial | 6 Months Free',
  description: 'Apply for one of 10 no-card, six-month LeadSprint founding team trials for home-service businesses and sales teams.',
};

export default function FoundingTeamsPage() {
  return (
    <div className="page-shell founding-page">
      <section className="founding-hero">
        <div>
          <span className="eyebrow">10 founding team spots</span>
          <h1>Get LeadSprint free for 6 months. No card upfront.</h1>
          <p className="lead">We’re inviting 10 home-service businesses and sales teams to use LeadSprint while we shape the product around real lead intake, quoting, follow-up, calendars, and pipeline workflows.</p>
          <div className="hero-actions">
            <a className="button" href="#apply">Apply for a free trial</a>
            <Link className="button secondary" href="/product">See the product</Link>
          </div>
        </div>
        <aside className="founding-card">
          <strong>Founding Team Trial</strong>
          <span>6 months free</span>
          <span>No card upfront</span>
          <span>10 teams selected</span>
          <small>Built for owners, office managers, dispatchers, and sales teams that need every lead followed up.</small>
        </aside>
      </section>

      <section className="section split">
        <div>
          <span className="eyebrow">Who it is for</span>
          <h2>Teams that win or lose jobs in the first few follow-ups.</h2>
          <p>If your business gets calls, forms, Facebook messages, referrals, or ad leads and needs a cleaner way to respond, quote, schedule, and follow up, this trial is for you.</p>
        </div>
        <div className="industry-grid founding-industries">
          {industries.map((industry) => <span key={industry}>{industry}</span>)}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">What you get</span>
          <h2>A live lead workspace for your company, not a generic trial account.</h2>
        </div>
        <div className="feature-grid">
          <article><h2>Branded company profile</h2><p>Add your logo, service area, industry, voice, offer, ideal customer, and trust promise so the system writes like your business.</p></article>
          <article><h2>Lead pipeline + calendar</h2><p>Track new, qualified, quoted, followed-up, won, and lost leads with follow-up dates, appointment prep notes, and lead scoring.</p></article>
          <article><h2>Customer-specific responses</h2><p>Use customer notes, requested service, quote amount, appointment date, and reply context to generate more useful follow-ups.</p></article>
        </div>
      </section>

      <section className="section split">
        <div>
          <span className="eyebrow">The trade</span>
          <h2>Free access in exchange for real-world feedback.</h2>
          <p>No card upfront. No obligation to stay after the trial. We’re looking for practical feedback from real teams using LeadSprint with real opportunities.</p>
        </div>
        <div className="note-stack">
          {expectations.map((item) => <p key={item}>{item}</p>)}
        </div>
      </section>

      <section className="section" id="apply">
        <div className="trial-apply-card">
          <div>
            <span className="eyebrow">Apply now</span>
            <h2>Want one of the 10 founding team trials?</h2>
            <p>Send a quick application with your company, industry, lead volume, and biggest follow-up problem. We’ll review and reply with next steps.</p>
          </div>
          <form className="trial-form" action="mailto:hello@leadsprint.app" method="post" encType="text/plain">
            <label>Company name<input name="company" placeholder="Acme Home Services" required /></label>
            <label>Your name<input name="name" placeholder="Your name" required /></label>
            <div className="two-col">
              <label>Email<input type="email" name="email" placeholder="you@company.com" required /></label>
              <label>Phone<input name="phone" placeholder="(555) 555-5555" /></label>
            </div>
            <div className="two-col">
              <label>Industry<input name="industry" placeholder="HVAC, plumbing, painting..." required /></label>
              <label>Service area<input name="service_area" placeholder="City / region" /></label>
            </div>
            <label>How many new leads do you handle in a typical month?<input name="monthly_leads" placeholder="Example: 25-50" /></label>
            <label>What is the biggest lead follow-up or quoting problem right now?<textarea name="biggest_problem" rows={5} placeholder="Tell us what gets missed, delayed, or hard to track." required /></label>
            <button className="button full" type="submit">Apply for a founding team trial</button>
            <p className="fine-print">If your email app does not open, send the same details to hello@leadsprint.app.</p>
          </form>
        </div>
      </section>
    </div>
  );
}
