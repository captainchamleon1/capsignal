export const pricingTiers = [
  {
    name: "Launch",
    price: "$49.99",
    period: "per month",
    description: "Structured outreach with AI-powered targeting and onboarding support.",
    features: [
      "Up to 500 investor targets",
      "Personalized email sequences",
      "Automated follow-up cadence",
      "Campaign dashboard",
      "Onboarding call",
    ],
    featured: false,
  },
  {
    name: "Scale",
    price: "$99.99",
    period: "per month",
    description: "Strategic positioning plus hands-on execution for competitive rounds.",
    features: [
      "Everything in Launch",
      "Top-100 investor deep research",
      "LinkedIn outreach sequences",
      "Pitch deck review (2 sessions)",
      "Data room structure guidance",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Full service",
    price: "$299.99",
    period: "per month",
    description: "Dedicated partner for end-to-end raise management and IR.",
    features: [
      "Everything in Scale",
      "Investor roadshow scheduling",
      "Due diligence preparation",
      "Weekly strategy calls",
      "Post-close IR management",
    ],
    featured: false,
  },
] as const;

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
    q: "How long until launch?",
    a: "Most campaigns go live within 5–7 business days after profile submission and shortlist approval.",
  },
  {
    q: "Is there a success fee?",
    a: "No. Pricing is a flat monthly subscription. We do not take carry or percentage of capital raised.",
  },
  {
    q: "Can I upgrade tiers mid-campaign?",
    a: "Yes. Pay the prorated difference and we extend scope—common when moving from Launch to Scale for LinkedIn outreach.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Credit card and ACH, billed monthly. Cancel anytime from your account settings.",
  },
] as const;

export const pricingComparison = [
  { feature: "Investor targets", launch: "500", scale: "500+", full: "Unlimited" },
  { feature: "Email sequences", launch: true, scale: true, full: true },
  { feature: "LinkedIn outreach", launch: false, scale: true, full: true },
  { feature: "Pitch deck review", launch: false, scale: "2 sessions", full: "Ongoing" },
  { feature: "Strategy calls", launch: "Onboarding", scale: "As needed", full: "Weekly" },
  { feature: "Roadshow scheduling", launch: false, scale: false, full: true },
] as const;
