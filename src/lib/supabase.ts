const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type CompanyProfile = {
  business: string;
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
  createdAt: string;
};

type ProfileRow = { id: string; email: string; company_name?: string | null };
type QuoteRow = { id: string; customer_name: string; job_description?: string | null; total_amount?: number; status?: StoredQuote['status']; created_at?: string };
type LeadRow = { id: string; lead?: StoredLead; created_at?: string };

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
    return { business: value, serviceArea: 'the local area', brandVoice: 'clear, helpful, and no-pressure', differentiator: 'fast response, clean work, and clear next steps', guarantee: 'we explain any change before work begins' };
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
