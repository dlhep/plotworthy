// Prototype property intelligence, deterministic from a postcode.
// In production this draws on the council's Article 4 map, the public HMO
// licensing register and the Planning Data / council planning portal.

export type PlanningApp = {
  ref: string;
  addr: string;
  desc: string;
  decision: "Approved" | "Refused" | "Pending";
  date: string;
};

export type Intel = {
  area: string;
  article4: boolean;
  hmoCount: number;
  pct: number;
  satStatus: string;
  authority: string;
  apps: PlanningApp[];
  rate: number;
};

function pseudo(str: string): number {
  let h = 2166136261;
  for (const c of String(str)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const DESC: Record<string, string[]> = {
  hmo: [
    "Change of use to 6-bed HMO (Sui Generis)",
    "Conversion to 5-bed HMO with fire upgrades",
    "HMO — additional licensing application",
    "Change of use C3 to C4 (small HMO)",
    "Loft conversion adding 2 HMO bedrooms",
  ],
  extension: [
    "Two-storey side and rear extension",
    "Single-storey rear extension",
    "Loft conversion with rear dormer",
    "Garage conversion and front porch",
    "Wraparound ground-floor extension",
  ],
  "house-to-flats": [
    "Conversion of dwelling to 3 self-contained flats",
    "Change of use — house to 2 flats",
    "Subdivision to 4 flats with rear extension",
    "Conversion to 2 maisonettes",
    "House to flats with roof extension",
  ],
  "office-to-residential": [
    "Prior approval — offices to 8 flats (Class MA)",
    "Change of use B1 to 6 residential units",
    "Commercial building to 10 apartments",
    "Prior approval MA — 4 flats",
    "Office block to 12 residential units",
  ],
  care: [
    "Change of use to residential care home (C2)",
    "Supported living — 6-person scheme",
    "C2 care with single-storey extension",
    "Change of use to children's home (C2)",
    "Adaptation to accessible supported housing",
  ],
};

export function getIntel(pc: string, slug: string): Intel {
  const P = (pc || "").toUpperCase().replace(/\s+/g, "");
  const area = (P.match(/^[A-Z]{1,2}\d{1,2}/) || [P])[0];
  const h = pseudo(area + slug);
  const article4 =
    ["B13", "B14", "B29", "B44", "B11", "B12", "B19", "B21"].includes(area) || h % 3 === 0;
  const hmoCount = 2 + (h % 9);
  const totalProps = 55 + (h % 45);
  const pct = Math.round((hmoCount / totalProps) * 1000) / 10;
  const satStatus =
    pct >= 10
      ? "Over the 10% threshold — new HMOs often refused"
      : pct >= 8
      ? "Approaching saturation — check with the council"
      : "Below threshold — room for more HMOs";
  const authority = /^B/.test(area) ? "Birmingham City Council" : "your local planning authority";
  const streets = [
    "Oakfield Road",
    "Station Road",
    "Kings Road",
    "Alcester Road",
    "Grange Road",
    "Park Hill",
    "Church Lane",
    "Woodbridge Road",
  ];
  const decs: PlanningApp["decision"][] = [
    "Approved",
    "Approved",
    "Approved",
    "Refused",
    "Approved",
    "Pending",
    "Approved",
    "Refused",
  ];
  const descs = DESC[slug] || DESC.extension;
  const apps: PlanningApp[] = Array.from({ length: 5 }).map((_, i) => {
    const hh = pseudo(area + slug + "a" + i);
    return {
      ref: `${area}/${23 + (hh % 3)}/${1000 + (hh % 8999)}`,
      addr: `${10 + (hh % 80)} ${streets[hh % streets.length]}`,
      desc: descs[hh % descs.length],
      decision: decs[hh % decs.length],
      date: `0${(hh % 9) + 1}/0${(hh % 9) + 1}/202${3 + (hh % 2)}`,
    };
  });
  const approved = apps.filter((a) => a.decision === "Approved").length;
  const decided = apps.filter((a) => a.decision !== "Pending").length || 1;
  const rate = Math.round((approved / decided) * 100);
  return { area, article4, hmoCount, pct, satStatus, authority, apps, rate };
}

// Deterministic dot positions for the local-area schematic map.
export function hmoDots(intel: Intel) {
  const cx = 160,
    cy = 98,
    R = 66;
  return Array.from({ length: intel.hmoCount }).map((_, i) => {
    const hh = pseudo(intel.area + "h" + i);
    const a = ((hh % 360) * Math.PI) / 180;
    const r = hh % (R - 10);
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });
}

export function appDots(intel: Intel) {
  const cx = 160,
    cy = 98,
    R = 66;
  return intel.apps.map((ap, i) => {
    const hh = pseudo(intel.area + "p" + i);
    const a = ((hh % 360) * Math.PI) / 180;
    const r = R + 10 + (hh % 36);
    const x = Math.max(10, Math.min(310, cx + Math.cos(a) * r));
    const y = Math.max(10, Math.min(190, cy + Math.sin(a) * r));
    return { x, y, decision: ap.decision };
  });
}
