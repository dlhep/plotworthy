-- Prepared for review. Do not apply to production without a backup and release approval.
create extension if not exists postgis with schema extensions;

create table if not exists public.hmo_license_locations (
  id uuid primary key default gen_random_uuid(),
  local_authority text not null,
  licence_reference text not null,
  address text not null,
  postcode text not null,
  licence_status text,
  max_persons integer check (max_persons is null or max_persons > 0),
  max_households integer check (max_households is null or max_households > 0),
  valid_from date,
  valid_until date,
  latitude double precision,
  longitude double precision,
  location extensions.geography(point, 4326),
  source_url text not null,
  source_date date not null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (local_authority, licence_reference)
);

create index if not exists hmo_license_locations_location_gix
  on public.hmo_license_locations using gist (location);
create index if not exists hmo_license_locations_postcode_idx
  on public.hmo_license_locations (postcode);
create index if not exists hmo_license_locations_source_date_idx
  on public.hmo_license_locations (source_date desc);

create table if not exists public.feasibility_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  address text not null,
  postcode text not null,
  project_type text not null check (project_type in ('hmo', 'flats', 'extension', 'land', 'other')),
  property_type text not null check (property_type in ('house', 'flat', 'commercial', 'land', 'other')),
  inputs jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'checking', 'ready', 'failed', 'archived')),
  result jsonb,
  source_snapshot jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists feasibility_requests_user_created_idx
  on public.feasibility_requests (user_id, created_at desc);
create index if not exists feasibility_requests_postcode_idx
  on public.feasibility_requests (postcode);

create table if not exists public.professional_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  business_name text not null,
  discipline text not null,
  postcodes text[] not null default '{}',
  specialisms text[] not null default '{}',
  website text,
  membership_details jsonb not null default '{}'::jsonb,
  status text not null default 'submitted' check (status in ('draft', 'submitted', 'reviewing', 'approved', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists professional_applications_user_idx
  on public.professional_applications (user_id);
create index if not exists professional_applications_status_idx
  on public.professional_applications (status, created_at desc);

alter table public.hmo_license_locations enable row level security;
alter table public.feasibility_requests enable row level security;
alter table public.professional_applications enable row level security;

revoke all on table public.hmo_license_locations from anon, authenticated;
revoke all on table public.feasibility_requests from anon, authenticated;
revoke all on table public.professional_applications from anon, authenticated;

grant select on table public.hmo_license_locations to authenticated;
grant select, insert, update, delete on table public.feasibility_requests to authenticated;
grant select, insert, update on table public.professional_applications to authenticated;

create policy "authenticated users can read sourced HMO evidence"
  on public.hmo_license_locations for select
  to authenticated
  using (verified_at is not null);

create policy "users can read their feasibility requests"
  on public.feasibility_requests for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users can create their feasibility requests"
  on public.feasibility_requests for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users can update their feasibility requests"
  on public.feasibility_requests for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users can delete their feasibility requests"
  on public.feasibility_requests for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users can read their professional applications"
  on public.professional_applications for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users can create their professional applications"
  on public.professional_applications for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users can update pending professional applications"
  on public.professional_applications for update
  to authenticated
  using ((select auth.uid()) = user_id and status in ('draft', 'submitted'))
  with check ((select auth.uid()) = user_id and status in ('draft', 'submitted'));

create or replace function public.hmo_licenses_within_radius(
  target_latitude double precision,
  target_longitude double precision,
  radius_metres integer default 100
)
returns table (
  id uuid,
  address text,
  postcode text,
  licence_status text,
  distance_metres double precision,
  source_url text,
  source_date date
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    h.id,
    h.address,
    h.postcode,
    h.licence_status,
    extensions.st_distance(
      h.location,
      extensions.st_point(target_longitude, target_latitude)::extensions.geography
    ) as distance_metres,
    h.source_url,
    h.source_date
  from public.hmo_license_locations as h
  where h.verified_at is not null
    and h.location is not null
    and extensions.st_dwithin(
      h.location,
      extensions.st_point(target_longitude, target_latitude)::extensions.geography,
      greatest(1, least(radius_metres, 5000))
    )
  order by distance_metres
  limit 250;
$$;

revoke all on function public.hmo_licenses_within_radius(double precision, double precision, integer) from public, anon;
grant execute on function public.hmo_licenses_within_radius(double precision, double precision, integer) to authenticated;
