import Link from 'next/link';

const industries = ['HVAC', 'Plumbing', 'Painting', 'Roofing', 'Landscaping', 'Cleaning', 'Remodeling', 'Garage door', 'Pest control', 'Electrical'];
const expectations = ['Use LeadSprint with real leads for 6 months', 'Keep an open feedback line with us while the product is new', 'Tell us which features and integrations would actually help your team', 'Optional testimonial only if the product genuinely helps'];

export const metadata = {
  title: 'LeadSprint Founding Team Trial | 6 Months Free',
  description: 'Apply for one of 10 no-card, six-month LeadSprint founding partner trials for home-service businesses and sales teams that want a voice in new features and integrations.',
};

export default function FoundingTeamsPage() {
  return (
    <div className="page-shell founding-page">
      <section className="founding-hero">
        <div>
          <span className="eyebrow">10 founding team spots</span>
          <h1>Get LeadSprint free for 6 months as one of 10 founding partners.</h1>
          <p className="lead">We’re inviting 10 home-service businesses and sales teams into a hands-on product partnership: use LeadSprint with real leads, tell us what features and integrations would help, and we’ll build around the problems that matter most.</p>
          <div className="hero-actions">
            <a className="button" href="#apply">Apply for a free trial</a>
            <Link className="button secondary" href="/product">See the product</Link>
          </div>
        </div>
        <aside className="founding-card">
          <strong>Founding Team Trial</strong>
          <span>6 months free</span>
          <span>No card upfront</span>
          <span>10 founding partners only</span>
          <small>This is more than a trial. Selected teams get an open communication line with us while we shape new features, workflows, and integrations.</small>
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
          <h2>A live lead workspace for your company, plus a voice in what we build next.</h2>
        </div>
        <div className="feature-grid">
          <article><h2>Branded company profile</h2><p>Add your logo, service area, industry, voice, offer, ideal customer, and trust promise so the system writes like your business.</p></article>
          <article><h2>Lead pipeline + calendar</h2><p>Track new, qualified, quoted, followed-up, won, and lost leads with follow-up dates, appointment prep notes, and lead scoring.</p></article>
          <article><h2>Customer-specific responses</h2><p>Use customer notes, requested service, quote amount, appointment date, and reply context to generate more useful follow-ups.</p></article>
          <article><h2>Feature + integration input</h2><p>Tell us what would make LeadSprint more useful in your real workflow — reminders, CRM handoffs, calendar flows, email/SMS patterns, reporting, or industry-specific steps.</p></article>
          <article><h2>Open communication</h2><p>Founding partners get a direct feedback loop instead of a generic trial. We want practical requests from teams using the product with real opportunities.</p></article>
          <article><h2>Built around real operators</h2><p>The first 10 teams help shape what LeadSprint becomes, so the product grows around actual sales, office, and follow-up problems.</p></article>
        </div>
      </section>

      <section className="section split">
        <div>
          <span className="eyebrow">The trade</span>
          <h2>Free access in exchange for real-world partnership.</h2>
          <p>No card upfront. No obligation to stay after the trial. We’re looking for 10 practical teams that will keep an open line with us, share what they need, and help shape the features and integrations we build next.</p>
        </div>
        <div className="note-stack">
          {expectations.map((item) => <p key={item}>{item}</p>)}
        </div>
      </section>

      <section className="section" id="apply">
        <div className="trial-apply-card">
          <div>
            <span className="eyebrow">Apply now</span>
            <h2>Want one of the 10 founding partner spots?</h2>
            <p>Send a quick application with your company, industry, lead volume, biggest follow-up problem, and what integrations or features would make LeadSprint more valuable for your team.</p>
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
            <label>What is the biggest lead follow-up or quoting problem right now?<textarea name="biggest_problem" rows={4} placeholder="Tell us what gets missed, delayed, or hard to track." required /></label>
            <label>What features or integrations would you want us to build?<textarea name="feature_requests" rows={4} placeholder="Examples: calendar sync, CRM export, SMS/email workflows, reporting, lead source tracking, industry-specific steps." /></label>
            <button className="button full" type="submit">Apply for a founding partner spot</button>
            <p className="fine-print">If your email app does not open, send the same details to hello@leadsprint.app.</p>
          </form>
        </div>
      </section>
    </div>
  );
}
