-- QuoteSprint account storage schema
-- Run this in Supabase SQL Editor for the QuoteSprint project.

create table if not exists public.quote_profiles (
  email text primary key,
  profile jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_history (
  email text not null,
  id text not null,
  quote jsonb not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  primary key (email, id)
);

create index if not exists quote_history_email_created_idx
  on public.quote_history (email, created_at desc);

alter table public.quote_profiles enable row level security;
alter table public.quote_history enable row level security;

-- The app writes through the server-side service role key. No public anon policies are required.
