-- PlotWorthy — Phase 0/1 schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query → paste → Run).

-- Application status
do $$ begin
  create type application_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

-- User roles (Phase 0 foundation; profiles link to Supabase auth users)
do $$ begin
  create type user_role as enum ('client', 'professional', 'admin');
exception when duplicate_object then null; end $$;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'client',
  full_name text,
  created_at timestamptz not null default now()
);

-- Professional applications (Phase 1)
create table if not exists professional_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  discipline text not null,
  coverage text,            -- e.g. "B13, B14, B15"
  accreditations text,      -- e.g. "ARB, RIBA"
  insurance text,           -- e.g. "PI cover £2m — Hiscox"
  website text,
  about text,
  status application_status not null default 'pending',
  decided_at timestamptz,
  decided_by text,
  created_at timestamptz not null default now()
);

create index if not exists idx_prof_apps_status on professional_applications(status);
create index if not exists idx_prof_apps_created on professional_applications(created_at desc);

-- Enable RLS. The app writes/reads via the service-role key (server only),
-- which bypasses RLS, so we intentionally add NO public policies. This keeps
-- the tables private to server code.
alter table professional_applications enable row level security;
alter table profiles enable row level security;

-- Auto-create a profile row when a new auth user signs up (for Phase 0).
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
