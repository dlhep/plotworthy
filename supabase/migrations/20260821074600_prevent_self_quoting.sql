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

revoke all on function public.submit_project_quote(uuid, integer, text, text, text) from public, anon;
grant execute on function public.submit_project_quote(uuid, integer, text, text, text) to authenticated;
