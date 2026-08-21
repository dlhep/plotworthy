import { NextRequest, NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const codePattern = /^[A-Z]{1,2}[0-9][0-9A-Z]?$/;

export async function GET(request: NextRequest) {
  if (hasSupabaseConfig()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const codes = Array.from(new Set((request.nextUrl.searchParams.get("codes") ?? "").split(",").map((code) => code.toUpperCase().replace(/\s/g, "")).filter((code) => codePattern.test(code)))).slice(0, 30);
  const points = await Promise.all(codes.map(async (code) => {
    try {
      const response = await fetch(`https://api.postcodes.io/outcodes/${encodeURIComponent(code)}`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(5000) });
      if (!response.ok) return null;
      const payload = await response.json() as { result?: { latitude?: number; longitude?: number } };
      if (typeof payload.result?.latitude !== "number" || typeof payload.result.longitude !== "number") return null;
      return { code, latitude: payload.result.latitude, longitude: payload.result.longitude };
    } catch { return null; }
  }));
  return NextResponse.json({ points: points.filter(Boolean) });
}
