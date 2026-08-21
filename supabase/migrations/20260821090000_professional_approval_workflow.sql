create table if not exists private.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

revoke all on table private.admin_users from public, anon, authenticated;

insert into private.admin_users (user_id)
select id
from auth.users
where lower(email) = 'info@hepburnarchitects.com'
on conflict (user_id) do nothing;

create or replace function private.is_plotworthy_admin(target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select target_user_id is not null
    and exists (
      select 1
      from private.admin_users
      where user_id = target_user_id
    );
$$;

revoke all on function private.is_plotworthy_admin(uuid) from public, anon;
grant execute on function private.is_plotworthy_admin(uuid) to authenticated;

create or replace function public.is_plotworthy_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_plotworthy_admin(auth.uid());
$$;

revoke all on function public.is_plotworthy_admin() from public, anon;
grant execute on function public.is_plotworthy_admin() to authenticated;

alter table public.professional_applications
  add column if not exists contact_email text,
  add column if not exists review_notes text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null;

update public.professional_applications as application
set contact_email = auth_user.email
from auth.users as auth_user
where auth_user.id = application.user_id
  and application.contact_email is null;

drop policy if exists "users can read their professional applications"
  on public.professional_applications;
drop policy if exists "users can update pending professional applications"
  on public.professional_applications;

create policy "professionals or admins can read professional applications"
  on public.professional_applications for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select private.is_plotworthy_admin())
  );

create policy "professionals or admins can update professional applications"
  on public.professional_applications for update
  to authenticated
  using (
    (select private.is_plotworthy_admin())
    or (
      (select auth.uid()) = user_id
      and status in ('draft', 'submitted')
    )
  )
  with check (
    (select private.is_plotworthy_admin())
    or (
      (select auth.uid()) = user_id
      and status in ('draft', 'submitted')
    )
  );

create index if not exists professional_applications_reviewed_by_idx
  on public.professional_applications (reviewed_by);

create table if not exists public.professional_public_profiles (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.professional_applications(id) on delete cascade,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  business_name text not null check (char_length(business_name) between 2 and 120),
  discipline text not null check (discipline in ('architect', 'builder', 'planning_consultant', 'structural_engineer')),
  postcodes text[] not null default '{}',
  specialisms text[] not null default '{}',
  website text,
  summary text not null default '' check (char_length(summary) <= 1200),
  verification_badges text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'hidden')),
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists professional_public_profiles_discipline_idx
  on public.professional_public_profiles (discipline, status, business_name);

alter table public.professional_public_profiles enable row level security;
revoke all on table public.professional_public_profiles from anon, authenticated;
grant select on table public.professional_public_profiles to anon, authenticated;
grant update (postcodes, specialisms, website, summary, updated_at)
  on table public.professional_public_profiles to authenticated;

create policy "active professional profiles are public to visitors"
  on public.professional_public_profiles for select
  to anon
  using (status = 'active');

create policy "active profiles or own profile are visible to members"
  on public.professional_public_profiles for select
  to authenticated
  using (status = 'active' or (select auth.uid()) = user_id);

create policy "professionals can edit their public profile"
  on public.professional_public_profiles for update
  to authenticated
  using ((select auth.uid()) = user_id and status = 'active')
  with check ((select auth.uid()) = user_id and status = 'active');

drop trigger if exists professional_public_profiles_set_updated_at
  on public.professional_public_profiles;
create trigger professional_public_profiles_set_updated_at
before update on public.professional_public_profiles
for each row execute function private.set_updated_at();

create or replace function public.review_professional_application(
  p_application_id uuid,
  p_status text,
  p_review_notes text default ''
)
returns public.professional_applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin_id uuid := auth.uid();
  v_application public.professional_applications%rowtype;
  v_slug_base text;
  v_slug text;
  v_membership text;
begin
  if not private.is_plotworthy_admin(v_admin_id) then
    raise exception 'Administrator access is required.' using errcode = '42501';
  end if;

  if p_status not in ('reviewing', 'approved', 'declined') then
    raise exception 'Choose a valid review decision.' using errcode = '22023';
  end if;

  select * into v_application
  from public.professional_applications
  where id = p_application_id
  for update;

  if not found then
    raise exception 'The professional application could not be found.' using errcode = 'P0002';
  end if;

  update public.professional_applications
  set status = p_status,
      review_notes = left(trim(coalesce(p_review_notes, '')), 1200),
      reviewed_at = now(),
      reviewed_by = v_admin_id,
      updated_at = now()
  where id = p_application_id
  returning * into v_application;

  if p_status = 'approved' then
    v_slug_base := trim(both '-' from regexp_replace(lower(v_application.business_name), '[^a-z0-9]+', '-', 'g'));
    if v_slug_base = '' then
      v_slug_base := 'professional';
    end if;
    v_slug := left(v_slug_base, 72) || '-' || left(replace(v_application.id::text, '-', ''), 8);
    v_membership := nullif(trim(v_application.membership_details ->> 'summary'), '');

    insert into public.professional_public_profiles (
      application_id,
      user_id,
      slug,
      business_name,
      discipline,
      postcodes,
      specialisms,
      website,
      summary,
      verification_badges,
      status,
      published_at
    ) values (
      v_application.id,
      v_application.user_id,
      v_slug,
      v_application.business_name,
      v_application.discipline,
      v_application.postcodes,
      v_application.specialisms,
      v_application.website,
      v_application.business_name || ' is an approved PlotWorthy ' || replace(v_application.discipline, '_', ' ') || '.',
      case when v_membership is null then '{}'::text[] else array[v_membership] end,
      'active',
      now()
    )
    on conflict (user_id) do update
    set application_id = excluded.application_id,
        slug = excluded.slug,
        business_name = excluded.business_name,
        discipline = excluded.discipline,
        postcodes = excluded.postcodes,
        specialisms = excluded.specialisms,
        website = excluded.website,
        summary = case
          when public.professional_public_profiles.summary = '' then excluded.summary
          else public.professional_public_profiles.summary
        end,
        verification_badges = excluded.verification_badges,
        status = 'active',
        published_at = now(),
        updated_at = now();
  elsif p_status = 'declined' then
    update public.professional_public_profiles
    set status = 'hidden', updated_at = now()
    where application_id = v_application.id;
  end if;

  return v_application;
end;
$$;

revoke all on function public.review_professional_application(uuid, text, text) from public, anon;
grant execute on function public.review_professional_application(uuid, text, text) to authenticated;

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
          and application.status = 'approved'
          and (
            now() >= project.local_priority_until
            or private.coverage_matches(project.postcode_district, application.postcodes)
          )
      )
  );
$$;

revoke all on function private.professional_can_view_project(uuid, uuid) from public, anon;
grant execute on function private.professional_can_view_project(uuid, uuid) to authenticated;

create or replace function private.require_approved_professional_quote()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.professional_applications
    where user_id = new.professional_user_id
      and discipline = new.professional_type
      and status = 'approved'
  ) then
    raise exception 'Professional approval is required before quoting.' using errcode = '42501';
  end if;
  return new;
end;
$$;

revoke all on function private.require_approved_professional_quote() from public, anon, authenticated;

drop trigger if exists project_quotes_require_approved_professional on public.project_quotes;
create trigger project_quotes_require_approved_professional
before insert on public.project_quotes
for each row execute function private.require_approved_professional_quote();

create or replace function private.only_queue_approved_professionals()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.marketplace_projects as project
    join public.profiles as profile
      on profile.id = new.professional_user_id
     and profile.account_type = 'professional'
     and profile.professional_type = any(project.required_professions)
    join public.professional_applications as application
      on application.user_id = profile.id
     and application.discipline = profile.professional_type
     and application.status = 'approved'
    where project.id = new.project_id
  ) then
    return null;
  end if;
  return new;
end;
$$;

revoke all on function private.only_queue_approved_professionals() from public, anon, authenticated;

drop trigger if exists project_notifications_only_approved_professionals
  on public.project_notifications;
create trigger project_notifications_only_approved_professionals
before insert on public.project_notifications
for each row execute function private.only_queue_approved_professionals();

comment on table private.admin_users is
  'PlotWorthy administrators. This private table is never exposed through the Data API.';
comment on table public.professional_public_profiles is
  'Public-safe professional directory records created only after an administrator approves an application.';
comment on function public.review_professional_application(uuid, text, text) is
  'Admin-only application review operation. Approval publishes or refreshes a public-safe profile.';
