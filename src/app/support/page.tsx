import Link from 'next/link';
import { cookies } from 'next/headers';
import { ACCESS_COOKIE, verifyAccessToken } from '@/lib/access';
import { ClientUpdate, SupportTicket, listClientUpdates, listTickets } from '@/lib/supabase';

const priorities = ['low', 'normal', 'high', 'urgent'];

export default async function SupportPage() {
  const cookieStore = await cookies();
  const access = verifyAccessToken(cookieStore.get(ACCESS_COOKIE)?.value);
  const email = access?.customerEmail?.toLowerCase();

  if (!access || !email) {
    return (
      <section className="page-shell checkout-shell">
        <span className="eyebrow">Client support</span>
        <h1>Log in to submit tickets.</h1>
        <p className="lead">Client support, feature requests, and account updates are available inside the LeadSprint dashboard.</p>
        <Link href="/login" className="button">Log in</Link>
      </section>
    );
  }

  const [tickets, updates]: [SupportTicket[], ClientUpdate[]] = await Promise.all([
    listTickets(email).catch(() => [] as SupportTicket[]),
    listClientUpdates(email).catch(() => [] as ClientUpdate[]),
  ]);

  return (
    <section className="page-shell wide support-page">
      <span className="eyebrow">Client support portal</span>
      <h1>Tickets, updates, and feature requests.</h1>
      <p className="lead">This is the communication hub between your team and LeadSprint. Submit support tickets, request features or integrations, and track status changes from the same place.</p>

      <section className="section split support-intro">
        <div>
          <span className="eyebrow">First time here?</span>
          <h2>How the ticketing system works.</h2>
          <p>Use tickets for bugs, setup help, workflow questions, feature requests, integration ideas, or anything that blocks your team. Every ticket gets a visible status, so you and LeadSprint can see whether it is new, being reviewed, planned, in progress, waiting on you, resolved, or closed.</p>
        </div>
        <div className="note-stack">
          <p><strong>New:</strong> We received it.</p>
          <p><strong>In review:</strong> We are checking the request and deciding the best next step.</p>
          <p><strong>Planned / in progress:</strong> It is queued or actively being worked on.</p>
          <p><strong>Waiting on client:</strong> We need more details from you.</p>
          <p><strong>Resolved / closed:</strong> The issue is complete or no longer active.</p>
        </div>
      </section>

      <section className="admin-grid">
        <article className="checkout-card">
          <h2>Submit a ticket or feature request</h2>
          <form className="trial-form" action="/api/tickets" method="post">
            <label>Subject<input name="subject" required placeholder="Calendar integration request" /></label>
            <label>Priority<select name="priority" defaultValue="normal">{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
            <label>What do you need?<textarea name="message" rows={7} required placeholder="Include the workflow, screenshots/links if useful, and what outcome would help your team." /></label>
            <button className="button full" type="submit">Submit ticket</button>
          </form>
        </article>

        <article className="checkout-card">
          <h2>Account notifications</h2>
          <p>Updates from LeadSprint appear here. These may include release notes, setup instructions, images, links, or video walkthroughs.</p>
          <div className="notification-list">
            {updates.length ? updates.map((update) => (
              <div className="notification-card" key={update.id}>
                <strong>{update.title}</strong>
                <small>{new Date(update.createdAt).toLocaleString()}</small>
                <p>{update.message}</p>
                {update.imageUrl ? <img src={update.imageUrl} alt="LeadSprint update visual" /> : null}
                <div className="hero-actions">
                  {update.linkUrl ? <a className="button secondary" href={update.linkUrl} target="_blank">Open link</a> : null}
                  {update.videoUrl ? <a className="button secondary" href={update.videoUrl} target="_blank">Watch video</a> : null}
                </div>
              </div>
            )) : <p>No account updates yet.</p>}
          </div>
        </article>
      </section>

      <section className="section">
        <div className="section-heading"><span className="eyebrow">Your tickets</span><h2>Status everyone can see.</h2></div>
        <div className="admin-list">
          {tickets.length ? tickets.map((ticket) => (
            <article className="checkout-card" key={ticket.id}>
              <div className="card-title-row"><div><h3>{ticket.subject}</h3><p className="fine-print">Opened {new Date(ticket.createdAt).toLocaleString()} · Priority: {ticket.priority}</p></div><span className={`status-pill status-${ticket.status}`}>{ticket.status}</span></div>
              <p>{ticket.message}</p>
              {ticket.adminResponse ? <div className="admin-response"><strong>LeadSprint response</strong><p>{ticket.adminResponse}</p></div> : null}
            </article>
          )) : <p>No tickets yet. Submit your first request above.</p>}
        </div>
      </section>
    </section>
  );
}
