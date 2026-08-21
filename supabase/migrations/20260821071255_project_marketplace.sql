-- PlotWorthy project marketplace: privacy-safe project publishing, staged
-- postcode coverage, capped quoting and notification delivery queue.

create schema if not exists private;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create table if not exists public.marketplace_projects (
  id uuid primary key default gen_random_uuid(),
  feasibility_request_id uuid not null unique references public.feasibility_requests(id) on delete cascade,
  client_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 5 and 140),
  postcode_district text not null check (char_length(postcode_district) between 2 and 5),
  area_label text not null check (char_length(area_label) between 2 and 120),
  project_type text not null check (project_type in ('hmo', 'flats', 'extension', 'land', 'other')),
  property_type text not null check (property_type in ('house', 'flat', 'commercial', 'land', 'other')),
  brief text not null check (char_length(brief) between 20 and 1800),
  required_professions text[] not null,
  budget_min_pence integer check (budget_min_pence is null or budget_min_pence >= 0),
  budget_max_pence integer check (budget_max_pence is null or budget_max_pence >= 0),
  target_start_date date,
  status text not null default 'live' check (status in ('live', 'full', 'matched', 'paused', 'closed')),
  local_priority_until timestamptz not null default (now() + interval '7 days'),
  max_quotes smallint not null default 5 check (max_quotes between 1 and 5),
  quote_count smallint not null default 0 check (quote_count between 0 and 5),
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(required_professions) between 1 and 4),
  check (required_professions <@ array['architect', 'builder', 'planning_consultant', 'structural_engineer']::text[]),
  check (budget_min_pence is null or budget_max_pence is null or budget_max_pence >= budget_min_pence),
  check (quote_count <= max_quotes)
);

create table if not exists public.project_quotes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.marketplace_projects(id) on delete cascade,
  professional_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  professional_type text not null check (professional_type in ('architect', 'builder', 'planning_consultant', 'structural_engineer')),
  business_name text not null check (char_length(business_name) between 2 and 120),
  fee_pence integer not null check (fee_pence between 0 and 1000000000),
  message text not null check (char_length(message) between 30 and 2400),
  timeframe text not null check (char_length(timeframe) between 2 and 240),
  inclusions text not null default '' check (char_length(inclusions) <= 1600),
  status text not null default 'submitted' check (status in ('submitted', 'shortlisted', 'accepted', 'declined', 'withdrawn')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, professional_user_id)
);

create table if not exists public.project_notifications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.marketplace_projects(id) on delete cascade,
  professional_user_id uuid not null references auth.users(id) on delete cascade,
  channel text not null default 'email' check (channel = 'email'),
  phase text not null default 'local' check (phase in ('local', 'expanded')),
  status text not null default 'queued' check (status in ('queued', 'sending', 'sent', 'failed')),
  attempts smallint not null default 0 check (attempts between 0 and 20),
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, professional_user_id, channel)
);

create index if not exists marketplace_projects_status_published_idx
  on public.marketplace_projects (status, published_at desc);
create index if not exists marketplace_projects_professions_idx
  on public.marketplace_projects using gin (required_professions);
create index if not exists marketplace_projects_postcode_idx
  on public.marketplace_projects (postcode_district, local_priority_until);
create index if not exists marketplace_projects_client_idx
  on public.marketplace_projects (client_user_id, published_at desc);
create index if not exists project_quotes_project_idx
  on public.project_quotes (project_id, submitted_at);
create index if not exists project_quotes_professional_idx
  on public.project_quotes (professional_user_id, submitted_at desc);
create index if not exists project_notifications_delivery_idx
  on public.project_notifications (status, created_at)
  where status in ('queued', 'failed');

create or replace function private.normalise_postcode(value text)
returns text
language sql
immutable
security invoker
set search_path = ''
as $$
  select upper(regexp_replace(coalesce(value, ''), '\s+', '', 'g'));
$$;

create or replace function private.postcode_district(value text)
returns text
language sql
immutable
security invoker
set search_path = ''
as $$
  select case
    when char_length(private.normalise_postcode(value)) > 3
      then left(private.normalise_postcode(value), char_length(private.normalise_postcode(value)) - 3)
    else private.normalise_postcode(value)
  end;
$$;

create or replace function private.coverage_matches(project_district text, coverage text[])
returns boolean
language sql
immutable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from unnest(coalesce(coverage, '{}'::text[])) as item(value)
    where private.normalise_postcode(project_district) like private.normalise_postcode(item.value) || '%'
       or private.normalise_postcode(item.value) like private.normalise_postcode(project_district) || '%'
  );
$$;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists marketplace_projects_set_updated_at on public.marketplace_projects;
create trigger marketplace_projects_set_updated_at
before update on public.marketplace_projects
for each row execute function private.set_updated_at();

drop trigger if exists project_quotes_set_updated_at on public.project_quotes;
create trigger project_quotes_set_updated_at
before update on public.project_quotes
for each row execute function private.set_updated_at();

drop trigger if exists project_notifications_set_updated_at on public.project_notifications;
create trigger project_notifications_set_updated_at
before update on public.project_notifications
for each row execute function private.set_updated_at();

create or replace function private.professional_can_view_project(
  target_project_id uuid,
  target_professional_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.marketplace_projects as project
    join public.profiles as profile
      on profile.id = target_professional_id
     and profile.account_type = 'professional'
     and profile.professional_type = any(project.required_professions)
    where project.id = target_project_id
      and project.status = 'live'
      and project.quote_count < project.max_quotes
      and exists (
        select 1
        from public.professional_applications as application
        where application.user_id = target_professional_id
          and application.discipline = profile.professional_type
          and application.status <> 'declined'
          and (
            now() >= project.local_priority_until
            or private.coverage_matches(project.postcode_district, application.postcodes)
          )
      )
  );
$$;

revoke all on function private.professional_can_view_project(uuid, uuid) from public, anon;
grant execute on function private.professional_can_view_project(uuid, uuid) to authenticated;

create or replace function private.professional_has_quoted_project(
  target_project_id uuid,
  target_professional_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.project_quotes
    where project_id = target_project_id
      and professional_user_id = target_professional_id
  );
$$;

create or replace function private.client_owns_project(
  target_project_id uuid,
  target_client_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.marketplace_projects
    where id = target_project_id
      and client_user_id = target_client_id
  );
$$;

revoke all on function private.professional_has_quoted_project(uuid, uuid) from public, anon;
revoke all on function private.client_owns_project(uuid, uuid) from public, anon;
grant execute on function private.professional_has_quoted_project(uuid, uuid) to authenticated;
grant execute on function private.client_owns_project(uuid, uuid) to authenticated;

alter table public.marketplace_projects enable row level security;
alter table public.project_quotes enable row level security;
alter table public.project_notifications enable row level security;

revoke all on table public.marketplace_projects from anon, authenticated;
revoke all on table public.project_quotes from anon, authenticated;
revoke all on table public.project_notifications from anon, authenticated;

grant select on table public.marketplace_projects to authenticated;
grant select on table public.project_quotes to authenticated;
grant select on table public.project_notifications to authenticated;

create policy "clients and eligible professionals can read projects"
  on public.marketplace_projects for select
  to authenticated
  using (
    (select auth.uid()) = client_user_id
    or private.professional_has_quoted_project(id, (select auth.uid()))
    or private.professional_can_view_project(id, (select auth.uid()))
  );

create policy "project parties can read quotes"
  on public.project_quotes for select
  to authenticated
  using (
    professional_user_id = (select auth.uid())
    or private.client_owns_project(project_id, (select auth.uid()))
  );

create policy "professionals can read their notification status"
  on public.project_notifications for select
  to authenticated
  using (professional_user_id = (select auth.uid()));

create or replace function public.publish_marketplace_project(
  p_feasibility_request_id uuid,
  p_title text,
  p_brief text,
  p_required_professions text[],
  p_budget_min_pence integer default null,
  p_budget_max_pence integer default null,
  p_target_start_date date default null
)
returns public.marketplace_projects
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_request public.feasibility_requests%rowtype;
  v_project public.marketplace_projects%rowtype;
  v_postcode text;
  v_postcode_district text;
  v_area_label text;
begin
  if v_user_id is null then
    raise exception 'You must be signed in.' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = v_user_id and account_type = 'property'
  ) then
    raise exception 'Only property owner and developer accounts can publish projects.' using errcode = '42501';
  end if;

  select * into v_request
  from public.feasibility_requests
  where id = p_feasibility_request_id
    and user_id = v_user_id
    and status = 'ready';

  if not found then
    raise exception 'The report could not be found or is not ready.' using errcode = 'P0002';
  end if;

  if exists (
    select 1 from public.marketplace_projects
    where feasibility_request_id = p_feasibility_request_id
  ) then
    raise exception 'This report has already been published.' using errcode = '23505';
  end if;

  if char_length(trim(coalesce(p_title, ''))) not between 5 and 140
     or char_length(trim(coalesce(p_brief, ''))) not between 20 and 1800 then
    raise exception 'Check the project title and brief.' using errcode = '22023';
  end if;

  if cardinality(coalesce(p_required_professions, '{}'::text[])) not between 1 and 4
     or not (p_required_professions <@ array['architect', 'builder', 'planning_consultant', 'structural_engineer']::text[]) then
    raise exception 'Choose at least one valid professional type.' using errcode = '22023';
  end if;

  if p_budget_min_pence is not null and p_budget_min_pence < 0
     or p_budget_max_pence is not null and p_budget_max_pence < 0
     or p_budget_min_pence is not null and p_budget_max_pence is not null and p_budget_max_pence < p_budget_min_pence then
    raise exception 'Check the project budget range.' using errcode = '22023';
  end if;

  v_postcode := coalesce(v_request.result -> 'property' ->> 'postcode', v_request.postcode);
  v_postcode_district := private.postcode_district(v_postcode);
  v_area_label := coalesce(
    nullif(trim(v_request.result -> 'property' ->> 'district'), ''),
    nullif(trim(v_request.result -> 'property' ->> 'region'), ''),
    v_postcode_district
  );

  insert into public.marketplace_projects (
    feasibility_request_id,
    client_user_id,
    title,
    postcode_district,
    area_label,
    project_type,
    property_type,
    brief,
    required_professions,
    budget_min_pence,
    budget_max_pence,
    target_start_date
  ) values (
    v_request.id,
    v_user_id,
    trim(p_title),
    v_postcode_district,
    left(v_area_label, 120),
    v_request.project_type,
    v_request.property_type,
    trim(p_brief),
    array(select distinct value from unnest(p_required_professions) as value),
    p_budget_min_pence,
    p_budget_max_pence,
    p_target_start_date
  ) returning * into v_project;

  insert into public.project_notifications (project_id, professional_user_id, phase)
  select distinct v_project.id, profile.id, 'local'
  from public.profiles as profile
  join public.professional_applications as application
    on application.user_id = profile.id
   and application.discipline = profile.professional_type
   and application.status <> 'declined'
  where profile.account_type = 'professional'
    and profile.professional_type = any(v_project.required_professions)
    and private.coverage_matches(v_project.postcode_district, application.postcodes)
  on conflict (project_id, professional_user_id, channel) do nothing;

  return v_project;
end;
$$;

create or replace function public.submit_project_quote(
  p_project_id uuid,
  p_fee_pence integer,
  p_message text,
  p_timeframe text,
  p_inclusions text default ''
)
returns public.project_quotes
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_project public.marketplace_projects%rowtype;
  v_profile public.profiles%rowtype;
  v_application public.professional_applications%rowtype;
  v_quote public.project_quotes%rowtype;
begin
  if v_user_id is null then
    raise exception 'You must be signed in.' using errcode = '42501';
  end if;

  select * into v_project
  from public.marketplace_projects
  where id = p_project_id
  for update;

  if not found then
    raise exception 'This project could not be found.' using errcode = 'P0002';
  end if;

  select * into v_profile
  from public.profiles
  where id = v_user_id
    and account_type = 'professional'
    and professional_type = any(v_project.required_professions);

  if not found then
    raise exception 'Your professional discipline is not requested for this project.' using errcode = '42501';
  end if;

  select * into v_application
  from public.professional_applications
  where user_id = v_user_id
    and discipline = v_profile.professional_type
    and status <> 'declined'
  order by updated_at desc
  limit 1;

  if not found then
    raise exception 'Complete your professional profile before quoting.' using errcode = '42501';
  end if;

  if v_project.status <> 'live' or v_project.quote_count >= v_project.max_quotes then
    raise exception 'This project is no longer accepting quotes.' using errcode = 'P0001';
  end if;

  if v_project.client_user_id = v_user_id then
    raise exception 'You cannot quote for your own project.' using errcode = '42501';
  end if;

  if now() < v_project.local_priority_until
     and not private.coverage_matches(v_project.postcode_district, v_application.postcodes) then
    raise exception 'This project is still in its local-priority period.' using errcode = '42501';
  end if;

  if exists (
    select 1 from public.project_quotes
    where project_id = p_project_id and professional_user_id = v_user_id
  ) then
    raise exception 'You have already submitted a quote for this project.' using errcode = '23505';
  end if;

  if p_fee_pence is null or p_fee_pence < 0 or p_fee_pence > 1000000000
     or char_length(trim(coalesce(p_message, ''))) not between 30 and 2400
     or char_length(trim(coalesce(p_timeframe, ''))) not between 2 and 240
     or char_length(trim(coalesce(p_inclusions, ''))) > 1600 then
    raise exception 'Check the quote details and try again.' using errcode = '22023';
  end if;

  insert into public.project_quotes (
    project_id,
    professional_user_id,
    professional_type,
    business_name,
    fee_pence,
    message,
    timeframe,
    inclusions
  ) values (
    v_project.id,
    v_user_id,
    v_profile.professional_type,
    v_application.business_name,
    p_fee_pence,
    trim(p_message),
    trim(p_timeframe),
    trim(coalesce(p_inclusions, ''))
  ) returning * into v_quote;

  update public.marketplace_projects
  set quote_count = quote_count + 1,
      status = case when quote_count + 1 >= max_quotes then 'full' else status end
  where id = v_project.id;

  return v_quote;
end;
$$;

create or replace function public.respond_to_project_quote(
  p_quote_id uuid,
  p_status text
)
returns public.project_quotes
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_quote public.project_quotes%rowtype;
begin
  if v_user_id is null then
    raise exception 'You must be signed in.' using errcode = '42501';
  end if;

  if p_status not in ('shortlisted', 'accepted', 'declined') then
    raise exception 'Choose a valid quote response.' using errcode = '22023';
  end if;

  select quote.* into v_quote
  from public.project_quotes as quote
  join public.marketplace_projects as project on project.id = quote.project_id
  where quote.id = p_quote_id
    and project.client_user_id = v_user_id
  for update of quote;

  if not found then
    raise exception 'The quote could not be found.' using errcode = 'P0002';
  end if;

  if v_quote.status in ('accepted', 'declined', 'withdrawn') then
    raise exception 'This quote can no longer be changed.' using errcode = 'P0001';
  end if;

  update public.project_quotes
  set status = p_status
  where id = v_quote.id
  returning * into v_quote;

  if p_status = 'accepted' then
    update public.marketplace_projects
    set status = 'matched'
    where id = v_quote.project_id;

    update public.project_quotes
    set status = 'declined'
    where project_id = v_quote.project_id
      and id <> v_quote.id
      and status in ('submitted', 'shortlisted');
  end if;

  return v_quote;
end;
$$;

create or replace function public.queue_expanded_project_notifications()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inserted integer;
begin
  insert into public.project_notifications (project_id, professional_user_id, phase)
  select distinct project.id, profile.id, 'expanded'
  from public.marketplace_projects as project
  join public.profiles as profile
    on profile.account_type = 'professional'
   and profile.professional_type = any(project.required_professions)
  where project.status = 'live'
    and project.quote_count < project.max_quotes
    and now() >= project.local_priority_until
    and exists (
      select 1
      from public.professional_applications as application
      where application.user_id = profile.id
        and application.discipline = profile.professional_type
        and application.status <> 'declined'
    )
  on conflict (project_id, professional_user_id, channel) do nothing;

  get diagnostics v_inserted = row_count;
  return v_inserted;
end;
$$;

revoke all on function public.publish_marketplace_project(uuid, text, text, text[], integer, integer, date) from public, anon;
revoke all on function public.submit_project_quote(uuid, integer, text, text, text) from public, anon;
revoke all on function public.respond_to_project_quote(uuid, text) from public, anon;
revoke all on function public.queue_expanded_project_notifications() from public, anon, authenticated;

grant execute on function public.publish_marketplace_project(uuid, text, text, text[], integer, integer, date) to authenticated;
grant execute on function public.submit_project_quote(uuid, integer, text, text, text) to authenticated;
grant execute on function public.respond_to_project_quote(uuid, text) to authenticated;
grant execute on function public.queue_expanded_project_notifications() to service_role;

comment on table public.marketplace_projects is
  'Privacy-safe project summaries published from private feasibility reports.';
comment on column public.marketplace_projects.local_priority_until is
  'Before this time only matching professionals whose stated postcode coverage includes the project district may view and quote.';
comment on table public.project_notifications is
  'Durable email delivery queue; recipient addresses remain in private profile/auth data.';
