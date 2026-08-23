import { createBrowserClient } from "@supabase/ssr";

// Public, browser-safe values. The publishable/anon key is meant to be exposed.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const authConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export function createClient() {
  return createBrowserClient(SUPABASE_URL!, SUPABASE_KEY!);
}
