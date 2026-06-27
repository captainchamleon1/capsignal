/** Total investor records referenced in product copy (aligned with homepage stats). */
export const INVESTOR_DATABASE_SIZE = 12_000;

/** How many ranked investors to show in the pre-subscribe preview. */
export const PREVIEW_TOP_COUNT = 12;

/** How many preview rows show full detail before contact lock blur. */
export const PREVIEW_VISIBLE_COUNT = 6;

const formatter = new Intl.NumberFormat("en-US");

export function formatInvestorCount(count: number): string {
  return formatter.format(count);
}

/** Deterministic, profile-specific pool size — reads like filtering a 12k+ database. */
export function estimateMatchPool(stage: string, sector: string, company?: string): number {
  const input = `${stage}|${sector}|${company?.trim().toLowerCase() ?? ""}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return 920 + (hash % 3_931);
}

export function resolveDisplayMatchCount(
  stage: string,
  sector: string,
  company?: string,
  qualifiedCount?: number,
): number {
  const estimated = estimateMatchPool(stage, sector, company);
  if (qualifiedCount === undefined) return estimated;
  return Math.max(estimated, qualifiedCount);
}
