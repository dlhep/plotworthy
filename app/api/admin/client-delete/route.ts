import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

// Permanently deletes a client account and (via ON DELETE CASCADE) their project.
// Guarded behind the admin cookie and a two-step confirm in the UI.
export async function POST(req: Request) {
  if (!isAdmin(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/admin/login", req.url), 303);
  }

  const form = await req.formData();
  const userId = String(form.get("userId") || "");
  const next = "/admin/clients";
  if (!userId) return NextResponse.redirect(new URL(next, req.url), 303);

  const sb = getSupabaseAdmin();
  if (sb) {
    // Remove the project row explicitly too, in case the FK cascade is absent.
    await sb.from("projects").delete().eq("user_id", userId);
    await sb.auth.admin.deleteUser(userId);
  }

  return NextResponse.redirect(new URL(next, req.url), 303);
}
