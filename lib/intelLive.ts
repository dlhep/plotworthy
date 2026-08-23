// Live UK property intelligence from official / open sources.
// Runs server-side only (called from /api/intel). Every source is real and
// free; we never fabricate. Absence of a designation is reported as
// "none found in the dataset", never as a guarantee.

const UA = "PlotWorthy/1.0 (+https://plotworthy.co.uk; hello@plotworthy.co.uk)";
const DAY = 60 * 60 * 24;

export type GeoResult = {
  ok: boolean;
  postcode: string;
  outcode: string;
  lat: number | null;
  lng: number | null;
  council: string | null;
  ward: string | null;
  gss: string | null;
};

export type Designation = { name: string; reference?: string };

export type PlanningApp = {
  ref: string;
  desc: string;
  address: string;
  decision: "Approved" | "Refused" | "Pending" | "Other";
  date: string;
  url: string | null;
};

export type AppCounts = { approved: number; refused: number; pending: number; decided: number; total: number };

export type IntelResult = {
  ok: boolean;
  geo: GeoResult;
  article4: Designation[];
  hmoArticle4: boolean;
  conservation: Designation[];
  listed: Designation[];
  flood: { checked: boolean; zones: Designation[] };
  apps: { ok: boolean; items: PlanningApp[]; counts: AppCounts };
  sources: string[];
  fetchedAt: string;
};

const isFullPostcode = (s: string) => /\d[a-z]{2}$/i.test(s.replace(/\s+/g, ""));

async function jget(url: string, revalidate = DAY): Promise<any | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, next: { revalidate } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function geocode(input: string): Promise<GeoResult> {
  const pc = input.trim().toUpperCase().replace(/\s+/g, " ");
  const compact = pc.replace(/\s+/g, "");
  const outcode = compact.match(/^[A-Z]{1,2}\d[A-Z\d]?/)?.[0] || compact;
  const base: GeoResult = { ok: false, postcode: pc, outcode, lat: null, lng: null, council: null, ward: null, gss: null };

  if (isFullPostcode(compact)) {
    const j = await jget(`https://api.postcodes.io/postcodes/${encodeURIComponent(compact)}`);
    const r = j?.result;
    if (r) {
      return {
        ok: true,
        postcode: r.postcode || pc,
        outcode: r.outcode || outcode,
        lat: r.latitude,
        lng: r.longitude,
        council: r.admin_district || null,
        ward: r.admin_ward || null,
        gss: r.codes?.admin_district || null,
      };
    }
  }
  // Fall back to outcode-level centroid (e.g. "B14").
  const j = await jget(`https://api.postcodes.io/outcodes/${encodeURIComponent(outcode)}`);
  const r = j?.result;
  if (r) {
    return {
      ok: true,
      postcode: pc,
      outcode: r.outcode || outcode,
      lat: r.latitude,
      lng: r.longitude,
      council: Array.isArray(r.admin_district) ? r.admin_district[0] : r.admin_district || null,
      ward: null,
      gss: null,
    };
  }
  return base;
}

function boxWkt(lng: number, lat: number, metres: number) {
  const dLat = metres / 111320;
  const dLng = metres / (111320 * Math.cos((lat * Math.PI) / 180));
  const p = (x: number, y: number) => `${x.toFixed(6)} ${y.toFixed(6)}`;
  return `POLYGON((${p(lng - dLng, lat - dLat)},${p(lng + dLng, lat - dLat)},${p(lng + dLng, lat + dLat)},${p(lng - dLng, lat + dLat)},${p(lng - dLng, lat - dLat)}))`;
}

async function designations(dataset: string, geometryWkt: string, limit = 8): Promise<Designation[]> {
  const url =
    `https://www.planning.data.gov.uk/entity.json?dataset=${dataset}` +
    `&geometry_relation=intersects&geometry=${encodeURIComponent(geometryWkt)}&limit=${limit}`;
  const j = await jget(url);
  const ents = j?.entities;
  if (!Array.isArray(ents)) return [];
  const out: Designation[] = [];
  const seen = new Set<string>();
  for (const e of ents) {
    const name = (e.name || e.reference || "").toString().trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    out.push({ name, reference: e.reference?.toString() });
  }
  return out;
}

const APP_KEYWORDS: Record<string, string[]> = {
  hmo: ["hmo", "house in multiple", "multiple occupation", "c4", "sui generis"],
  extension: ["extension", "rear", "single storey", "two storey", "loft", "dormer"],
  "house-to-flats": ["flats", "conversion", "self-contained", "dwellings", "apartments"],
  "office-to-residential": ["office", "class e", "prior approval", "residential", "dwellings"],
  care: ["care", "supported", "c2", "residential institution"],
  "new-build": ["erection", "new dwelling", "new build", "detached", "outline"],
};

function classifyDecision(state: string): PlanningApp["decision"] {
  const s = (state || "").toLowerCase();
  if (/(permit|grant|approv|allow)/.test(s)) return "Approved";
  if (/(refus|reject|dismiss|withdrawn)/.test(s)) return "Refused";
  if (/(pending|undecid|registered|consult|received|await)/.test(s)) return "Pending";
  return "Other";
}

const emptyCounts: AppCounts = { approved: 0, refused: 0, pending: 0, decided: 0, total: 0 };

export async function nearbyApplications(lat: number, lng: number, slug: string, radiusKm = 0.8): Promise<{ ok: boolean; items: PlanningApp[]; counts: AppCounts }> {
  const url = `https://www.planit.org.uk/api/applics/json?lat=${lat}&lng=${lng}&krad=${radiusKm}&pg_sz=60&sort=-start_date`;
  const j = await jget(url, 60 * 60 * 12);
  const recs = j?.records;
  if (!Array.isArray(recs)) return { ok: false, items: [], counts: emptyCounts };

  const kws = APP_KEYWORDS[slug] || [];
  const scored = recs.map((r: any) => {
    const desc = (r.description || "").toString();
    const type = (r.app_type || "").toString();
    const hay = `${desc} ${type}`.toLowerCase();
    const match = kws.some((k) => hay.includes(k));
    return { r, match };
  });
  const matched = scored.filter((s) => s.match).map((s) => s.r);
  const basis = matched.length ? matched : scored.map((s) => s.r);

  // Approval signal across the (type-matched) set — the report uses this.
  const counts: AppCounts = { ...emptyCounts, total: basis.length };
  for (const r of basis) {
    const d = classifyDecision(r.app_state || r.decision || "");
    if (d === "Approved") counts.approved++;
    else if (d === "Refused") counts.refused++;
    else if (d === "Pending") counts.pending++;
  }
  counts.decided = counts.approved + counts.refused;

  const items: PlanningApp[] = basis.slice(0, 6).map((r: any) => ({
    ref: (r.name || r.reference || r.uid || "—").toString(),
    desc: (r.description || "Planning application").toString().slice(0, 180),
    address: (r.address || "").toString(),
    decision: classifyDecision(r.app_state || r.decision || ""),
    date: (r.decided_date || r.start_date || r.date_received || "").toString().slice(0, 10),
    url: r.url || r.link || null,
  }));
  return { ok: true, items, counts };
}

export async function getLiveIntel(postcode: string, slug: string): Promise<IntelResult> {
  const geo = await geocode(postcode);
  const sources = ["postcodes.io", "planning.data.gov.uk (MHCLG)", "planit.org.uk"];
  const fetchedAt = new Date().toISOString();

  if (!geo.ok || geo.lat == null || geo.lng == null) {
    return {
      ok: false, geo, article4: [], hmoArticle4: false, conservation: [], listed: [],
      flood: { checked: false, zones: [] }, apps: { ok: false, items: [], counts: emptyCounts }, sources, fetchedAt,
    };
  }

  const point = `POINT(${geo.lng} ${geo.lat})`;
  const box = boxWkt(geo.lng, geo.lat, 100);

  const [article4, conservation, flood, listed, apps] = await Promise.all([
    designations("article-4-direction-area", point),
    designations("conservation-area", point),
    designations("flood-risk-zone", point),
    designations("listed-building", box),
    nearbyApplications(geo.lat, geo.lng, slug),
  ]);

  const hmoArticle4 = article4.some((a) => /hmo|multiple occup|c4|c3\/?c4/i.test(a.name));

  return {
    ok: true,
    geo,
    article4,
    hmoArticle4,
    conservation,
    listed,
    flood: { checked: true, zones: flood },
    apps,
    sources,
    fetchedAt,
  };
}
