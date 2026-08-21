alter table public.profiles
  add column if not exists professional_type text;

alter table public.profiles
  drop constraint if exists profiles_professional_type_check;

alter table public.profiles
  add constraint profiles_professional_type_check
  check (
    professional_type is null
    or professional_type in ('architect', 'builder', 'planning_consultant', 'structural_engineer')
  );

comment on column public.profiles.professional_type is
  'Professional discipline selected during onboarding.';
