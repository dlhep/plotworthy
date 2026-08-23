import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service-role key.
// Returns null when env vars are not set, so the app still builds/deploys
// and features degrade gracefully until the backend is connected.
let cached: SupabaseClient | null = null;

// The project URL is not secret; accept either name so it works whether the
// env var is SUPABASE_URL or the NEXT_PUBLIC_SUPABASE_URL a Supabase setup adds.
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (cached) return cached;
  cached = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}

export const backendConfigured = () =>
  Boolean(SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
