import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { toDistrict } from "@/lib/postcodes";

export const dynamic = "force-dynamic";

// Admin: set a professional's coverage districts. JSON in, JSON out (called
// from the CoverageAdmin client control).
export async function POST(req: Request) {
  if (!isAdmin(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "Not authorised." }, { status: 401 });
  }

  let body: { id?: string; districts?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const id = String(body.id || "");
  if (!id) return NextResponse.json({ ok: false, error: "Missing professional." }, { status: 400 });

  const raw = Array.isArray(body.districts) ? body.districts : [];
  const districts = Array.from(
    new Set(raw.map((d) => toDistrict(String(d))).filter(Boolean))
  ).slice(0, 500);

  // Keep the human-readable coverage text roughly in sync with the districts.
  const coverage =
    districts.length === 0 ? null : districts.length <= 8 ? districts.join(", ") : `${districts.length} districts`;

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ ok: false, error: "Storage isn’t connected." }, { status: 503 });

  const { error } = await sb
    .from("professional_applications")
    .update({ districts, coverage })
    .eq("id", id);

  if (error) return NextResponse.json({ ok: false, error: "Couldn’t save." }, { status: 500 });

  return NextResponse.json({ ok: true, districts, coverage });
}
