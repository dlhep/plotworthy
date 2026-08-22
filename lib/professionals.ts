// Illustrative vetted professionals, grouped by discipline.
// These are sample records for the demonstration — not real firms.

export type Discipline =
  | "architect"
  | "planning"
  | "structural"
  | "fire"
  | "surveyor"
  | "builder"
  | "letting"
  | "licensing"
  | "commercial"
  | "adviser";

export type Professional = {
  id: string;
  name: string;
  firm: string;
  discipline: Discipline;
  location: string;
  blurb: string;
  rating: number;
  projects: number;
};

export const DISCIPLINE_LABEL: Record<Discipline, string> = {
  architect: "Architect",
  planning: "Planning consultant",
  structural: "Structural engineer",
  fire: "Fire consultant",
  surveyor: "Surveyor / valuer",
  builder: "Builder / contractor",
  letting: "Letting / lease adviser",
  licensing: "Licensing / care specialist",
  commercial: "Commercial adviser",
  adviser: "PlotWorthy adviser",
};

export const PROFESSIONALS: Professional[] = [
  {
    id: "arch-1",
    name: "Priya Anand",
    firm: "Anand + Rowe Architecture",
    discipline: "architect",
    location: "Bristol",
    blurb: "Residential conversions and HMOs. Strong on feasibility and planning-led design.",
    rating: 4.9,
    projects: 62,
  },
  {
    id: "arch-2",
    name: "Tom Beckett",
    firm: "Beckett Studio",
    discipline: "architect",
    location: "Manchester",
    blurb: "Extensions and change-of-use. Known for practical, buildable detailing.",
    rating: 4.8,
    projects: 48,
  },
  {
    id: "plan-1",
    name: "Sarah Nwosu",
    firm: "Meridian Planning",
    discipline: "planning",
    location: "London",
    blurb: "Article 4 and permitted development specialist. High approval record.",
    rating: 4.9,
    projects: 90,
  },
  {
    id: "plan-2",
    name: "Iain Cameron",
    firm: "Cameron Planning Consultancy",
    discipline: "planning",
    location: "Leeds",
    blurb: "Commercial-to-residential and prior approval. Clear viability advice.",
    rating: 4.7,
    projects: 71,
  },
  {
    id: "struct-1",
    name: "Dev Patel",
    firm: "Patel Structures",
    discipline: "structural",
    location: "Birmingham",
    blurb: "Openings, loft conversions and subdivision structures. Fast turnaround.",
    rating: 4.8,
    projects: 120,
  },
  {
    id: "fire-1",
    name: "Grace Okonkwo",
    firm: "Ember Fire Engineering",
    discipline: "fire",
    location: "London",
    blurb: "HMO and multi-occupancy fire strategy, detection and means of escape.",
    rating: 4.9,
    projects: 54,
  },
  {
    id: "surv-1",
    name: "James Fielding",
    firm: "Fielding Surveyors",
    discipline: "surveyor",
    location: "Nationwide",
    blurb: "RICS building surveys and valuations for conversion and investment.",
    rating: 4.7,
    projects: 210,
  },
  {
    id: "build-1",
    name: "Marek Kowalski",
    firm: "Kowalski Construction",
    discipline: "builder",
    location: "South East",
    blurb: "Conversions and fit-out. Fixed-price contracts and staged payments.",
    rating: 4.8,
    projects: 39,
  },
  {
    id: "let-1",
    name: "Hannah Reid",
    firm: "Reid Lettings & Management",
    discipline: "letting",
    location: "Bristol",
    blurb: "HMO and flat management, licensing renewals and tenant find.",
    rating: 4.8,
    projects: 145,
  },
  {
    id: "lic-1",
    name: "Olu Adeyemi",
    firm: "Adeyemi Care Consulting",
    discipline: "licensing",
    location: "Nationwide",
    blurb: "HMO licensing and CQC / supported-living registration guidance.",
    rating: 4.9,
    projects: 33,
  },
  {
    id: "comm-1",
    name: "Rachel Stone",
    firm: "Stone Development Advisory",
    discipline: "commercial",
    location: "London",
    blurb: "Development appraisals, funding and exit strategy for small schemes.",
    rating: 4.7,
    projects: 58,
  },
];

// Map a free-text stage role (e.g. "Architect (feasibility)") to a discipline.
export function disciplineFromRole(role: string): Discipline {
  const r = role.toLowerCase();
  if (r.includes("architect")) return "architect";
  if (r.includes("planning")) return "planning";
  if (r.includes("structural") || r.includes("engineer") && !r.includes("m&e") && !r.includes("fire"))
    return "structural";
  if (r.includes("fire")) return "fire";
  if (r.includes("survey") || r.includes("valu")) return "surveyor";
  if (r.includes("build") || r.includes("contractor") || r.includes("trades"))
    return "builder";
  if (r.includes("lett") || r.includes("lease") || r.includes("managing") || r.includes("sales") || r.includes("conveyanc"))
    return "letting";
  if (r.includes("licens") || r.includes("care") || r.includes("registration") || r.includes("commission"))
    return "licensing";
  if (r.includes("commercial") || r.includes("finance"))
    return "commercial";
  return "adviser";
}

export function professionalsFor(discipline: Discipline): Professional[] {
  const matches = PROFESSIONALS.filter((p) => p.discipline === discipline);
  if (matches.length > 0) return matches;
  // Fallback: surface the PlotWorthy adviser concept via architects as generalists.
  return PROFESSIONALS.filter((p) => p.discipline === "architect").slice(0, 2);
}
