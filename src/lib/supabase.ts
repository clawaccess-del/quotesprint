const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type CompanyProfile = {
  business: string;
  serviceArea: string;
  brandVoice: string;
  differentiator: string;
  guarantee: string;
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

function headers() {
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
}

async function supabaseFetch(path: string, init?: RequestInit) {
  if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers(), ...(init?.headers || {}) },
    cache: 'no-store',
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Supabase ${response.status}: ${detail}`);
  }
  return response;
}

export async function getCompanyProfile(email: string) {
  const response = await supabaseFetch(`quote_profiles?email=eq.${encodeURIComponent(email)}&select=profile&limit=1`);
  const rows = await response.json();
  return rows?.[0]?.profile || null;
}

export async function saveCompanyProfile(email: string, profile: CompanyProfile) {
  await supabaseFetch('quote_profiles?on_conflict=email', {
    method: 'POST',
    body: JSON.stringify([{ email, profile, updated_at: new Date().toISOString() }]),
    headers: { Prefer: 'resolution=merge-duplicates' },
  });
}

export async function getQuotes(email: string) {
  const response = await supabaseFetch(`quote_history?email=eq.${encodeURIComponent(email)}&select=quote&order=created_at.desc&limit=50`);
  const rows = await response.json();
  return rows.map((row: { quote: StoredQuote }) => row.quote).filter(Boolean);
}

export async function saveQuote(email: string, quote: StoredQuote) {
  await supabaseFetch('quote_history?on_conflict=email,id', {
    method: 'POST',
    body: JSON.stringify([{ email, id: quote.id, quote, status: quote.status, created_at: quote.createdAt }]),
    headers: { Prefer: 'resolution=merge-duplicates' },
  });
}

export async function updateQuoteStatus(email: string, id: string, status: StoredQuote['status']) {
  const response = await supabaseFetch(`quote_history?email=eq.${encodeURIComponent(email)}&id=eq.${encodeURIComponent(id)}&select=quote&limit=1`);
  const rows = await response.json();
  const quote = rows?.[0]?.quote;
  if (!quote) return;
  quote.status = status;
  await supabaseFetch(`quote_history?email=eq.${encodeURIComponent(email)}&id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ quote, status }),
    headers: { Prefer: 'return=minimal' },
  });
}
