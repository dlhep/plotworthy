import { NextResponse } from "next/server";
import { getProfessionalForUser } from "@/lib/professionalAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { toDistrict } from "@/lib/postcodes";

export const dynamic = "force-dynamic";

// Persist the professional's chosen postcode districts to their approved
// application row. Only the signed-in, approved professional can save their own.
export async function POST(req: Request) {
  const { pro } = await getProfessionalForUser();
  if (!pro?.id) {
    return NextResponse.json({ ok: false, error: "Not signed in as an approved professional." }, { status: 401 });
  }

  let body: { districts?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const raw = Array.isArray(body.districts) ? body.districts : [];
  const districts = Array.from(
    new Set(raw.map((d) => toDistrict(String(d))).filter(Boolean))
  ).slice(0, 200);

  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({ ok: false, error: "Storage isn’t connected." }, { status: 503 });
  }

  const { error } = await sb
    .from("professional_applications")
    .update({ districts })
    .eq("id", (pro as any).id);

  if (error) {
    return NextResponse.json({ ok: false, error: "Couldn’t save. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, districts });
}
