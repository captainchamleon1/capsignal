import { industryOptions } from "@/lib/content/industries";

export const onboardingMeta = {
  title: "Build your raise profile",
  subtitle: "Investor matching, outreach, and CRM — personalized to your company.",
  timeEstimate: "~4 min",
  stepsCount: 6,
} as const;

export const onboardingSteps = [
  {
    id: 1,
    key: "you",
    label: "About you",
    title: "Let's start with you",
    subtitle: "We use this to set up your account and keep your shortlist private.",
    why: "Investors respond better when outreach comes from a real founder — not a generic alias.",
    eta: "30 sec",
  },
  {
    id: 2,
    key: "company",
    label: "Company",
    title: "Tell us about your company",
    subtitle: "Industry and positioning help us filter 12,000+ firms down to who actually deploys in your space.",
    why: "Stage and sector are the strongest predictors of investor fit in our scoring model.",
    eta: "45 sec",
  },
  {
    id: 3,
    key: "business",
    label: "Business",
    title: "Describe what you're building",
    subtitle: "This is the most important step — it powers thesis matching and personalized outreach copy.",
    why: "Generic blasts get ignored. Specific thesis hooks get replies.",
    eta: "1 min",
  },
  {
    id: 4,
    key: "track-record",
    label: "Track record",
    title: "Your funding history",
    subtitle: "Prior raises and exits help us calibrate investor tier and warm-intro paths.",
    why: "A repeat founder raising a Seed round gets a different shortlist than a first-time pre-seed team.",
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
  "Parsing your raise profile…",
  "Filtering by stage and check size…",
  "Matching sector and thesis signals…",
  "Ranking 12,000+ investor records…",
  "Building your shortlist…",
] as const;

export const unlockMilestones = [
  { step: 1, label: "Account identity" },
  { step: 2, label: "Company context" },
  { step: 3, label: "Thesis matching" },
  { step: 4, label: "Investor tier calibration" },
  { step: 5, label: "Round strategy" },
  { step: 6, label: "Investor shortlist preview" },
] as const;

export const planNextSteps = [
  {
    step: "01",
    title: "Subscribe & create account",
    body: "Instant access to verified contacts, CRM, and data room.",
  },
  {
    step: "02",
    title: "Approve your shortlist",
    body: "Review ranked investors with scores and rationale. Exclude anyone before launch.",
  },
  {
    step: "03",
    title: "Launch outreach",
    body: "Thesis-aware sequences from your domain — live in 5–7 business days.",
  },
] as const;

export const businessDescriptionExample =
  "We sell workflow automation to mid-market finance teams. $120K ACV, 14 paying customers, 40% QoQ growth. Replacing manual Excel processes incumbents charge six figures to implement.";
