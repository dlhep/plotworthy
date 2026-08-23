import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeMembership } from "@/lib/pricing";

export const dynamic = "force-dynamic";

function safeNext(raw: string): string {
  return raw.startsWith("/admin") ? raw : "/admin/professionals";
}

export async function POST(req: Request) {
  if (!isAdmin(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/admin/login", req.url), 303);
  }

  const form = await req.formData();
  const id = String(form.get("id") || "");
  const next = safeNext(String(form.get("next") || "/admin/professionals"));
  if (!id) return NextResponse.redirect(new URL(next, req.url), 303);

  const membership = normalizeMembership({
    postcodePacks: Number(form.get("postcodePacks") || 0),
    enhanced: form.get("enhanced") === "on" || form.get("enhanced") === "true",
    website: form.get("website") === "on" || form.get("website") === "true",
  });

  const sb = getSupabaseAdmin();
  if (sb) {
    await sb.from("professional_applications").update({ membership }).eq("id", id);
  }

  return NextResponse.redirect(new URL(next, req.url), 303);
}
