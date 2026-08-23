// The guided "Start your journey" flow: one decision per screen.

export type GoalOption = {
  id: string;
  label: string;
  emoji: string;
  journeySlug: string | null; // null => guidance / not sure
  note: string;
};

export const GOALS: GoalOption[] = [
  {
    id: "extension",
    label: "Extend or improve a home",
    emoji: "📐",
    journeySlug: "extension",
    note: "Extensions, loft conversions and remodels.",
  },
  {
    id: "house-to-flats",
    label: "Convert a house into flats",
    emoji: "🏢",
    journeySlug: "house-to-flats",
    note: "Split a house into self-contained flats.",
  },
  {
    id: "office-to-residential",
    label: "Convert an office or commercial building into homes",
    emoji: "🏬",
    journeySlug: "office-to-residential",
    note: "Commercial-to-residential conversions.",
  },
  {
    id: "hmo",
    label: "Create or invest in an HMO",
    emoji: "🏠",
    journeySlug: "hmo",
    note: "House in multiple occupation projects.",
  },
  {
    id: "care",
    label: "Create a care or supported accommodation project",
    emoji: "🤝",
    journeySlug: "care",
    note: "Care, supported living and C2 projects.",
  },
  {
    id: "new-build",
    label: "Build a new home",
    emoji: "🧱",
    journeySlug: "new-build",
    note: "A new home or self-build on a plot of land.",
  },
  {
    id: "unsure",
    label: "I’m not sure yet",
    emoji: "🧭",
    journeySlug: null,
    note: "PlotWorthy will help you find the right route.",
  },
];

export type PositionOption = {
  id: string;
  label: string;
  stage: number; // index (0-6) in the universal journey
  help?: boolean;
};

export const POSITIONS: PositionOption[] = [
  { id: "exploring", label: "I am exploring an idea", stage: 0 },
  { id: "looking", label: "I am looking for a property", stage: 1 },
  { id: "considering", label: "I am considering buying a property", stage: 1 },
  { id: "own", label: "I already own the property", stage: 2 },
  { id: "started", label: "I have already started the project", stage: 4 },
  {
    id: "wrong",
    label: "Something has gone wrong and I need help",
    stage: 2,
    help: true,
  },
];
