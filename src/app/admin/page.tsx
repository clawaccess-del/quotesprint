import { getAdminSession } from '@/lib/admin';
import { ClientAccount, SupportTicket, listClientAccounts, listTickets } from '@/lib/supabase';

const ticketStatuses = ['new', 'in-review', 'planned', 'in-progress', 'waiting-on-client', 'resolved', 'closed'];
const priorities = ['low', 'normal', 'high', 'urgent'];
const plans = ['starter', 'pro', 'agency', 'live', 'live_ai'];
const accountStatuses = ['trial', 'active', 'paused', 'cancelled'];

export default async function AdminPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const session = await getAdminSession();

  if (!session) {
    return (
      <section className="page-shell checkout-shell">
        <span className="eyebrow">Owner backend</span>
        <h1>Log in to manage LeadSprint.</h1>
        <p className="lead">This area is only for the LeadSprint owner. It manages client accounts, portal usernames/passwords, support tickets, and account updates.</p>
        <div className="checkout-card login-form">
          <a className="button full google-button" href="/api/admin/google/start">Continue with Google</a>
          <div className="login-divider"><span>or owner password</span></div>
          <form action="/api/admin/login" method="post">
            <label>Username<input name="username" required /></label>
            <label>Password<input type="password" name="password" required /></label>
            <button className="button full" type="submit">Log in</button>
          </form>
          {params?.error ? <p className="fine-print">Login failed. Check the owner username/password.</p> : null}
        </div>
      </section>
    );
  }

  const [clients, tickets]: [ClientAccount[], SupportTicket[]] = await Promise.all([
    listClientAccounts().catch(() => [] as ClientAccount[]),
    listTickets().catch(() => [] as SupportTicket[]),
  ]);

  return (
    <section className="page-shell wide admin-page">
      <span className="eyebrow">Owner backend</span>
      <h1>Manage clients, tickets, and account updates.</h1>
      <p className="lead">Create client portal accounts, reset usernames/passwords, update support ticket statuses, and send account notifications with links, image URLs, and video links.</p>

      <section className="admin-grid">
        <article className="checkout-card">
          <h2>Add or update a client account</h2>
          <form className="trial-form" action="/api/admin/client" method="post">
            <label>Existing client ID, optional<input name="id" placeholder="Leave blank for new client" /></label>
            <div className="two-col">
              <label>Company name<input name="companyName" required /></label>
              <label>Contact name<input name="contactName" /></label>
            </div>
            <label>Email<input type="email" name="email" required /></label>
            <div className="two-col">
              <label>Portal username<input name="portalUsername" required /></label>
              <label>Set/reset password<input type="password" name="password" placeholder="Leave blank to keep current" /></label>
            </div>
            <div className="two-col">
              <label>Plan<select name="plan" defaultValue="live_ai">{plans.map((plan) => <option key={plan}>{plan}</option>)}</select></label>
              <label>Status<select name="status" defaultValue="trial">{accountStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
            </div>
            <label>Internal notes<textarea name="notes" rows={4} /></label>
            <button className="button full" type="submit">Save client account</button>
          </form>
        </article>

        <article className="checkout-card">
          <h2>Send an account update / notification</h2>
          <p>Use <strong>all</strong> to send to every account, or enter one client email. Clients see these in their support portal.</p>
          <form className="trial-form" action="/api/admin/update" method="post">
            <label>Client email or all<input name="customerEmail" defaultValue="all" required /></label>
            <label>Title<input name="title" required placeholder="New feature update" /></label>
            <label>Message<textarea name="message" rows={5} required placeholder="What changed, what they should know, or what you need from them." /></label>
            <label>Image URL<input name="imageUrl" placeholder="https://..." /></label>
            <label>Link URL<input name="linkUrl" placeholder="https://..." /></label>
            <label>Video URL<input name="videoUrl" placeholder="https://youtube.com/... or Loom link" /></label>
            <button className="button full" type="submit">Send update</button>
          </form>
        </article>
      </section>

      <section className="section">
        <div className="section-heading"><span className="eyebrow">Support queue</span><h2>Tickets visible to you and the client.</h2></div>
        <div className="admin-list">
          {tickets.length ? tickets.map((ticket) => (
            <article className="checkout-card" key={ticket.id}>
              <div className="card-title-row"><div><h3>{ticket.subject}</h3><p className="fine-print">{ticket.customerEmail} · opened {new Date(ticket.createdAt).toLocaleString()}</p></div><span className={`status-pill status-${ticket.status}`}>{ticket.status}</span></div>
              <p>{ticket.message}</p>
              <form className="trial-form" action="/api/admin/ticket" method="post">
                <input type="hidden" name="id" value={ticket.id} />
                <div className="two-col">
                  <label>Status<select name="status" defaultValue={ticket.status}>{ticketStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
                  <label>Priority<select name="priority" defaultValue={ticket.priority}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
                </div>
                <label>Admin response visible to client<textarea name="adminResponse" rows={3} defaultValue={ticket.adminResponse} /></label>
                <button className="button secondary" type="submit">Update ticket</button>
              </form>
            </article>
          )) : <p>No tickets yet.</p>}
        </div>
      </section>

      <section className="section">
        <div className="section-heading"><span className="eyebrow">Client accounts</span><h2>Current portal accounts.</h2></div>
        <div className="admin-table">
          {clients.length ? clients.map((client) => (
            <div key={client.id} className="admin-row">
              <strong>{client.companyName || client.email}</strong>
              <span>{client.contactName || 'No contact'} · {client.email}</span>
              <span>Username: {client.portalUsername || 'not set'} · Plan: {client.plan} · Status: {client.status}</span>
              <small>ID: {client.id}</small>
            </div>
          )) : <p>No client accounts yet.</p>}
        </div>
      </section>
    </section>
  );
}
