import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeMembership } from "@/lib/pricing";
import type { Application } from "@/lib/adminData";

export type ProAuth = {
  user: { id: string; email: string } | null;
  /** The approved professional application matching the user's email, if any. */
  pro: Application | null;
  /** True when signed in but with no approved application (pending, rejected, or none). */
  signedInNotApproved: boolean;
};

// Resolves the logged-in user to their approved professional record by email.
// Because email confirmation is on, a matching login proves control of that
// address — so matching by email is a safe way to link a pro to their approval.
export async function getProfessionalForUser(): Promise<ProAuth> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return { user: null, pro: null, signedInNotApproved: false };

  const account = { id: user.id, email: user.email };
  const sb = getSupabaseAdmin();
  if (!sb) return { user: account, pro: null, signedInNotApproved: true };

  const { data } = await sb
    .from("professional_applications")
    .select("*")
    .ilike("email", user.email)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const pro = data
    ? ({ ...(data as any), membership: normalizeMembership((data as any).membership) } as Application)
    : null;

  return { user: account, pro, signedInNotApproved: !pro };
}
