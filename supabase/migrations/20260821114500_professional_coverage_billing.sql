create table if not exists public.professional_billing_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  coverage_package text check (coverage_package is null or coverage_package in ('single', 'local', 'regional')),
  base_postcode_allowance smallint not null default 5 check (base_postcode_allowance between 1 and 30),
  addon_postcode_allowance smallint not null default 0 check (addon_postcode_allowance between 0 and 25),
  subscription_status text not null default 'none' check (
    subscription_status in ('none', 'incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'unpaid', 'paused', 'canceled')
  ),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.professional_billing_accounts is
  'Private Stripe subscription state and the enforced postcode-district allowance for each professional.';

alter table public.professional_billing_accounts enable row level security;

revoke all on table public.professional_billing_accounts from public, anon, authenticated;
grant select on table public.professional_billing_accounts to authenticated;
grant all on table public.professional_billing_accounts to service_role;

drop policy if exists professional_billing_accounts_select_own
  on public.professional_billing_accounts;
create policy professional_billing_accounts_select_own
  on public.professional_billing_accounts for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop trigger if exists professional_billing_accounts_set_updated_at
  on public.professional_billing_accounts;
create trigger professional_billing_accounts_set_updated_at
before update on public.professional_billing_accounts
for each row execute function private.set_updated_at();

create or replace function public.update_professional_coverage(p_postcodes text[])
returns text[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_application_id uuid;
  v_postcodes text[];
  v_allowance integer := 5;
begin
  if v_user_id is null then raise exception 'Sign in before updating coverage.'; end if;

  select coalesce(array_agg(code order by code), '{}'::text[])
  into v_postcodes
  from (
    select distinct upper(regexp_replace(trim(value), '\s+', '', 'g')) as code
    from unnest(coalesce(p_postcodes, '{}'::text[])) as supplied(value)
  ) normalized
  where code ~ '^[A-Z]{1,2}[0-9][0-9A-Z]?$';

  if cardinality(v_postcodes) < 1 then raise exception 'Choose at least one valid postcode district.'; end if;

  select billing.base_postcode_allowance + billing.addon_postcode_allowance
  into v_allowance
  from public.professional_billing_accounts as billing
  where billing.user_id = v_user_id;

  v_allowance := coalesce(v_allowance, 5);
  if cardinality(v_postcodes) > v_allowance then
    raise exception 'Your current plan includes % postcode districts. Remove districts or upgrade your coverage.', v_allowance;
  end if;

  select profile.application_id into v_application_id
  from public.professional_public_profiles as profile
  where profile.user_id = v_user_id and profile.status = 'active'
  for update;

  if v_application_id is null then raise exception 'An active professional profile is required.'; end if;

  update public.professional_public_profiles set postcodes = v_postcodes, updated_at = now()
  where application_id = v_application_id and user_id = v_user_id;

  update public.professional_applications set postcodes = v_postcodes, updated_at = now()
  where id = v_application_id and user_id = v_user_id and status = 'approved';

  return v_postcodes;
end;
$$;

revoke all on function public.update_professional_coverage(text[]) from public, anon;
grant execute on function public.update_professional_coverage(text[]) to authenticated;

comment on function public.update_professional_coverage(text[]) is
  'Updates approved professional coverage atomically and enforces the Stripe-backed postcode allowance.';
