export const founderBenefits = [
  {
    title: "Match quality",
    body: "Every investor on your list scored against live deployment activity in your sector—not a generic VC database export.",
  },
  {
    title: "Your inbox, your relationships",
    body: "Outreach sends from your domain. Replies land in your inbox. CapSignal handles sequencing; you handle the conversations.",
  },
  {
    title: "Structured execution",
    body: "Fixed cadence, approved messaging, weekly reporting. Fundraising runs on a system instead of founder memory.",
  },
  {
    title: "Hands-on support",
    body: "Onboarding call, match review, and message approval before launch. Scale and Full Service tiers add strategic support.",
  },
] as const;

export const founderStages = [
  { stage: "Pre-seed", check: "$250K–$1.5M", timeline: "4–6 weeks typical" },
  { stage: "Seed", check: "$1.5M–$5M", timeline: "6–10 weeks typical" },
  { stage: "Series A", check: "$5M–$15M", timeline: "8–14 weeks typical" },
  { stage: "Series B", check: "$15M–$40M", timeline: "10–16 weeks typical" },
] as const;

export const founderSectors = [
  "B2B SaaS",
  "Fintech",
  "Healthtech",
  "Climate & energy",
  "Deep tech",
  "Consumer",
  "AI / ML infrastructure",
] as const;

export const founderTimeline = [
  { day: "Day 1–2", event: "Raise profile submitted, kickoff call scheduled" },
  { day: "Same business day", event: "Domain configured, sequences approved, campaign live" },
  { day: "Week 2+", event: "Weekly reports, targeting adjustments, meeting tracking" },
] as const;
