import crypto from 'node:crypto';
import { hashPassword, verifyPassword } from '@/lib/security';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type CompanyProfile = {
  business: string;
  businessIndustry?: string;
  companyLogoUrl?: string;
  companyPhone?: string;
  companyWebsite?: string;
  companyOffer?: string;
  idealCustomer?: string;
  serviceArea: string;
  brandVoice: string;
  differentiator: string;
  guarantee: string;
};

export type StoredLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  status?: 'new' | 'quoted' | 'followed-up' | 'won' | 'lost';
  createdAt: string;
};

export type StoredQuote = {
  id: string;
  customer: string;
  jobType: string;
  total: number;
  depositDue: number;
  status: 'open' | 'won' | 'lost';
  winLossReason?: string;
  createdAt: string;
};

export type ClientAccount = {
  id: string;
  email: string;
  companyName: string;
  contactName: string;
  portalUsername: string;
  plan: string;
  status: 'active' | 'paused' | 'trial' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type SupportTicket = {
  id: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: 'new' | 'in-review' | 'planned' | 'in-progress' | 'waiting-on-client' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  adminResponse: string;
  createdAt: string;
  updatedAt: string;
};

type ProfileRow = { id: string; email: string; company_name?: string | null };
type QuoteRow = { id: string; customer_name: string; job_description?: string | null; total_amount?: number; status?: StoredQuote['status']; created_at?: string };
type LeadRow = { id: string; lead?: StoredLead; created_at?: string };
type ClientAccountRow = { id: string; email: string; company_name?: string | null; contact_name?: string | null; portal_username?: string | null; password_hash?: string | null; plan?: string | null; status?: ClientAccount['status'] | null; notes?: string | null; created_at?: string; updated_at?: string };
type TicketRow = { id: string; customer_email: string; subject: string; message: string; status?: SupportTicket['status']; priority?: SupportTicket['priority']; admin_response?: string | null; created_at?: string; updated_at?: string };

function headers(extra?: Record<string, string>) {
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function supabaseFetch(path: string, init?: RequestInit) {
  if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: headers(init?.headers as Record<string, string> | undefined),
    cache: 'no-store',
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Supabase ${response.status}: ${detail}`);
  }
  return response;
}

function profileFromCompanyName(value?: string | null): CompanyProfile | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object') return parsed as CompanyProfile;
  } catch {
    return { business: value, businessIndustry: 'HVAC', companyLogoUrl: '', companyPhone: '', companyWebsite: '', companyOffer: '', idealCustomer: 'homeowners who want clear communication and dependable service', serviceArea: 'the local area', brandVoice: 'clear, helpful, and no-pressure', differentiator: 'fast response, clean work, and clear next steps', guarantee: 'we explain any change before work begins' };
  }
  return null;
}

async function getOrCreateProfile(email: string): Promise<ProfileRow> {
  const existingResponse = await supabaseFetch(`profiles?email=eq.${encodeURIComponent(email)}&select=id,email,company_name&limit=1`);
  const existing = await existingResponse.json();
  if (existing?.[0]) return existing[0];

  const createResponse = await supabaseFetch('profiles?select=id,email,company_name', {
    method: 'POST',
    body: JSON.stringify([{ id: crypto.randomUUID(), email, company_name: '' }]),
    headers: { Prefer: 'return=representation' },
  });
  const created = await createResponse.json();
  return created[0];
}

export async function getCompanyProfile(email: string) {
  const profile = await getOrCreateProfile(email);
  return profileFromCompanyName(profile.company_name);
}

export async function saveCompanyProfile(email: string, profile: CompanyProfile) {
  const row = await getOrCreateProfile(email);
  await supabaseFetch(`profiles?id=eq.${encodeURIComponent(row.id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ company_name: JSON.stringify(profile) }),
    headers: { Prefer: 'return=minimal' },
  });
}

function parseQuote(row: QuoteRow): StoredQuote {
  try {
    const parsed = row.job_description ? JSON.parse(row.job_description) : null;
    if (parsed?.id) return { ...parsed, status: row.status || parsed.status || 'open' };
  } catch {}
  return {
    id: row.id,
    customer: row.customer_name,
    jobType: row.job_description || 'service quote',
    total: Number(row.total_amount || 0),
    depositDue: 0,
    status: row.status || 'open',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function getQuotes(email: string) {
  const profile = await getOrCreateProfile(email);
  const response = await supabaseFetch(`quotes?user_id=eq.${encodeURIComponent(profile.id)}&select=id,customer_name,job_description,total_amount,status,created_at&order=created_at.desc&limit=50`);
  const rows = await response.json();
  return rows.map(parseQuote);
}

export async function saveQuote(email: string, quote: StoredQuote) {
  const profile = await getOrCreateProfile(email);
  await supabaseFetch('quotes?on_conflict=id', {
    method: 'POST',
    body: JSON.stringify([{
      id: quote.id,
      user_id: profile.id,
      customer_name: quote.customer,
      job_description: JSON.stringify(quote),
      total_amount: quote.total,
      status: quote.status,
      created_at: quote.createdAt,
    }]),
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
  });
}

export async function updateQuoteStatus(email: string, id: string, status: StoredQuote['status']) {
  const profile = await getOrCreateProfile(email);
  const response = await supabaseFetch(`quotes?user_id=eq.${encodeURIComponent(profile.id)}&id=eq.${encodeURIComponent(id)}&select=job_description&limit=1`);
  const rows = await response.json();
  let jobDescription = rows?.[0]?.job_description;
  try {
    const quote = jobDescription ? JSON.parse(jobDescription) : null;
    if (quote) {
      quote.status = status;
      jobDescription = JSON.stringify(quote);
    }
  } catch {}
  await supabaseFetch(`quotes?user_id=eq.${encodeURIComponent(profile.id)}&id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, job_description: jobDescription }),
    headers: { Prefer: 'return=minimal' },
  });
}

export async function getLeads(email: string) {
  const profile = await getOrCreateProfile(email);
  const response = await supabaseFetch(`leads?user_id=eq.${encodeURIComponent(profile.id)}&select=id,lead,created_at&order=created_at.desc&limit=100`);
  const rows = await response.json();
  return rows.map((row: LeadRow) => row.lead ? { ...row.lead, id: row.id } : null).filter(Boolean);
}

export async function saveLead(email: string, lead: StoredLead) {
  const profile = await getOrCreateProfile(email);
  await supabaseFetch('leads?on_conflict=id', {
    method: 'POST',
    body: JSON.stringify([{ id: lead.id, user_id: profile.id, lead, created_at: lead.createdAt }]),
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
  });
}


type SystemStored<T> = T & { kind: string; passwordHash?: string };

const SYSTEM_EMAILS = {
  clients: '__leadsprint_clients@system.local',
  tickets: '__leadsprint_tickets@system.local',
  updates: '__leadsprint_updates@system.local',
};

async function getSystemRows<T>(email: string, kind: string): Promise<Array<{ rowId: string; data: SystemStored<T> }>> {
  const profile = await getOrCreateProfile(email);
  const response = await supabaseFetch(`leads?user_id=eq.${encodeURIComponent(profile.id)}&select=id,lead,created_at&order=created_at.desc&limit=1000`);
  const rows = await response.json() as LeadRow[];
  return rows
    .map((row) => row.lead ? { rowId: row.id, data: row.lead as unknown as SystemStored<T> } : null)
    .filter((row): row is { rowId: string; data: SystemStored<T> } => Boolean(row && row.data.kind === kind));
}

async function saveSystemRecord<T extends { id: string; createdAt?: string; updatedAt?: string }>(email: string, kind: string, record: T) {
  const profile = await getOrCreateProfile(email);
  const now = new Date().toISOString();
  const existing = await getSystemRows<T>(email, kind);
  const match = existing.find((row) => row.data.id === record.id);
  const rowId = match?.rowId || crypto.randomUUID();
  const createdAt = record.createdAt || match?.data.createdAt || now;
  const payload = { ...match?.data, ...record, id: record.id, kind, createdAt, updatedAt: now };
  await supabaseFetch('leads?on_conflict=id', {
    method: 'POST',
    body: JSON.stringify([{ id: rowId, user_id: profile.id, lead: payload, created_at: createdAt }]),
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
  });
  return payload as T;
}

function stripPassword(client: ClientAccount & { passwordHash?: string }): ClientAccount {
  const { passwordHash: _passwordHash, ...safe } = client;
  return safe;
}

export async function listClientAccounts(): Promise<ClientAccount[]> {
  const rows = await getSystemRows<ClientAccount & { passwordHash?: string }>(SYSTEM_EMAILS.clients, 'client_account');
  return rows.map((row) => stripPassword(row.data)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export type AdminClientAccount = ClientAccount & { companyProfile: CompanyProfile | null };

export async function listAdminClientAccounts(): Promise<AdminClientAccount[]> {
  const clients = await listClientAccounts();
  return Promise.all(clients.map(async (client: ClientAccount) => ({
    ...client,
    companyProfile: await getCompanyProfile(client.email).catch(() => null),
  })));
}

export async function upsertClientAccount(input: Partial<ClientAccount> & { password?: string }) {
  const existing = await getSystemRows<ClientAccount & { passwordHash?: string }>(SYSTEM_EMAILS.clients, 'client_account');
  const matched = input.id ? existing.find((row) => row.data.id === input.id) : undefined;
  const now = new Date().toISOString();
  const id = input.id || crypto.randomUUID();
  const email = (input.email || matched?.data.email || '').trim().toLowerCase();
  const record: ClientAccount & { passwordHash?: string } = {
    id,
    email,
    companyName: input.companyName ?? matched?.data.companyName ?? '',
    contactName: input.contactName ?? matched?.data.contactName ?? '',
    portalUsername: (input.portalUsername ?? matched?.data.portalUsername ?? '').trim().toLowerCase(),
    plan: input.plan ?? matched?.data.plan ?? 'live_ai',
    status: input.status ?? matched?.data.status ?? 'trial',
    notes: input.notes ?? matched?.data.notes ?? '',
    createdAt: matched?.data.createdAt || now,
    updatedAt: now,
    passwordHash: input.password ? hashPassword(input.password) : matched?.data.passwordHash,
  };
  await getOrCreateProfile(email);
  const saved = await saveSystemRecord(SYSTEM_EMAILS.clients, 'client_account', record);
  return stripPassword(saved as ClientAccount & { passwordHash?: string });
}

export async function verifyClientPasswordLogin(username: string, password: string) {
  const rows = await getSystemRows<ClientAccount & { passwordHash?: string }>(SYSTEM_EMAILS.clients, 'client_account');
  const row = rows.find((item) => item.data.portalUsername === username.trim().toLowerCase())?.data;
  if (!row || row.status === 'cancelled' || row.status === 'paused') return null;
  if (!verifyPassword(password, row.passwordHash)) return null;
  await getOrCreateProfile(row.email);
  return { email: row.email, plan: row.plan || 'live_ai', accountId: row.id };
}

export async function listTickets(email?: string) {
  const rows = await getSystemRows<SupportTicket>(SYSTEM_EMAILS.tickets, 'support_ticket');
  return rows
    .map((row) => row.data)
    .filter((ticket) => !email || ticket.customerEmail === email.toLowerCase())
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function createTicket(email: string, input: { subject: string; message: string; priority?: SupportTicket['priority'] }) {
  const now = new Date().toISOString();
  const ticket: SupportTicket = {
    id: crypto.randomUUID(),
    customerEmail: email.toLowerCase(),
    subject: input.subject,
    message: input.message,
    priority: input.priority || 'normal',
    status: 'new',
    adminResponse: '',
    createdAt: now,
    updatedAt: now,
  };
  return saveSystemRecord(SYSTEM_EMAILS.tickets, 'support_ticket', ticket);
}

export async function updateTicket(id: string, input: Partial<Pick<SupportTicket, 'status' | 'priority' | 'adminResponse'>>) {
  const rows = await getSystemRows<SupportTicket>(SYSTEM_EMAILS.tickets, 'support_ticket');
  const existing = rows.find((row) => row.data.id === id)?.data;
  if (!existing) throw new Error('Ticket not found');
  return saveSystemRecord(SYSTEM_EMAILS.tickets, 'support_ticket', {
    ...existing,
    status: input.status || existing.status,
    priority: input.priority || existing.priority,
    adminResponse: typeof input.adminResponse === 'string' ? input.adminResponse : existing.adminResponse,
  });
}

export type ClientUpdate = {
  id: string;
  customerEmail: string;
  title: string;
  message: string;
  imageUrl: string;
  linkUrl: string;
  videoUrl: string;
  createdAt: string;
};

export async function listClientUpdates(email: string) {
  const rows = await getSystemRows<ClientUpdate>(SYSTEM_EMAILS.updates, 'client_update');
  return rows
    .map((row) => row.data)
    .filter((update) => update.customerEmail === 'all' || update.customerEmail === email.toLowerCase())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 50);
}

export async function createClientUpdate(input: { customerEmail: string; title: string; message: string; imageUrl?: string; linkUrl?: string; videoUrl?: string }) {
  const now = new Date().toISOString();
  const update: ClientUpdate = {
    id: crypto.randomUUID(),
    customerEmail: input.customerEmail.trim().toLowerCase() || 'all',
    title: input.title,
    message: input.message,
    imageUrl: input.imageUrl || '',
    linkUrl: input.linkUrl || '',
    videoUrl: input.videoUrl || '',
    createdAt: now,
  };
  return saveSystemRecord(SYSTEM_EMAILS.updates, 'client_update', update);
}
