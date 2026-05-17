-- LeadSprint admin/client portal support tables
-- Run in Supabase SQL editor before using /admin and /support.

create table if not exists public.client_accounts (
  id uuid primary key,
  email text not null unique,
  company_name text default '',
  contact_name text default '',
  portal_username text unique,
  password_hash text,
  plan text default 'live_ai',
  status text default 'trial',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.support_tickets (
  id uuid primary key,
  customer_email text not null,
  subject text not null,
  message text not null,
  status text default 'new',
  priority text default 'normal',
  admin_response text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.client_updates (
  id uuid primary key,
  customer_email text not null default 'all',
  title text not null,
  message text not null,
  image_url text default '',
  link_url text default '',
  video_url text default '',
  created_at timestamptz default now()
);

create index if not exists client_accounts_email_idx on public.client_accounts (email);
create index if not exists client_accounts_username_idx on public.client_accounts (portal_username);
create index if not exists support_tickets_customer_email_idx on public.support_tickets (customer_email);
create index if not exists support_tickets_status_idx on public.support_tickets (status);
create index if not exists client_updates_customer_email_idx on public.client_updates (customer_email);

-- Keep RLS off for now because the Next.js server uses the Supabase service-role key.
-- If public anon access is added later, enable RLS and add explicit policies.
