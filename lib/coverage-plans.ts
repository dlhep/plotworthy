export const coveragePlans = {
  single: {
    key: "single",
    name: "One extra district",
    shortName: "+1 district",
    slots: 1,
    monthlyPricePence: 500,
    priceEnv: "STRIPE_COVERAGE_SINGLE_PRICE_ID"
  },
  local: {
    key: "local",
    name: "Local growth pack",
    shortName: "+10 districts",
    slots: 10,
    monthlyPricePence: 4000,
    priceEnv: "STRIPE_COVERAGE_LOCAL_PRICE_ID"
  },
  regional: {
    key: "regional",
    name: "Regional growth pack",
    shortName: "+25 districts",
    slots: 25,
    monthlyPricePence: 7500,
    priceEnv: "STRIPE_COVERAGE_REGIONAL_PRICE_ID"
  }
} as const;

export type CoveragePlanKey = keyof typeof coveragePlans;

export function isCoveragePlanKey(value: string): value is CoveragePlanKey {
  return value in coveragePlans;
}

export function formatMonthlyPrice(pricePence: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }).format(pricePence / 100);
}
