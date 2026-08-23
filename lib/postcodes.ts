// Small helpers for working with UK postcode districts (e.g. "TS7", "B13").

/** Postcode AREA — the leading letters, e.g. "TS7 0PD" -> "TS", "B13" -> "B". */
export function postcodeArea(s?: string | null): string {
  const m = (s || "").toUpperCase().match(/[A-Z]{1,2}/);
  return m ? m[0] : "";
}

/** Normalise a token to its district code, e.g. "TS7 0PD" -> "TS7", "b13" -> "B13". */
export function toDistrict(token?: string | null): string {
  const t = (token || "").toUpperCase().replace(/\s+/g, " ").trim();
  const first = t.split(" ")[0];
  const m = first.match(/^[A-Z]{1,2}\d[A-Z\d]?/);
  return m ? m[0] : "";
}

/** Parse a free-text coverage string into a de-duplicated list of districts. */
export function districtsFromCoverage(coverage?: string | null): string[] {
  if (!coverage) return [];
  const out: string[] = [];
  for (const part of coverage.split(/[,;/\n]+/)) {
    const d = toDistrict(part);
    if (d && !out.includes(d)) out.push(d);
  }
  return out;
}
