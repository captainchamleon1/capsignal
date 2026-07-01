import { formatCheckSize } from "@/lib/format";
import { cityFit } from "@/lib/data/scoring/location";

export type MatchRationaleInput = {
  company?: string;
  stage: string;
  sector: string;
  sectorLabel?: string;
  city?: string;
  raise?: string;
  firmName: string;
  partner?: string | null;
  hqCity?: string | null;
  checkMinUsd?: number | null;
  checkMaxUsd?: number | null;
  checkSizeLabel?: string;
  portfolioCompanies?: string[];
  /** Real count from dated investments only — omit for demo data */
  recentInvestmentCount?: number;
  activeFundName?: string | null;
  variantSeed?: string;
};

const STAGE_LABELS: Record<string, string> = {
  pre_seed: "Pre-seed",
  seed: "Seed",
  series_a: "Series A",
  series_b: "Series B",
};

const SECTOR_LABELS: Record<string, string> = {
  b2b_saas: "B2B SaaS",
  fintech: "fintech",
  healthtech: "healthtech",
  climate: "climate tech",
  deep_tech: "AI / ML",
  consumer: "consumer",
};

function stageLabel(stage: string): string {
  return STAGE_LABELS[stage] ?? stage.replace(/_/g, " ");
}

function stageInline(stage: string): string {
  const label = stageLabel(stage);
  return label === "Pre-seed" ? "pre-seed" : label.toLowerCase();
}

function sectorLabel(sector: string, override?: string): string {
  return override ?? SECTOR_LABELS[sector] ?? sector.replace(/_/g, " ");
}

function partnerFirstName(partner?: string | null): string | null {
  if (!partner?.trim()) return null;
  return partner.trim().split(/\s+/)[0] ?? null;
}

function portfolioPair(names: string[]): [string, string] | [string] | null {
  const clean = names.map((n) => n.trim()).filter(Boolean);
  if (clean.length === 0) return null;
  if (clean.length === 1) return [clean[0]];
  return [clean[0], clean[1]];
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pick<T>(items: T[], seed: string): T {
  return items[hashSeed(seed) % items.length];
}

/** Avoid "a's raise" when company is a single letter or empty. */
function companyContext(raw?: string): { label: string; forRaise: string } {
  const trimmed = raw?.trim() ?? "";
  const usable = trimmed.length >= 2 && !/^[a-z]$/i.test(trimmed);
  if (usable) {
    return { label: trimmed, forRaise: `${trimmed}'s raise` };
  }
  return { label: "you", forRaise: "your raise" };
}

function isLocal(hqCity?: string | null, city?: string): boolean {
  if (!hqCity?.trim() || !city?.trim()) return false;
  return (cityFit(hqCity, city) ?? 0) >= 80;
}

/** Single polished sentence — reads like a human wrote it for this founder. */
export function buildMatchRationale(input: MatchRationaleInput): string {
  const { label: company, forRaise } = companyContext(input.company);
  const stage = stageInline(input.stage);
  const sector = sectorLabel(input.sector, input.sectorLabel);
  const first = partnerFirstName(input.partner);
  const pair = portfolioPair(input.portfolioCompanies ?? []);
  const local = isLocal(input.hqCity, input.city);
  const checks =
    input.checkSizeLabel ??
    formatCheckSize(input.checkMinUsd, input.checkMaxUsd);
  const hasChecks = checks !== "Check size varies";
  const seed = input.variantSeed ?? input.firmName;
  const deploying =
    (input.recentInvestmentCount ?? 0) >= 2 ? " — still actively deploying" : "";

  if (pair && first) {
    const [a, b] = pair.length === 2 ? pair : [pair[0], null];
    const templates =
      b !== null
        ? [
            `${first} led ${a} and ${b} at ${stage} — strong ${sector} overlap for ${forRaise}.`,
            `${first} at ${input.firmName} backed ${a} and ${b}; one of the tighter ${sector} fits for ${company}.`,
            local
              ? `${first} (${input.hqCity}) backed ${a} and ${b} — local ${sector} partner for ${forRaise}.`
              : `${first} backed ${a} and ${b}; ${input.firmName} is a core ${sector} fund at ${stage}.`,
            hasChecks
              ? `${first} writes ${checks} and led ${a} — aligned with ${forRaise}.`
              : `${first} led ${a} and ${b}${deploying}.`,
          ]
        : [
            `${first} led ${a} at ${stage} — ${input.firmName} is a strong ${sector} match for ${forRaise}.`,
            `${first} at ${input.firmName} backed ${a}; worth a thesis-fit intro for ${forRaise}.`,
          ];
    return pick(templates, seed);
  }

  if (pair && !first) {
    const [a, b] = pair.length === 2 ? pair : [pair[0], null];
    if (b) {
      return `${input.firmName} backed ${a} and ${b} — ${sector} thesis fit at ${stage} for ${forRaise}.`;
    }
    return `${input.firmName} invested in ${a}; relevant ${sector} fund for ${forRaise}.`;
  }

  if (first && local) {
    return `${first} is based in ${input.hqCity} — prioritize for ${forRaise} before national outreach.`;
  }

  if (first && hasChecks) {
    return `${first} at ${input.firmName} writes ${checks} into ${sector} at ${stage} — fit for ${forRaise}.`;
  }

  if (first && input.activeFundName) {
    return `${first} deploys from ${input.activeFundName}; ${stage} ${sector} is in mandate for ${forRaise}.`;
  }

  if (first) {
    return pick(
      [
        `${first} is the right ${stage} ${sector} partner at ${input.firmName} for ${forRaise}.`,
        `${input.firmName} (${first}) focuses on ${sector} at ${stage} — add to your top tier for ${company}.`,
      ],
      seed,
    );
  }

  return `${input.firmName} — ${stage} ${sector} fund worth targeting for ${forRaise}.`;
}
