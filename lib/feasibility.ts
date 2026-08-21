import type { FeasibilityInput } from "@/lib/validation";
import type { EvidenceItem, FeasibilityResult } from "@/lib/types";

type PostcodeLookup = {
  postcode: string;
  admin_district: string | null;
  admin_ward: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
};

const projectLabels: Record<FeasibilityInput["projectType"], string> = {
  hmo: "HMO conversion",
  flats: "conversion into flats",
  extension: "extension or loft conversion",
  land: "land development",
  other: "property project"
};

export async function lookupPostcode(postcode: string): Promise<PostcodeLookup> {
  const response = await fetch(
    `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.replace(/\s+/g, ""))}`,
    { signal: AbortSignal.timeout(5000), cache: "no-store" }
  );

  if (!response.ok) throw new Error("We could not verify that postcode.");
  const body = (await response.json()) as { result: PostcodeLookup | null };
  if (!body.result) throw new Error("We could not verify that postcode.");
  return body.result;
}

export function buildPreliminaryResult(
  input: FeasibilityInput,
  postcode: PostcodeLookup
): FeasibilityResult {
  const evidence: EvidenceItem[] = [
    {
      label: "Location",
      value: [postcode.admin_ward, postcode.admin_district].filter(Boolean).join(", ") || "Postcode verified",
      status: "verified",
      detail: "The postcode and local authority geography have been verified.",
      source: "Office for National Statistics postcode data via postcodes.io"
    },
    {
      label: "Planning history",
      value: "Authority search required",
      status: "unknown",
      detail: "We have not claimed a planning outcome until the local authority record is matched to this address."
    },
    {
      label: "Article 4 direction",
      value: "Boundary check required",
      status: "unknown",
      detail: "Article 4 status must be checked against the council's current mapped direction and wording."
    },
    {
      label: "Licensed HMOs within 100m",
      value: "Register check required",
      status: "unknown",
      detail: "A count is only shown when current council licensing data has a verified location and source date."
    },
    {
      label: "Project route",
      value: projectLabels[input.projectType],
      status: "indicative",
      detail: projectGuidance(input.projectType)
    }
  ];

  return {
    requestId: crypto.randomUUID(),
    property: {
      address: input.address,
      postcode: postcode.postcode,
      district: postcode.admin_district ?? "Not returned",
      ward: postcode.admin_ward ?? "Not returned",
      region: postcode.region ?? "Not returned",
      latitude: postcode.latitude,
      longitude: postcode.longitude
    },
    summary: `A preliminary evidence checklist for ${input.address}. It confirms the location, then clearly separates what is known from the council and title checks still needed.`,
    evidence,
    nextSteps: [
      "Match the full address against the council planning register.",
      "Check Article 4, conservation, flood and other mapped constraints.",
      "Confirm the existing lawful use, measurements and title before relying on a development route.",
      "Ask a suitable local professional to review the evidence and scope."
    ],
    disclaimer:
      "This is an early feasibility snapshot, not planning, legal, valuation or building-control advice. A professional and the relevant authority should verify the route before you commit money or works."
  };
}

function projectGuidance(type: FeasibilityInput["projectType"]) {
  switch (type) {
    case "flats":
      return "Subdividing a house into self-contained flats normally requires planning permission; the local plan, space standards and constraints must be checked.";
    case "hmo":
      return "The planning and licensing routes are separate. Occupancy, local Article 4 rules and the council's licensing scheme all matter.";
    case "extension":
      return "Some works may fall within permitted development, but limits, prior approvals and local restrictions must be checked.";
    case "land":
      return "Access, policy, constraints, services, ecology and development economics need site-specific evidence.";
    default:
      return "The most likely consent route depends on the current use, proposal and local constraints.";
  }
}
