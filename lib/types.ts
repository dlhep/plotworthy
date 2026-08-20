export type EvidenceStatus = "verified" | "indicative" | "unknown";

export type EvidenceItem = {
  label: string;
  value: string;
  status: EvidenceStatus;
  detail: string;
  source?: string;
  sourceDate?: string;
};

export type FeasibilityResult = {
  requestId: string;
  property: {
    address: string;
    postcode: string;
    district: string;
    ward: string;
    region: string;
    latitude: number | null;
    longitude: number | null;
  };
  summary: string;
  evidence: EvidenceItem[];
  nextSteps: string[];
  disclaimer: string;
};
