alter table public.profiles
  add column if not exists account_type text;

alter table public.profiles
  drop constraint if exists profiles_account_type_check;

alter table public.profiles
  add constraint profiles_account_type_check
  check (account_type is null or account_type in ('property', 'professional'));

comment on column public.profiles.account_type is
  'User-selected PlotWorthy experience: property owner/developer or property professional.';

grant select, insert, update on table public.profiles to authenticated;
