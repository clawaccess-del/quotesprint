-- QuoteSprint account storage schema
-- The current app uses existing public.profiles and public.quotes tables.
-- Run the leads table section below in Supabase SQL Editor if it does not exist yet.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lead jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists leads_user_created_idx
  on public.leads (user_id, created_at desc);

alter table public.leads enable row level security;

-- The app writes through the server-side service role key. No public anon policies are required.
