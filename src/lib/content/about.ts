export const team = [
  {
    name: "Alex Rivera",
    role: "Co-founder & CEO",
    bio: "Previously built data products at two venture-backed startups. Led fundraising ops for 30+ Seed and Series A raises.",
  },
  {
    name: "Jordan Kim",
    role: "Co-founder & CTO",
    bio: "Engineering lead at a growth-stage fintech. Built the signal ingestion and scoring pipeline.",
  },
  {
    name: "Morgan Tate",
    role: "Head of Customer Success",
    bio: "Former VC associate. Runs onboarding, shortlist review, and weekly campaign reporting.",
  },
] as const;

export const principles = [
  {
    title: "Founders own the relationship",
    body: "Every email sends from your domain. Every reply lands in your inbox. We provide infrastructure—you provide the conversations.",
  },
  {
    title: "Signals over static lists",
    body: "Investor databases go stale in weeks. We score on deployment activity refreshed daily, not firmographics from last year.",
  },
  {
    title: "Transparency by default",
    body: "Match scores include rationale. Weekly reports show what's converting. No black-box targeting.",
  },
] as const;

export const milestones = [
  { year: "2024", event: "CapSignal founded; first 20 campaigns launched" },
  { year: "2025", event: "Public investor datasets integrated; SEC IAPD nightly ingest" },
  { year: "2026", event: "Partner program launched; Full Service tier added" },
] as const;
