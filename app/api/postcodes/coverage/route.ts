import { NextRequest, NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const codePattern = /^[A-Z]{1,2}[0-9][0-9A-Z]?$/;
const boundarySource = "https://raw.githubusercontent.com/missinglink/uk-postcode-polygons/master/geojson";

type BoundaryGeometry = {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
};

type BoundaryFeature = {
  type: "Feature";
  properties: { name?: string; description?: string };
  geometry: BoundaryGeometry;
};

type BoundaryCollection = {
  type: "FeatureCollection";
  features: BoundaryFeature[];
};

function postcodeArea(code: string) {
  return code.match(/^[A-Z]{1,2}/)?.[0] ?? "";
}

export async function GET(request: NextRequest) {
  if (hasSupabaseConfig()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const codes = Array.from(new Set(
    (request.nextUrl.searchParams.get("codes") ?? "")
      .split(",")
      .map((code) => code.toUpperCase().replace(/\s/g, ""))
      .filter((code) => codePattern.test(code)),
  )).slice(0, 30);

  const wanted = new Set(codes);
  const areas = Array.from(new Set(codes.map(postcodeArea).filter(Boolean)));
  const collections = await Promise.all(areas.map(async (area) => {
    try {
      const response = await fetch(`${boundarySource}/${encodeURIComponent(area)}.geojson`, {
        next: { revalidate: 60 * 60 * 24 * 30 },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return [];
      const collection = await response.json() as BoundaryCollection;
      return collection.features
        .filter((feature) => feature.geometry && wanted.has((feature.properties.name ?? "").toUpperCase()))
        .map((feature) => ({
          ...feature,
          properties: { code: (feature.properties.name ?? "").toUpperCase() },
        }));
    } catch {
      return [];
    }
  }));

  return NextResponse.json({
    type: "FeatureCollection",
    features: collections.flat(),
  });
}
