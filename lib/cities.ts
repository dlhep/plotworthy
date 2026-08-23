// City -> postcode districts, for quickly assigning coverage in admin.
// Ranges are approximate conveniences: admin can trim after adding.

function range(area: string, from: number, to: number): string[] {
  const out: string[] = [];
  for (let i = from; i <= to; i++) out.push(`${area}${i}`);
  return out;
}

export const CITY_DISTRICTS: Record<string, string[]> = {
  "Middlesbrough / Teesside (TS)": range("TS", 1, 20),
  "Birmingham (B)": range("B", 1, 48),
  "Leeds (LS)": range("LS", 1, 29),
  "Manchester (M)": range("M", 1, 46),
  "Newcastle (NE)": range("NE", 1, 13),
  "Sunderland (SR)": range("SR", 1, 8),
  "Durham (DH)": range("DH", 1, 9),
  "Liverpool (L)": range("L", 1, 40),
  "Sheffield (S)": range("S", 1, 20),
  "Bristol (BS)": range("BS", 1, 16),
  "Nottingham (NG)": range("NG", 1, 16),
  "Leicester (LE)": range("LE", 1, 9),
  "Cardiff (CF)": range("CF", 3, 15),
  "Edinburgh (EH)": range("EH", 1, 17),
  "Glasgow (G)": range("G", 1, 45),
  "York (YO)": range("YO", 1, 32),
  "Sheffield/Rotherham (S60)": range("S", 60, 66),
};

export const CITY_NAMES = Object.keys(CITY_DISTRICTS);
