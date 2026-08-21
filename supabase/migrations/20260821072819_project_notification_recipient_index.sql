create index if not exists project_notifications_professional_idx
  on public.project_notifications (professional_user_id, created_at desc);
