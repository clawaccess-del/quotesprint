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
    body: JSON.stringify([{ email, company_name: '' }]),
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

function parseClient(row: ClientAccountRow): ClientAccount {
  return {
    id: row.id,
    email: row.email,
    companyName: row.company_name || '',
    contactName: row.contact_name || '',
    portalUsername: row.portal_username || '',
    plan: row.plan || 'live_ai',
    status: row.status || 'trial',
    notes: row.notes || '',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export async function listClientAccounts(): Promise<ClientAccount[]> {
  const response = await supabaseFetch('client_accounts?select=id,email,company_name,contact_name,portal_username,plan,status,notes,created_at,updated_at&order=created_at.desc');
  const rows = await response.json() as ClientAccountRow[];
  return rows.map(parseClient);
}


export type AdminClientAccount = ClientAccount & { companyProfile: CompanyProfile | null };

export async function listAdminClientAccounts(): Promise<AdminClientAccount[]> {
  const clients = await listClientAccounts();
  return Promise.all(clients.map(async (client) => ({
    ...client,
    companyProfile: await getCompanyProfile(client.email).catch(() => null),
  })));
}

export async function upsertClientAccount(input: Partial<ClientAccount> & { password?: string }) {
  const id = input.id || crypto.randomUUID();
  const now = new Date().toISOString();
  const body: Record<string, string> = {
    id,
    email: (input.email || '').trim().toLowerCase(),
    company_name: input.companyName || '',
    contact_name: input.contactName || '',
    portal_username: (input.portalUsername || '').trim().toLowerCase(),
    plan: input.plan || 'live_ai',
    status: input.status || 'trial',
    notes: input.notes || '',
    updated_at: now,
  };
  if (!input.id) body.created_at = now;
  if (input.password) body.password_hash = hashPassword(input.password);

  await getOrCreateProfile(body.email);
  const response = await supabaseFetch('client_accounts?on_conflict=id&select=id,email,company_name,contact_name,portal_username,plan,status,notes,created_at,updated_at', {
    method: 'POST',
    body: JSON.stringify([body]),
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
  });
  const rows = await response.json();
  return parseClient(rows[0]);
}

export async function verifyClientPasswordLogin(username: string, password: string) {
  const response = await supabaseFetch(`client_accounts?portal_username=eq.${encodeURIComponent(username.trim().toLowerCase())}&select=id,email,plan,status,password_hash&limit=1`);
  const rows = await response.json() as ClientAccountRow[];
  const row = rows?.[0];
  if (!row || row.status === 'cancelled' || row.status === 'paused') return null;
  if (!verifyPassword(password, row.password_hash)) return null;
  await getOrCreateProfile(row.email);
  return { email: row.email, plan: row.plan || 'live_ai', accountId: row.id };
}

function parseTicket(row: TicketRow): SupportTicket {
  return {
    id: row.id,
    customerEmail: row.customer_email,
    subject: row.subject,
    message: row.message,
    status: row.status || 'new',
    priority: row.priority || 'normal',
    adminResponse: row.admin_response || '',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export async function listTickets(email?: string) {
  const filter = email ? `customer_email=eq.${encodeURIComponent(email.toLowerCase())}&` : '';
  const response = await supabaseFetch(`support_tickets?${filter}select=id,customer_email,subject,message,status,priority,admin_response,created_at,updated_at&order=updated_at.desc`);
  const rows = await response.json();
  return rows.map(parseTicket);
}

export async function createTicket(email: string, input: { subject: string; message: string; priority?: SupportTicket['priority'] }) {
  const now = new Date().toISOString();
  const response = await supabaseFetch('support_tickets?select=id,customer_email,subject,message,status,priority,admin_response,created_at,updated_at', {
    method: 'POST',
    body: JSON.stringify([{
      id: crypto.randomUUID(),
      customer_email: email.toLowerCase(),
      subject: input.subject,
      message: input.message,
      priority: input.priority || 'normal',
      status: 'new',
      admin_response: '',
      created_at: now,
      updated_at: now,
    }]),
    headers: { Prefer: 'return=representation' },
  });
  const rows = await response.json();
  return parseTicket(rows[0]);
}

export async function updateTicket(id: string, input: Partial<Pick<SupportTicket, 'status' | 'priority' | 'adminResponse'>>) {
  const body: Record<string, string> = { updated_at: new Date().toISOString() };
  if (input.status) body.status = input.status;
  if (input.priority) body.priority = input.priority;
  if (typeof input.adminResponse === 'string') body.admin_response = input.adminResponse;
  const response = await supabaseFetch(`support_tickets?id=eq.${encodeURIComponent(id)}&select=id,customer_email,subject,message,status,priority,admin_response,created_at,updated_at`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { Prefer: 'return=representation' },
  });
  const rows = await response.json();
  return parseTicket(rows[0]);
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

type ClientUpdateRow = { id: string; customer_email: string; title: string; message: string; image_url?: string | null; link_url?: string | null; video_url?: string | null; created_at?: string };

function parseClientUpdate(row: ClientUpdateRow): ClientUpdate {
  return {
    id: row.id,
    customerEmail: row.customer_email,
    title: row.title,
    message: row.message,
    imageUrl: row.image_url || '',
    linkUrl: row.link_url || '',
    videoUrl: row.video_url || '',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function listClientUpdates(email: string) {
  const response = await supabaseFetch(`client_updates?customer_email=in.(${encodeURIComponent(email.toLowerCase())},all)&select=id,customer_email,title,message,image_url,link_url,video_url,created_at&order=created_at.desc&limit=50`);
  const rows = await response.json();
  return rows.map(parseClientUpdate);
}

export async function createClientUpdate(input: { customerEmail: string; title: string; message: string; imageUrl?: string; linkUrl?: string; videoUrl?: string }) {
  const response = await supabaseFetch('client_updates?select=id,customer_email,title,message,image_url,link_url,video_url,created_at', {
    method: 'POST',
    body: JSON.stringify([{
      id: crypto.randomUUID(),
      customer_email: input.customerEmail.trim().toLowerCase() || 'all',
      title: input.title,
      message: input.message,
      image_url: input.imageUrl || '',
      link_url: input.linkUrl || '',
      video_url: input.videoUrl || '',
      created_at: new Date().toISOString(),
    }]),
    headers: { Prefer: 'return=representation' },
  });
  const rows = await response.json();
  return parseClientUpdate(rows[0]);
}
