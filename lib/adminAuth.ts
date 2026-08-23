import crypto from "crypto";

// Lightweight admin gate for the MVP: a shared ADMIN_PASSWORD.
// The cookie stores a hash of the password (not the password itself) and is
// httpOnly. Replace with Supabase auth + an 'admin' role in a later phase.
export const ADMIN_COOKIE = "pw_admin";

export function adminToken(): string {
  const pw = process.env.ADMIN_PASSWORD || "";
  return crypto.createHash("sha256").update(pw + "::plotworthy-admin-v1").digest("hex");
}

export function isAdmin(cookieValue?: string): boolean {
  if (!process.env.ADMIN_PASSWORD) return false;
  return Boolean(cookieValue) && cookieValue === adminToken();
}

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);
