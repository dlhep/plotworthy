drop policy if exists "admins can read professional applications"
  on public.professional_applications;
drop policy if exists "admins can review professional applications"
  on public.professional_applications;
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

drop policy if exists "active professional profiles are public"
  on public.professional_public_profiles;
drop policy if exists "professionals can read their hidden public profile"
  on public.professional_public_profiles;

create policy "active professional profiles are public to visitors"
  on public.professional_public_profiles for select
  to anon
  using (status = 'active');

create policy "active profiles or own profile are visible to members"
  on public.professional_public_profiles for select
  to authenticated
  using (status = 'active' or (select auth.uid()) = user_id);
