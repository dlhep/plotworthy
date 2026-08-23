import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function safeNext(raw: string): string {
  return raw.startsWith("/admin") ? raw : "/admin/professionals";
}

// Permanently removes a professional application/record. Guarded by the admin
// cookie and a two-step confirm in the UI.
export async function POST(req: Request) {
  if (!isAdmin(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/admin/login", req.url), 303);
  }

  const form = await req.formData();
  const id = String(form.get("id") || "");
  const next = safeNext(String(form.get("next") || "/admin/professionals"));
  if (!id) return NextResponse.redirect(new URL(next, req.url), 303);

  const sb = getSupabaseAdmin();
  if (sb) {
    await sb.from("professional_applications").delete().eq("id", id);
  }

  return NextResponse.redirect(new URL(next, req.url), 303);
}
