import { NextResponse } from "next/server";
import { getLiveIntel } from "@/lib/intelLive";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/intel?postcode=B14%204AA&slug=hmo
// Returns real property intelligence from official / open UK sources.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postcode = (searchParams.get("postcode") || "").trim();
  const slug = (searchParams.get("slug") || "").trim();

  if (!postcode) {
    return NextResponse.json({ ok: false, error: "Missing postcode." }, { status: 400 });
  }

  try {
    const intel = await getLiveIntel(postcode, slug);
    return NextResponse.json(intel, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Lookup failed." }, { status: 502 });
  }
}
