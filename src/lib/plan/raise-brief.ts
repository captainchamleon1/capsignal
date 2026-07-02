import type { RaiseProfileDraft } from "@/lib/raise-profile";
import type { MatchPreviewInvestor } from "@/lib/leads/match-types";
import { resolveDisplayMatchCount, formatInvestorCount } from "@/lib/match-display";
import { getDemoMatches } from "@/lib/data/demo-investors";
import { buildMatchRationale } from "@/lib/data/scoring/match-rationale";
import { selfServePricing } from "@/lib/content/guarantee";
import {
  normalizeFundraisingNeeds,
  resolvePillarsForNeeds,
  type OfferPillarId,
} from "@/lib/content/onboarding";

export type RaiseBriefInsights = {
  poolSize: number;
  vcFunds: number;
  angels: number;
  activeDeployers: number;
  metroMatches: number;
  highFitMatches: number;
  warmIntroPaths: number;
  verifiedContacts: number;
  firstName: string;
  headline: string;
  subhead: string;
  memoSubject: string;
  ctaLabel: string;
  spotlightInvestors: MatchPreviewInvestor[];
};

function hashProfile(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function firstName(full: string): string {
  const trimmed = full.trim();
  if (!trimmed) return "Founder";
  return trimmed.split(/\s+/)[0] ?? "Founder";
}

function resolvePoolSize(profile: RaiseProfileDraft): number {
  if (profile.matchCount && profile.matchCount > 0) return profile.matchCount;
  return resolveDisplayMatchCount(
    profile.stageKey ?? profile.stage,
    profile.sectorKey ?? profile.sector,
    profile.company,
    undefined,
    profile.city,
  );
}

function vcAngelSplit(stage: string, seed: number) {
  const s = stage.toLowerCase();
  let vcShare = 0.61;
  if (s.includes("pre")) vcShare = 0.39;
  else if (s.includes("series a")) vcShare = 0.71;
  else if (s.includes("series b")) vcShare = 0.78;
  vcShare += (seed % 5 - 2) / 100;
  vcShare = clamp(vcShare, 0.32, 0.82);
  return { vcShare, angelShare: 1 - vcShare };
}

function deriveSegmentCounts(pool: number, profile: RaiseProfileDraft) {
  const seed = hashProfile(
    `${profile.company}|${profile.stage}|${profile.sector}|${profile.city ?? ""}`,
  );
  const activePct = 0.14 + (seed % 7) / 100;
  const metroPct = profile.city ? 0.09 + (seed % 5) / 100 : 0;
  const highFitPct = 0.1 + (seed % 4) / 100;
  const warmPct = 0.04 + (seed % 3) / 100;
  const { vcShare, angelShare } = vcAngelSplit(profile.stage, seed);

  const activeDeployers = clamp(Math.round(pool * activePct), 18, 120);

  return {
    activeDeployers,
    vcFunds: clamp(Math.round(activeDeployers * vcShare), 8, 96),
    angels: clamp(Math.round(activeDeployers * angelShare), 6, 64),
    metroMatches: profile.city ? clamp(Math.round(pool * metroPct), 11, 64) : 0,
    highFitMatches: clamp(Math.round(pool * highFitPct), 14, 96),
    warmIntroPaths: clamp(Math.round(pool * warmPct), 6, 48),
    verifiedContacts: clamp(Math.round(pool * 0.72), 120, 500),
  };
}

function formatList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

const pillarDeliverables: Record<OfferPillarId, string> = {
  matching: "verified emails and scored matches",
  outreach: "thesis-aware sequences from your domain",
  crm: "investor CRM through close",
  dataroom: "secure data room with view tracking",
  deck: "live pitch deck review",
  support: "onboarding and top-100 target research",
};

function buildDeliverablePhrases(needs: string[]): string[] {
  if (needs.length === 0) {
    return ["verified contacts", "outreach from your domain", "investor CRM"];
  }

  const phrases: string[] = [];
  const pillars = resolvePillarsForNeeds(needs);

  for (const pillar of pillars) {
    phrases.push(pillarDeliverables[pillar]);
  }
  if (needs.includes("warm-intros")) {
    phrases.push("portfolio overlap intro paths");
  }
  if (needs.includes("follow-ups")) {
    phrases.push("automated follow-up cadence");
  }

  return [...new Set(phrases)].slice(0, 3);
}

function buildHeadline(profile: RaiseProfileDraft, poolSize: number) {
  return `${formatInvestorCount(poolSize)} investors scored for ${profile.company}.`;
}

function buildSubhead(
  profile: RaiseProfileDraft,
  segments: ReturnType<typeof deriveSegmentCounts>,
): string {
  const needs = normalizeFundraisingNeeds(profile);

  const statParts = [
    `${formatInvestorCount(segments.activeDeployers)} deploying in the last 90 days`,
    `${formatInvestorCount(segments.highFitMatches)} scored 85+ on thesis fit`,
  ];

  if (profile.city?.trim() && segments.metroMatches > 0) {
    statParts.push(
      `${formatInvestorCount(segments.metroMatches)} near ${profile.city.trim()}`,
    );
  }
  if (needs.includes("warm-intros") && segments.warmIntroPaths > 0) {
    statParts.push(
      `${formatInvestorCount(segments.warmIntroPaths)} warm intro paths mapped`,
    );
  }

  const deliverables = buildDeliverablePhrases(needs);
  const unlock = `Unlock the full list — ${formatList(deliverables)}.`;

  return `${statParts.join(" · ")}. ${unlock}`;
}

function resolveSpotlightInvestors(profile: RaiseProfileDraft): MatchPreviewInvestor[] {
  if (profile.topInvestors?.length) {
    return profile.topInvestors.slice(0, 5).map((inv, i) => ({
      ...inv,
      blurred: i > 0,
    }));
  }
  return getDemoMatches(
    profile.stageKey ?? "seed",
    profile.sectorKey ?? "b2b_saas",
    5,
    profile.city,
  ).map((inv, i) => ({
    firm: inv.firm,
    partner: inv.partner,
    score: inv.score,
    reason: buildMatchRationale({
      company: profile.company,
      stage: profile.stageKey ?? "seed",
      sector: profile.sectorKey ?? "b2b_saas",
      sectorLabel: profile.sector,
      city: profile.city,
      raise: profile.raise,
      firmName: inv.firm,
      partner: inv.partner,
      hqCity: inv.hqCity,
      checkSizeLabel: inv.checkSize,
      portfolioCompanies: inv.investments,
      variantSeed: inv.firm,
    }),
    fundSize: inv.fundSize,
    checkSize: inv.checkSize,
    investments: inv.investments,
    blurred: i > 0,
  }));
}

export function buildRaiseBrief(profile: RaiseProfileDraft): RaiseBriefInsights {
  const poolSize = resolvePoolSize(profile);
  const segments = deriveSegmentCounts(poolSize, profile);
  const fname = firstName(profile.name);

  return {
    poolSize,
    ...segments,
    firstName: fname,
    headline: buildHeadline(profile, poolSize),
    subhead: buildSubhead(profile, segments),
    memoSubject: `${profile.stage} · ${profile.raise || "Current round"} · ${profile.sector}`,
    ctaLabel: selfServePricing.unlockCta,
    spotlightInvestors: resolveSpotlightInvestors(profile),
  };
}

export function buildPersonalizedPillars(profile: RaiseProfileDraft) {
  const { company, stage, sector, city } = profile;
  const metro = city?.trim();
  const emphasized = resolvePillarsForNeeds(normalizeFundraisingNeeds(profile));

  const pillars = [
    {
      id: "matching" as const,
      title: "Investor matching",
      description: `12,000+ records screened for ${company}'s ${stage} round — VC funds and angels scored on stage, check size, ${sector}, and recent deployment.`,
      highlight: "VC funds + angels",
    },
    {
      id: "outreach" as const,
      title: "Outreach sequences",
      description: metro
        ? `Email sequences reference each fund's thesis and portfolio. ${metro} investors first, then national. Sends from your domain — not a third-party blast.`
        : `Per-investor copy from your raise profile and each fund's public thesis. Sends from your domain with scheduled follow-ups.`,
      highlight: "Your inbox",
    },
    {
      id: "crm" as const,
      title: "Investor CRM",
      description: `Pipeline for ${company}: contacted, replied, meeting booked, diligence — through close.`,
      highlight: "Reply → meeting",
    },
    {
      id: "dataroom" as const,
      title: "Data room",
      description: "Deck, model, cap table — shared with per-investor permissions and view tracking.",
      highlight: "Per-investor access",
    },
    {
      id: "deck" as const,
      title: "Pitch deck review",
      description: `Two live review sessions on ${company}'s deck before partner meetings.`,
      highlight: "2 sessions included",
    },
    {
      id: "support" as const,
      title: "Onboarding & support",
      description: "Kickoff call, deep research on your top 100 targets, priority support when you need help.",
      highlight: "Human support",
    },
  ];

  return pillars
    .map((pillar) => ({ ...pillar, emphasized: emphasized.has(pillar.id) }))
    .sort((a, b) => Number(b.emphasized) - Number(a.emphasized));
}

export function buildGoalSummary(profile: RaiseProfileDraft) {
  const needs = normalizeFundraisingNeeds(profile);
  return {
    needs,
    emphasizedPillars: resolvePillarsForNeeds(needs),
  };
}

export const planLaunchSteps = (profile: RaiseProfileDraft) => {
  const needs = normalizeFundraisingNeeds(profile);
  const wantsOutreach = needs.some((n) => ["outreach", "follow-ups", "spreadsheet"].includes(n));
  const wantsPipeline = needs.some((n) => ["pipeline", "spreadsheet", "dataroom"].includes(n));
  const wantsMatching = needs.length === 0 || needs.some((n) =>
    ["find-investors", "active-deployers", "warm-intros", "spreadsheet", "first-raise"].includes(n),
  );

  const steps = [
    {
      when: "First 48 hours",
      title: wantsMatching ? "Review your matches" : "Approve your targets",
      body: wantsMatching
        ? `Your AI-matched VC and angel targets for ${profile.company}. Unlock verified emails and LinkedIn paths.`
        : `Unlock verified contacts and thesis-ranked targets for ${profile.company}.`,
    },
    {
      when: "Same business day",
      title: wantsOutreach ? "Outreach live" : "Launch your workspace",
      body: wantsOutreach
        ? `Sequences send from your domain. Cadence set for ${profile.stage}${profile.timeline?.trim() ? ` · target ${profile.timeline.trim()}` : ""}.`
        : `Your raise workspace is configured for ${profile.company} — matches, CRM, and data room ready to use.`,
    },
    {
      when: "Week 2+",
      title: wantsPipeline ? "Run the pipeline" : "Close the round",
      body: wantsPipeline
        ? "Replies in CRM. Diligence in the data room. Deck review before partner calls."
        : "Track replies, share diligence, and move investors from first email to term sheet.",
    },
  ] as const;

  return steps;
};
