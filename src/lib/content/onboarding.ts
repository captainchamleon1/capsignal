import { industryOptions } from "@/lib/content/industries";

export const onboardingMeta = {
  title: "See who matches your raise",
  subtitle: "Tell us what you're trying to solve — we'll score active investors in your space and build your outreach profile.",
  timeEstimate: "~4 min",
  stepsCount: 6,
  /** Steps 2–6 shown in the progress UI (step 1 is a lightweight gate). */
  profileStepsCount: 5,
} as const;

export const fundraisingNeedOptions = [
  {
    value: "find-investors",
    label: "Find the right investors",
    description: "I don't know who's actively deploying in my space",
    pillars: ["matching"],
  },
  {
    value: "active-deployers",
    label: "Reach investors writing checks now",
    description: "I need firms with recent deployment activity, not stale lists",
    pillars: ["matching"],
  },
  {
    value: "warm-intros",
    label: "Map warm intro paths",
    description: "I want portfolio overlap and mutual connections surfaced",
    pillars: ["matching"],
  },
  {
    value: "outreach",
    label: "Automate cold outreach",
    description: "Writing and sending investor emails is eating my time",
    pillars: ["outreach"],
  },
  {
    value: "follow-ups",
    label: "Stop chasing follow-ups",
    description: "Replies slip through and sequences stall without me noticing",
    pillars: ["outreach"],
  },
  {
    value: "pipeline",
    label: "Track my investor pipeline",
    description: "I'm losing conversations across email, notes, and spreadsheets",
    pillars: ["crm"],
  },
  {
    value: "dataroom",
    label: "Share diligence securely",
    description: "I need one place for deck, model, and legal with access controls",
    pillars: ["dataroom"],
  },
  {
    value: "deck",
    label: "Sharpen my pitch deck",
    description: "I want feedback before partners see my story",
    pillars: ["deck"],
  },
  {
    value: "spreadsheet",
    label: "Ditch the investor spreadsheet",
    description: "I'm copy-pasting names into a sheet with no system behind it",
    pillars: ["matching", "crm", "outreach"],
  },
  {
    value: "first-raise",
    label: "Navigate my first institutional round",
    description: "This is my first real raise — I need guidance, not just a database",
    pillars: ["support", "matching"],
  },
] as const;

export type FundraisingNeedValue = (typeof fundraisingNeedOptions)[number]["value"];
export type OfferPillarId = (typeof fundraisingNeedOptions)[number]["pillars"][number];

export function fundraisingNeedLabel(value: string): string {
  return fundraisingNeedOptions.find((o) => o.value === value)?.label ?? value;
}

export function fundraisingNeedLabels(values: string[]): string[] {
  return values.map(fundraisingNeedLabel).filter(Boolean);
}

export function formatFundraisingNeeds(values: string[]): string {
  return fundraisingNeedLabels(values).join(", ");
}

/** Normalize legacy single-string saves and empty state. */
export function normalizeFundraisingNeeds(
  data: { fundraisingNeeds?: string[]; fundraisingNeed?: string } | undefined,
): string[] {
  if (!data) return [];
  if (Array.isArray(data.fundraisingNeeds) && data.fundraisingNeeds.length > 0) {
    return data.fundraisingNeeds;
  }
  if (data.fundraisingNeed?.trim()) return [data.fundraisingNeed.trim()];
  return [];
}

export function resolvePillarsForNeeds(needs: string[]): Set<OfferPillarId> {
  const ids = new Set<OfferPillarId>();
  for (const need of needs) {
    const option = fundraisingNeedOptions.find((o) => o.value === need);
    option?.pillars.forEach((pillar) => ids.add(pillar));
  }
  return ids;
}

export const onboardingSteps = [
  {
    id: 1,
    key: "you",
    label: "Get started",
    title: "What's the hardest part of your raise right now?",
    subtitle:
      "Select all that apply — we'll tailor your matches, outreach, and plan to what you picked.",
    why: "",
    eta: "",
    isGate: true,
  },
  {
    id: 2,
    key: "company",
    label: "Company",
    title: "Tell us about your company",
    subtitle:
      "Industry and city help us surface investors who deploy in your space — starting with firms active in your area.",
    why: "Founders who lead with local warm paths close faster. We prioritize investors near you, then expand nationally.",
    eta: "45 sec",
  },
  {
    id: 3,
    key: "business",
    label: "Business",
    title: "Describe what you're building",
    subtitle:
      "Pick your customer segment now — add a business description if you want sharper thesis matching and outreach copy.",
    why: "Generic blasts get ignored. Specific thesis hooks get replies.",
    eta: "1 min",
  },
  {
    id: 4,
    key: "track-record",
    label: "Track record",
    title: "Your funding history",
    subtitle: "Prior raises and exits help us calibrate investor tier and warm-intro paths.",
    why: "A repeat founder raising a Seed round gets a different match set than a first-time pre-seed team.",
    eta: "45 sec",
  },
  {
    id: 5,
    key: "raise",
    label: "This round",
    title: "Details on your current raise",
    subtitle: "Check size, traction, and timeline determine urgency and sequence strategy.",
    why: "Investors deploying $500K checks at Seed are not the same list as those writing $5M Series A checks.",
    eta: "1 min",
  },
  {
    id: 6,
    key: "review",
    label: "Review",
    title: "Review your raise profile",
    subtitle: "Confirm everything looks right — then we'll score investors against your full profile.",
    why: "A complete profile produces sharper match scores and better outreach from day one.",
    eta: "30 sec",
  },
] as const;

export const sectorOptions = industryOptions.map((i) => ({
  value: i.value,
  description: i.description,
}));

export const segmentOptions = [
  { value: "Enterprise", description: "Fortune 500 / large org sales cycles" },
  { value: "SMB / Mid-market", description: "Teams of 10–500 employees" },
  { value: "Consumer", description: "B2C product or mobile app" },
  { value: "Marketplace", description: "Two-sided network or platform" },
  { value: "Infrastructure", description: "APIs, dev tools, data layer" },
  { value: "Developer tools", description: "Built for engineers and technical buyers" },
] as const;

export const roleOptions = [
  "Founder & CEO",
  "Co-founder",
  "CEO (non-founder)",
  "Other executive",
] as const;

export const scoringPhases = [
  "Scanning 12,000+ source-attributed investor records…",
  "Prioritizing investors active in your metro…",
  "Filtering by stage, check size, and sector fit…",
  "Matching thesis signals and recent deployment activity…",
  "Ranking your top matches by fit score…",
] as const;

/** City-aware copy for the match scan loader. */
export function buildScoringPhases(city?: string): string[] {
  const metro = city?.trim() || "your metro";
  return [
    `Scanning 12,000+ source-attributed investor records…`,
    `Mapping ${metro} and regional investor activity…`,
    `Filtering by stage, check size, and sector fit…`,
    `Matching thesis signals and recent deployment data…`,
    `Ranking your top matches by fit score…`,
  ];
}

/** Minimum time the scan loader runs so the scoring step feels substantive. */
export const MATCH_SCAN_MIN_MS = 7000;

export const unlockMilestones = [
  { step: 1, label: "Your goal" },
  { step: 2, label: "Company context" },
  { step: 3, label: "Thesis matching" },
  { step: 4, label: "Investor tier calibration" },
  { step: 5, label: "Round strategy" },
  { step: 6, label: "AI match preview" },
] as const;

export const planNextSteps = [
  {
    step: "01",
    title: "Start your free trial & create account",
    body: "7 days free, then $99.99/mo. Instant access to verified contacts, CRM, and data room.",
  },
  {
    step: "02",
    title: "Approve your matches",
    body: "Review AI-ranked investors with scores and rationale. Exclude anyone before launch.",
  },
  {
    step: "03",
    title: "Launch outreach",
    body: "Thesis-aware sequences from your domain — go live same business day.",
  },
] as const;

export const businessDescriptionExample =
  "We sell workflow automation to mid-market finance teams. $120K ACV, 14 paying customers, 40% QoQ growth. Replacing manual Excel processes incumbents charge six figures to implement.";
