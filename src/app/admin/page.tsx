import { getAdminSession } from '@/lib/admin';
import { AdminClientAccount, SupportTicket, listAdminClientAccounts, listTickets } from '@/lib/supabase';

const ticketStatuses = ['new', 'in-review', 'planned', 'in-progress', 'waiting-on-client', 'resolved', 'closed'];
const priorities = ['low', 'normal', 'high', 'urgent'];
const plans = ['starter', 'pro', 'agency', 'live', 'live_ai'];
const accountStatuses = ['trial', 'active', 'paused', 'cancelled'];
const companyFields = [
  ['business', 'Business name'],
  ['businessIndustry', 'Industry'],
  ['companyLogoUrl', 'Logo URL'],
  ['companyPhone', 'Company phone'],
  ['companyWebsite', 'Website'],
  ['companyOffer', 'Main offer'],
  ['idealCustomer', 'Ideal customer'],
  ['serviceArea', 'Service area'],
  ['brandVoice', 'Brand voice'],
  ['differentiator', 'Differentiator'],
  ['guarantee', 'Trust promise / guarantee'],
] as const;

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

  const [clients, tickets]: [AdminClientAccount[], SupportTicket[]] = await Promise.all([
    listAdminClientAccounts().catch(() => [] as AdminClientAccount[]),
    listTickets().catch(() => [] as SupportTicket[]),
  ]);

  return (
    <section className="page-shell wide admin-page">
      <span className="eyebrow">Owner backend</span>
      <h1>Manage clients, tickets, and account updates.</h1>
      <p className="lead">Create client portal accounts, reset usernames/passwords, edit company profiles, update support ticket statuses, and send account notifications.</p>

      <nav className="admin-top-nav">
        <a href="#client-accounts">Client accounts</a>
        <a href="#account-updates">Account updates</a>
        <a href="#support-queue">Support tickets</a>
      </nav>

      <section className="section" id="client-accounts">
        <div className="section-heading"><span className="eyebrow">Client accounts</span><h2>Click a client below, then manage their account and company profile.</h2></div>
        <article className="checkout-card client-create-card">
          <h2>Add a new client account</h2>
          <form className="trial-form" action="/api/admin/client" method="post">
            <div className="two-col">
              <label>Company name<input name="companyName" required /></label>
              <label>Contact name<input name="contactName" /></label>
            </div>
            <label>Email<input type="email" name="email" required /></label>
            <div className="two-col">
              <label>Portal username<input name="portalUsername" required /></label>
              <label>Set password<input type="password" name="password" required /></label>
            </div>
            <div className="two-col">
              <label>Plan<select name="plan" defaultValue="live_ai">{plans.map((plan) => <option key={plan}>{plan}</option>)}</select></label>
              <label>Status<select name="status" defaultValue="trial">{accountStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
            </div>
            <label>Internal notes<textarea name="notes" rows={3} /></label>
            <button className="button full" type="submit">Create client account</button>
          </form>
        </article>

        <div className="client-account-list">
          {clients.length ? clients.map((client) => {
            const profile = client.companyProfile;
            return (
              <details className="client-account-card" key={client.id}>
                <summary>
                  <strong>{client.companyName || profile?.business || client.email}</strong>
                  <span>{client.email} · {client.status} · {client.plan}</span>
                </summary>
                <div className="admin-grid client-edit-grid">
                  <article className="checkout-card">
                    <h2>Account access</h2>
                    <form className="trial-form" action="/api/admin/client" method="post">
                      <input type="hidden" name="id" value={client.id} />
                      <div className="two-col">
                        <label>Company name<input name="companyName" defaultValue={client.companyName} required /></label>
                        <label>Contact name<input name="contactName" defaultValue={client.contactName} /></label>
                      </div>
                      <label>Email<input type="email" name="email" defaultValue={client.email} required /></label>
                      <div className="two-col">
                        <label>Portal username<input name="portalUsername" defaultValue={client.portalUsername} required /></label>
                        <label>Reset password<input type="password" name="password" placeholder="Leave blank to keep current" /></label>
                      </div>
                      <div className="two-col">
                        <label>Plan<select name="plan" defaultValue={client.plan}>{plans.map((plan) => <option key={plan}>{plan}</option>)}</select></label>
                        <label>Status<select name="status" defaultValue={client.status}>{accountStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
                      </div>
                      <label>Internal notes<textarea name="notes" rows={4} defaultValue={client.notes} /></label>
                      <button className="button secondary" type="submit">Save account access</button>
                    </form>
                  </article>

                  <article className="checkout-card">
                    <h2>Company profile from client dashboard</h2>
                    <p>These are the same profile fields the client enters on the front end. Changes here update what LeadSprint uses for their generated copy and workflow.</p>
                    <form className="trial-form" action="/api/admin/company" method="post">
                      <input type="hidden" name="email" value={client.email} />
                      {companyFields.map(([name, label]) => (
                        <label key={name}>{label}
                          {['idealCustomer', 'brandVoice', 'differentiator', 'guarantee', 'companyOffer'].includes(name)
                            ? <textarea name={name} rows={3} defaultValue={(profile?.[name] as string) || ''} />
                            : <input name={name} defaultValue={(profile?.[name] as string) || ''} />}
                        </label>
                      ))}
                      <button className="button secondary" type="submit">Save company profile</button>
                    </form>
                  </article>
                </div>
              </details>
            );
          }) : <p>No client accounts yet. Add the first one above.</p>}
        </div>
      </section>

      <section className="section" id="account-updates">
        <div className="section-heading"><span className="eyebrow">Account updates</span><h2>Send notifications into client accounts.</h2></div>
        <article className="checkout-card">
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

      <section className="section" id="support-queue">
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
    </section>
  );
}
