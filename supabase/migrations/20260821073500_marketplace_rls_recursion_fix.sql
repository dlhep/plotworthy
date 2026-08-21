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

drop policy if exists "clients and eligible professionals can read projects"
  on public.marketplace_projects;
create policy "clients and eligible professionals can read projects"
  on public.marketplace_projects for select
  to authenticated
  using (
    (select auth.uid()) = client_user_id
    or private.professional_has_quoted_project(id, (select auth.uid()))
    or private.professional_can_view_project(id, (select auth.uid()))
  );

drop policy if exists "project parties can read quotes"
  on public.project_quotes;
create policy "project parties can read quotes"
  on public.project_quotes for select
  to authenticated
  using (
    professional_user_id = (select auth.uid())
    or private.client_owns_project(project_id, (select auth.uid()))
  );
