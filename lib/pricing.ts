// Professional membership pricing (founding rates). Mirrors the /join page.
// Monthly figures in GBP, excluding VAT.
export const PRICING = {
  base: 39, // membership
  postcodePack: 12, // per pack of 5 districts
  enhanced: 19, // enhanced profile (includes the website link)
  website: 9, // website link on its own
};

export type Membership = {
  postcodePacks: number; // count of £12 packs
  enhanced: boolean;
  website: boolean;
};

export const EMPTY_MEMBERSHIP: Membership = {
  postcodePacks: 0,
  enhanced: false,
  website: false,
};

export function normalizeMembership(raw: unknown): Membership {
  const m = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const packs = Number(m.postcodePacks);
  return {
    postcodePacks: Number.isFinite(packs) && packs > 0 ? Math.floor(packs) : 0,
    enhanced: Boolean(m.enhanced),
    website: Boolean(m.website),
  };
}

/** Monthly recurring revenue for one active member, in GBP. */
export function memberMonthly(m?: Membership): number {
  const mm = m || EMPTY_MEMBERSHIP;
  // The website link is included free with the Enhanced profile.
  const websiteCharge = mm.website && !mm.enhanced ? PRICING.website : 0;
  return (
    PRICING.base +
    Math.max(0, mm.postcodePacks) * PRICING.postcodePack +
    (mm.enhanced ? PRICING.enhanced : 0) +
    websiteCharge
  );
}

export type RevenueBreakdown = {
  members: number;
  base: number;
  postcodePacks: number;
  enhanced: number;
  website: number;
  mrr: number;
  arr: number;
};

/** Aggregate MRR across a set of active members' memberships. */
export function revenueBreakdown(memberships: Membership[]): RevenueBreakdown {
  const b: RevenueBreakdown = {
    members: memberships.length,
    base: 0,
    postcodePacks: 0,
    enhanced: 0,
    website: 0,
    mrr: 0,
    arr: 0,
  };
  for (const m of memberships) {
    b.base += PRICING.base;
    b.postcodePacks += Math.max(0, m.postcodePacks) * PRICING.postcodePack;
    if (m.enhanced) b.enhanced += PRICING.enhanced;
    if (m.website && !m.enhanced) b.website += PRICING.website;
  }
  b.mrr = b.base + b.postcodePacks + b.enhanced + b.website;
  b.arr = b.mrr * 12;
  return b;
}

export function gbp(n: number): string {
  return `£${n.toLocaleString("en-GB")}`;
}

// Optional client extras (the core journey stays free). Placeholder prices —
// adjust here and they update across the site.
export const CLIENT_PRICING = {
  expertReview: 49, // one-off, per brief
  costCheck: 99, // one-off, independent review of a builder's costings
  plusMonthly: 19, // PlotWorthy Plus subscription (incl. guided adviser), per month
};
