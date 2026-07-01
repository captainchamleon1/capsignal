/** Normalize city strings for HQ ↔ founder matching. */
export function normalizeCity(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/,.*$/, "")
    .replace(/\s+(area|metro|region)$/i, "")
    .trim();
}

/** Shared metro groups — either city matching the group counts as local. */
const METRO_GROUPS: string[][] = [
  ["san francisco", "sf", "bay area", "silicon valley", "oakland", "berkeley", "san mateo", "palo alto", "menlo park", "mountain view", "sunnyvale", "san jose"],
  ["new york", "nyc", "new york city", "manhattan", "brooklyn", "queens"],
  ["los angeles", "la", "santa monica", "venice", "pasadena"],
  ["boston", "cambridge", "somerville"],
  ["austin", "round rock"],
  ["seattle", "bellevue", "redmond"],
  ["chicago", "evanston"],
  ["miami", "fort lauderdale"],
  ["denver", "boulder"],
  ["atlanta"],
  ["washington", "dc", "washington dc", "arlington", "alexandria"],
  ["london"],
  ["paris"],
  ["berlin"],
  ["toronto", "vancouver", "montreal"],
];

function metroKey(city: string): string | null {
  const n = normalizeCity(city);
  for (const group of METRO_GROUPS) {
    if (group.some((g) => n === g || n.includes(g) || g.includes(n))) {
      return group[0];
    }
  }
  return null;
}

/** 0–100 location fit; null when no founder city or no firm HQ on file. */
export function cityFit(
  firmCity: string | null | undefined,
  targetCity: string | undefined,
): number | null {
  if (!targetCity?.trim() || !firmCity?.trim()) return null;

  const target = normalizeCity(targetCity);
  const firm = normalizeCity(firmCity);

  if (firm === target || firm.includes(target) || target.includes(firm)) return 100;

  const targetMetro = metroKey(targetCity);
  const firmMetro = metroKey(firmCity);
  if (targetMetro && firmMetro && targetMetro === firmMetro) return 92;

  return 35;
}
