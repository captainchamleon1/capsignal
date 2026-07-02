export const capsignalPlan = {
  name: "CapSignal",
  price: "$99.99",
  period: "per month",
  description:
    "AI investor matching, verified contacts, outreach sequences, CRM, data room, and pitch deck tools — 7-day free trial.",
  features: [
    "12,000+ investor firms · AI match scoring",
    "Verified emails & LinkedIn paths · up to 500 targets",
    "AI outreach sequences from your domain",
    "Investor CRM & pipeline through close",
    "Secure data room with view tracking",
    "Pitch deck studio + 2 expert review sessions",
    "LinkedIn outreach sequences",
    "Top-100 investor deep research",
    "Data room structure guidance",
    "Automated follow-up cadence",
    "Campaign dashboard",
    "Onboarding call",
    "Priority support",
  ],
} as const;

/** Single self-serve plan — kept as array for shared pricing UI components. */
export const pricingTiers = [{ ...capsignalPlan, featured: true }] as const;

export const pricingFaqs = [
  {
    q: "Where do emails send from?",
    a: "Your domain. We configure SPF/DKIM and connect to your inbox. Replies land with you, not a third party.",
  },
  {
    q: "What stages do you support?",
    a: "Pre-seed through Series B in software, fintech, healthtech, climate, and deep tech.",
  },
  {
    q: "How long until outreach goes live?",
    a: "Most founders go live the same business day after subscribing and approving their matches.",
  },
  {
    q: "Is there a success fee?",
    a: "No. Pricing is a flat monthly subscription. We do not take carry or percentage of capital raised.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — start with a 7-day free trial at checkout. Your card is saved but you won't be charged until the trial ends. Cancel anytime before then.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Credit card and ACH, billed monthly. Cancel anytime from your account settings.",
  },
] as const;

export const pricingComparison = [
  { feature: "Investor targets", capsignal: "500+" },
  { feature: "Investor CRM", capsignal: true },
  { feature: "Data room", capsignal: true },
  { feature: "Email sequences", capsignal: true },
  { feature: "LinkedIn outreach", capsignal: true },
  { feature: "Pitch deck review", capsignal: "2 sessions" },
  { feature: "Deep investor research", capsignal: "Top 100" },
  { feature: "Support", capsignal: "Priority" },
] as const;
