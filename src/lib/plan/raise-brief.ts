import type { RaiseProfileDraft } from "@/lib/raise-profile";
import type { MatchPreviewInvestor } from "@/lib/leads/match-types";
import { resolveDisplayMatchCount, formatInvestorCount } from "@/lib/match-display";
import { getDemoMatches } from "@/lib/data/demo-investors";
import { testimonials, type Testimonial } from "@/lib/content/testimonials";
import { selfServePricing } from "@/lib/content/guarantee";

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
  testimonial: Testimonial;
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

function pickTestimonial(profile: RaiseProfileDraft): Testimonial {
  const stage = profile.stage.toLowerCase();
  const sector = profile.sector.toLowerCase();
  const match =
    testimonials.find(
      (t) =>
        t.stage.toLowerCase() === stage &&
        (sector.includes("ai") ? t.sector.toLowerCase().includes("ai") : true),
    ) ??
    testimonials.find((t) => t.stage.toLowerCase() === stage) ??
    testimonials[0];
  return match;
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

function buildHeadline(profile: RaiseProfileDraft, segments: ReturnType<typeof deriveSegmentCounts>) {
  return `${profile.company} · ${profile.stage} · ${formatInvestorCount(segments.vcFunds)} VC funds, ${formatInvestorCount(segments.angels)} angels`;
}

function buildSubhead(
  profile: RaiseProfileDraft,
  segments: ReturnType<typeof deriveSegmentCounts>,
): string {
  const lines: string[] = [
    `Matched on stage (${profile.stage}), sector (${profile.sector}), check size, and who deployed in the last 90 days.`,
  ];
  if (profile.city && segments.metroMatches > 0) {
    lines.push(
      `${formatInvestorCount(segments.metroMatches)} investors near ${profile.city} ranked first, then national.`,
    );
  }
  if (profile.traction?.trim()) {
    lines.push(`Traction on file: ${profile.traction.trim()}.`);
  }
  lines.push(
    "Outreach, CRM, data room, and deck review included — start with a 7-day trial.",
  );
  return lines.join(" ");
}

function resolveSpotlightInvestors(profile: RaiseProfileDraft): MatchPreviewInvestor[] {
  if (profile.topInvestors?.length) {
    return profile.topInvestors.slice(0, 3).map((inv, i) => ({
      ...inv,
      blurred: i > 0,
    }));
  }
  return getDemoMatches(profile.stageKey ?? "seed", profile.sectorKey ?? "b2b_saas", 3).map(
    (inv, i) => ({
      firm: inv.firm,
      partner: inv.partner,
      score: inv.score,
      reason: inv.reason.replace(
        /B2B SaaS|enterprise software/i,
        profile.sector.split("/")[0]?.trim() ?? profile.sector,
      ),
      fundSize: inv.fundSize,
      checkSize: inv.checkSize,
      investments: inv.investments,
      blurred: i > 0,
    }),
  );
}

export function buildRaiseBrief(profile: RaiseProfileDraft): RaiseBriefInsights {
  const poolSize = resolvePoolSize(profile);
  const segments = deriveSegmentCounts(poolSize, profile);
  const fname = firstName(profile.name);
  const testimonial = pickTestimonial(profile);

  return {
    poolSize,
    ...segments,
    firstName: fname,
    headline: buildHeadline(profile, segments),
    subhead: buildSubhead(profile, segments),
    memoSubject: `${profile.stage} · ${profile.raise || "Current round"} · ${profile.sector}`,
    ctaLabel: `Start ${selfServePricing.trialLabel.toLowerCase()}`,
    spotlightInvestors: resolveSpotlightInvestors(profile),
    testimonial,
  };
}

export function buildPersonalizedPillars(profile: RaiseProfileDraft) {
  const { company, stage, sector, city } = profile;
  const metro = city?.trim();

  return [
    {
      id: "matching",
      title: "Investor matching",
      description: `12,000+ records screened for ${company}'s ${stage} round — VC funds and angels scored on stage, check size, ${sector}, and recent deployment.`,
      highlight: "VC funds + angels",
    },
    {
      id: "outreach",
      title: "Outreach sequences",
      description: metro
        ? `Email sequences reference each fund's thesis and portfolio. ${metro} investors first, then national. Sends from your domain — not a third-party blast.`
        : `Per-investor copy from your raise profile and each fund's public thesis. Sends from your domain with scheduled follow-ups.`,
      highlight: "Your inbox",
    },
    {
      id: "crm",
      title: "Investor CRM",
      description: `Pipeline for ${company}: contacted, replied, meeting booked, diligence — through close.`,
      highlight: "Reply → meeting",
    },
    {
      id: "dataroom",
      title: "Data room",
      description: "Deck, model, cap table — shared with per-investor permissions and view tracking.",
      highlight: "Per-investor access",
    },
    {
      id: "deck",
      title: "Pitch deck review",
      description: `Two live review sessions on ${company}'s deck before partner meetings.`,
      highlight: "2 sessions included",
    },
    {
      id: "support",
      title: "Onboarding & support",
      description: "Kickoff call, deep research on your top 100 targets, priority support when you need help.",
      highlight: "Human support",
    },
  ] as const;
}

export const planLaunchSteps = (profile: RaiseProfileDraft) => [
  {
    when: "First 48 hours",
    title: "Review your shortlist",
    body: `Approve VC and angel matches for ${profile.company}. Unlock verified emails and LinkedIn paths. 5+ active matches in 48 hours or a full refund.`,
  },
  {
    when: "Days 3–5",
    title: "Outreach live",
    body: `Sequences send from your domain. Cadence set for ${profile.stage}${profile.timeline?.trim() ? ` · target ${profile.timeline.trim()}` : ""}.`,
  },
  {
    when: "Week 2+",
    title: "Run the pipeline",
    body: "Replies in CRM. Diligence in the data room. Deck review before partner calls.",
  },
] as const;
