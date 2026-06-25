const STAGE_PATTERNS: [string, RegExp][] = [
  ["pre_seed", /\bpre[- ]?seed\b/i],
  ["seed", /\bseed\b/i],
  ["series_a", /\bseries\s*a\b/i],
  ["series_b", /\bseries\s*b\b/i],
  ["series_b", /\bgrowth\b/i],
];

const SECTOR_PATTERNS: [string, RegExp][] = [
  ["b2b_saas", /\b(saas|software|b2b|enterprise|devtools|infra)\b/i],
  ["fintech", /\b(fintech|finance|payments|banking|insurtech)\b/i],
  ["healthtech", /\b(health|biotech|medtech|pharma|life science)\b/i],
  ["climate", /\b(climate|cleantech|energy|sustainability|carbon)\b/i],
  ["deep_tech", /\b(ai|ml|robotics|semiconductor|deep tech|hardware)\b/i],
  ["consumer", /\b(consumer|retail|marketplace|d2c|ecommerce)\b/i],
];

export function parseStages(text: string): string[] {
  const stages = new Set<string>();
  for (const [stage, re] of STAGE_PATTERNS) {
    if (re.test(text)) stages.add(stage);
  }
  return [...stages];
}

export function parseSectors(text: string): string[] {
  const sectors = new Set<string>();
  for (const [sector, re] of SECTOR_PATTERNS) {
    if (re.test(text)) sectors.add(sector);
  }
  return [...sectors];
}

export function parseFirmType(text: string): string {
  const lower = text.toLowerCase();
  if (/angel/.test(lower)) return "angel_group";
  if (/accelerator|incubator/.test(lower)) return "accelerator";
  if (/family office/.test(lower)) return "family_office";
  if (/corporate/.test(lower)) return "corporate_vc";
  if (/private equity|\bpe\b/.test(lower)) return "vc"; // PE often overlaps for growth
  return "vc";
}

export function normalizeWebsite(url?: string): string | undefined {
  if (!url?.trim()) return undefined;
  let u = url.trim();
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  return u.replace(/\/$/, "");
}

export function parseGeos(country?: string, region?: string): string[] {
  const geos = new Set<string>();
  const blob = `${country ?? ""} ${region ?? ""}`.toUpperCase();
  if (/US|USA|UNITED STATES/.test(blob)) geos.add("US");
  if (/EU|EUROPE|FRA|DEU|GBR|UK/.test(blob)) geos.add("EU");
  if (/ASIA|SGP|IND|CHN|JPN/.test(blob)) geos.add("ASIA");
  return [...geos];
}
