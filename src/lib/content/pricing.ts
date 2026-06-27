export const capsignalPlan = {
  name: "CapSignal",
  price: "$99.99",
  period: "per month",
  description:
    "Unlock verified investor contacts plus thesis-aware outreach, deep research, and hands-on raise support.",
  features: [
    "Verified investor emails & LinkedIn paths",
    "Full ranked shortlist from your profile",
    "Up to 500 investor targets",
    "Investor CRM & pipeline tracking",
    "Secure data room",
    "Personalized email sequences",
    "LinkedIn outreach sequences",
    "Top-100 investor deep research",
    "Pitch deck review (2 sessions)",
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
    a: "Most campaigns go live within 5–7 business days after profile submission and shortlist approval.",
  },
  {
    q: "Is there a success fee?",
    a: "No. Pricing is a flat monthly subscription. We do not take carry or percentage of capital raised.",
  },
  {
    q: "What is the 48-hour guarantee?",
    a: "If you don't find at least 5 active, highly matched investors for your exact startup stage within your first 48 hours, email hello@getcapsignal.com and we'll refund your subscription instantly. No questions asked.",
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
