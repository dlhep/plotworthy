// The project brief: the first thing a client creates, and the artifact a
// professional reads to give a fee quote — without a single back-and-forth.
//
// The brief is goal-aware: an HMO brief asks different quote-relevant questions
// than an office-to-residential conversion. Everything here is designed around
// one test — "could a professional price their fee from this alone?"

import { GOALS } from "./start";

export type FieldType = "text" | "textarea" | "select" | "number" | "multi";

export type BriefField = {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  options?: string[];
  /** Counts toward the "quote-ready" score. */
  critical?: boolean;
};

export type BriefSection = {
  title: string;
  intro?: string;
  fields: BriefField[];
};

export type BriefData = Record<string, string>;

/** Disciplines PlotWorthy suggests up front, per goal. */
const DISCIPLINES = [
  "Architect / designer",
  "Planning consultant",
  "Structural engineer",
  "Party wall surveyor",
  "Building control / approved inspector",
  "Quantity surveyor",
  "Fire consultant",
  "Licensing / HMO specialist",
  "Care / CQC adviser",
  "Main contractor",
  "Letting / lease adviser",
  "Valuer / surveyor",
];

export function goalLabel(goalId?: string) {
  return GOALS.find((g) => g.id === goalId)?.label ?? "A property project";
}

export function goalSlug(goalId?: string) {
  return GOALS.find((g) => g.id === goalId)?.journeySlug ?? null;
}

// ---- Shared sections -------------------------------------------------------

const PROPERTY: BriefSection = {
  title: "The property",
  intro: "What a professional needs to picture the building and the site.",
  fields: [
    { id: "address", label: "Address", type: "text", placeholder: "House / building and street", critical: true },
    { id: "postcode", label: "Postcode", type: "text", placeholder: "e.g. B14 7AA", critical: true },
    {
      id: "propertyType",
      label: "Property type",
      type: "select",
      options: ["Terraced house", "Semi-detached house", "Detached house", "Flat / maisonette", "Office / commercial", "Mixed use", "Land / plot", "Other"],
      critical: true,
    },
    {
      id: "tenure",
      label: "Tenure",
      type: "select",
      options: ["Freehold", "Leasehold", "Not sure yet", "Not yet owned"],
      help: "Critical for conversions and lease-based projects.",
      critical: true,
    },
    { id: "currentUse", label: "Current use", type: "text", placeholder: "e.g. single family home, vacant offices", critical: true },
    {
      id: "size",
      label: "Approximate size",
      type: "text",
      placeholder: "e.g. 3 storeys, ~140 m², 4 bedrooms",
      help: "Rough is fine — floor area, storeys, or number of rooms.",
    },
  ],
};

const PRACTICALITIES: BriefSection = {
  title: "Timescale, budget & what you have",
  intro: "The context that shapes the fee and the sequence of work.",
  fields: [
    {
      id: "timescale",
      label: "Timescale",
      type: "select",
      options: ["As soon as possible", "Within 3 months", "3–6 months", "6–12 months", "Just exploring for now"],
      critical: true,
    },
    {
      id: "budgetBand",
      label: "Rough build budget",
      type: "select",
      options: ["Not sure yet", "Under £50k", "£50k–£150k", "£150k–£350k", "£350k–£750k", "£750k+"],
      help: "Optional, but it helps a professional scope their fee.",
    },
    {
      id: "documents",
      label: "What you already have",
      type: "multi",
      options: ["Existing drawings / floorplans", "A recent survey", "A prior planning decision", "Title / lease documents", "Photos", "Nothing yet"],
      help: "So a professional knows what they're starting from.",
    },
    {
      id: "notes",
      label: "Anything else a professional should know",
      type: "textarea",
      placeholder: "Constraints you're aware of, your priorities, questions you already have…",
    },
  ],
};

const DISCIPLINE_SECTION: BriefSection = {
  title: "Who you think you need",
  intro: "Pick any you already know you'll want — PlotWorthy will suggest the rest for your journey.",
  fields: [{ id: "disciplines", label: "Professionals to introduce", type: "multi", options: DISCIPLINES }],
};

const CONTACT: BriefSection = {
  title: "How professionals reach you",
  fields: [
    { id: "clientName", label: "Your name", type: "text", placeholder: "First and last", critical: true },
    { id: "clientEmail", label: "Email", type: "text", placeholder: "you@example.com", critical: true },
    { id: "clientPhone", label: "Phone", type: "text", placeholder: "Optional" },
    {
      id: "contactPref",
      label: "Preferred contact",
      type: "select",
      options: ["Email", "Phone", "Either"],
    },
  ],
};

// ---- Goal-specific "the project" section -----------------------------------

function projectSection(goalId?: string): BriefSection {
  const base: Record<string, BriefSection> = {
    extension: {
      title: "The project — extend or improve",
      fields: [
        { id: "extType", label: "Type of work", type: "select", options: ["Rear extension", "Side extension", "Wrap-around", "Loft conversion", "Garage conversion", "Internal remodel", "Combination"], critical: true },
        { id: "storeys", label: "Storeys affected", type: "select", options: ["Single storey", "Two storey", "More than two"], critical: true },
        { id: "structural", label: "Structural work expected?", type: "select", options: ["Yes", "No", "Not sure"], critical: true },
        { id: "ambition", label: "What you're trying to achieve", type: "textarea", placeholder: "e.g. open-plan kitchen-diner and an extra bedroom" },
      ],
    },
    "house-to-flats": {
      title: "The project — convert a house into flats",
      fields: [
        { id: "targetUnits", label: "Number of flats you're aiming for", type: "number", placeholder: "e.g. 3", critical: true },
        { id: "currentConfig", label: "Current configuration", type: "text", placeholder: "e.g. 5-bed Victorian terrace over 3 floors", critical: true },
        { id: "changeOfUse", label: "Change of use needed?", type: "select", options: ["Yes", "No", "Not sure"], critical: true },
        { id: "ambition", label: "Target mix", type: "textarea", placeholder: "e.g. 2 × 1-bed and 1 × 2-bed, all self-contained" },
      ],
    },
    "office-to-residential": {
      title: "The project — commercial to homes",
      fields: [
        { id: "buildingType", label: "Current building type", type: "select", options: ["Office", "Retail / shop", "Light industrial", "Other commercial"], critical: true },
        { id: "grossArea", label: "Gross internal floor area", type: "text", placeholder: "e.g. ~600 m²", critical: true },
        { id: "targetUnits", label: "Number of homes you're aiming for", type: "number", placeholder: "e.g. 8", critical: true },
        { id: "route", label: "Planning route (if known)", type: "select", options: ["Permitted development / prior approval", "Full planning", "Not sure"], critical: true },
        { id: "ambition", label: "Target mix and standard", type: "textarea", placeholder: "e.g. 6 × 1-bed, 2 × 2-bed to a lettable standard" },
      ],
    },
    hmo: {
      title: "The project — HMO",
      fields: [
        { id: "targetBeds", label: "Number of lettable bedrooms", type: "number", placeholder: "e.g. 6", critical: true },
        { id: "roomStandard", label: "Room standard", type: "select", options: ["All en-suite", "Mix of en-suite and shared", "All shared bathrooms", "Not decided"], critical: true },
        { id: "sizeBand", label: "Size of HMO", type: "select", options: ["Up to 6 people", "7+ people (large HMO)", "Not sure"], help: "Affects licensing and Article 4.", critical: true },
        { id: "ambition", label: "What you're aiming for", type: "textarea", placeholder: "e.g. professional let, 6 en-suite rooms with shared kitchen" },
      ],
    },
    care: {
      title: "The project — care or supported accommodation",
      fields: [
        { id: "careType", label: "Type of provision", type: "select", options: ["Supported living", "Children's home", "Elderly / residential care", "Semi-independent (16+)", "Other"], critical: true },
        { id: "residents", label: "Number of residents / beds", type: "number", placeholder: "e.g. 4", critical: true },
        { id: "regulator", label: "Regulated by", type: "select", options: ["CQC", "Ofsted", "Not regulated", "Not sure"], critical: true },
        { id: "ambition", label: "Model and any adaptations needed", type: "textarea", placeholder: "e.g. 4-bed supported living with wet rooms and a staff sleep-in room" },
      ],
    },
  };

  return (
    base[goalId ?? ""] ?? {
      title: "The project",
      fields: [
        { id: "projectSummary", label: "Describe your project", type: "textarea", placeholder: "What you want to do with the property", critical: true },
        { id: "ambition", label: "What success looks like", type: "textarea", placeholder: "Your goal for the finished property" },
      ],
    }
  );
}

export function briefSpec(goalId?: string): BriefSection[] {
  return [projectSection(goalId), PROPERTY, PRACTICALITIES, DISCIPLINE_SECTION, CONTACT];
}

// ---- Quote-readiness -------------------------------------------------------

export function readiness(goalId: string | undefined, data: BriefData) {
  const critical = briefSpec(goalId)
    .flatMap((s) => s.fields)
    .filter((f) => f.critical);
  const done = critical.filter((f) => (data[f.id] ?? "").trim().length > 0).length;
  const pct = critical.length ? Math.round((done / critical.length) * 100) : 0;
  const label = pct >= 100 ? "Quote-ready" : pct >= 60 ? "Nearly quote-ready" : "In progress";
  return { done, total: critical.length, pct, label };
}

export const BRIEF_STORAGE_KEY = "plotworthy.brief.v1";
