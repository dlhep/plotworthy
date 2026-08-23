// Investment / deal appraisal maths. Self-contained (no external data).
// SDLT bands: England & NI, from 1 April 2025. Additional-property surcharge
// is +5 percentage points on every band, applying when price >= £40,000.

type Band = { upTo: number; rate: number };

const STANDARD_BANDS: Band[] = [
  { upTo: 125_000, rate: 0 },
  { upTo: 250_000, rate: 0.02 },
  { upTo: 925_000, rate: 0.05 },
  { upTo: 1_500_000, rate: 0.1 },
  { upTo: Infinity, rate: 0.12 },
];

/** SDLT for England & NI. `additional` adds the 5% surcharge (BTL/second home). */
export function sdlt(price: number, additional: boolean): number {
  if (!price || price <= 0) return 0;
  const surcharge = additional && price >= 40_000 ? 0.05 : 0;
  let tax = 0;
  let lower = 0;
  for (const b of STANDARD_BANDS) {
    if (price <= lower) break;
    const slice = Math.min(price, b.upTo) - lower;
    tax += slice * (b.rate + surcharge);
    lower = b.upTo;
  }
  return Math.round(tax);
}

export type AppraisalInput = {
  mode: "sell" | "rent";
  purchase: number;
  additional: boolean;
  works: number; // refurb / build cost
  fees: number; // legal, survey, finance, contingency etc.
  gdv: number; // end value (sell mode)
  annualRent: number; // gross annual rent (rent mode)
  runningCosts: number; // annual running costs (rent mode)
};

export type AppraisalResult = {
  sdlt: number;
  totalInvestment: number;
  // sell
  profit: number;
  marginOnGdv: number; // %
  returnOnCost: number; // %
  // rent
  grossYield: number; // % on purchase
  yieldOnCost: number; // % on total invested
  netAnnual: number;
  netYieldOnCost: number; // %
};

export function appraise(i: AppraisalInput): AppraisalResult {
  const duty = sdlt(i.purchase, i.additional);
  const totalInvestment = Math.max(0, i.purchase + duty + i.works + i.fees);

  const profit = i.gdv - totalInvestment;
  const marginOnGdv = i.gdv > 0 ? (profit / i.gdv) * 100 : 0;
  const returnOnCost = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;

  const grossYield = i.purchase > 0 ? (i.annualRent / i.purchase) * 100 : 0;
  const yieldOnCost = totalInvestment > 0 ? (i.annualRent / totalInvestment) * 100 : 0;
  const netAnnual = i.annualRent - i.runningCosts;
  const netYieldOnCost = totalInvestment > 0 ? (netAnnual / totalInvestment) * 100 : 0;

  return {
    sdlt: duty,
    totalInvestment,
    profit,
    marginOnGdv,
    returnOnCost,
    grossYield,
    yieldOnCost,
    netAnnual,
    netYieldOnCost,
  };
}

export const gbp0 = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0
  );
