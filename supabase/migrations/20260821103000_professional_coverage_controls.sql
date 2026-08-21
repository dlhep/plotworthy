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
  if cardinality(v_postcodes) > 30 then raise exception 'Choose no more than 30 postcode districts.'; end if;

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
  'Updates an approved professional public profile and matching application coverage atomically.';
