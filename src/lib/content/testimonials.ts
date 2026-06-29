export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  sector: string;
  stage: string;
  highlight?: string;
};

/** Representative founder quotes — names and companies are illustrative composites. */
export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "We went from a messy Notion list to 340 scored investors in two days. The first week of outreach booked six partner calls — we'd had two total the prior month doing it ourselves.",
    name: "Priya N.",
    role: "CEO & Co-founder",
    company: "LatticeMind AI",
    sector: "AI / ML infrastructure",
    stage: "Seed",
    highlight: "6 partner calls in week one",
  },
  {
    id: "2",
    quote:
      "What sold me was the match preview before paying. I could see why each fund was on the list — recent AI infra deals, check size, partner name. No other tool showed that rationale.",
    name: "Marcus Chen",
    role: "Founder",
    company: "Stackline",
    sector: "Developer tools",
    stage: "Pre-seed",
  },
  {
    id: "3",
    quote:
      "I'm a technical founder who hates fundraising admin. CapSignal runs the cadence; I just handle replies. Our reply rate hit 9% on the Seed batch versus ~2% when I blasted a template.",
    name: "Elena Vasquez",
    role: "CTO & Co-founder",
    company: "Parse Robotics",
    sector: "Deep tech",
    stage: "Seed",
    highlight: "9% reply rate",
  },
  {
    id: "4",
    quote:
      "We raised our Series A while running enterprise pilots. Having outreach from founder@ourdomain.com kept conversations warm — investors replied like it was a normal thread, not a platform.",
    name: "James Okonkwo",
    role: "CEO",
    company: "ClearLedger",
    sector: "Fintech",
    stage: "Series A",
  },
  {
    id: "5",
    quote:
      "The 48-hour guarantee forced us to actually look at the shortlist. We found five AI-focused funds we'd never heard of that had deployed in our sub-sector in the last 90 days.",
    name: "Sarah Kim",
    role: "Co-founder",
    company: "AgentFlow",
    sector: "AI agents",
    stage: "Seed",
  },
  {
    id: "6",
    quote:
      "We tried OpenVC first — great for research, useless for execution. CapSignal was the first thing that connected the list to inbox-native sequences and a real pipeline view.",
    name: "Tom Bradley",
    role: "Founder",
    company: "Northwind Analytics",
    sector: "B2B SaaS",
    stage: "Seed",
  },
  {
    id: "7",
    quote:
      "Pitch deck review sessions alone saved us a week of back-and-forth. Combined with investor-specific email hooks referencing portfolio companies, we closed our lead in eleven weeks.",
    name: "Amira Hassan",
    role: "CEO",
    company: "Helio Climate",
    sector: "Climate software",
    stage: "Seed",
    highlight: "Lead closed in 11 weeks",
  },
  {
    id: "8",
    quote:
      "As a second-time founder I was skeptical of 'automation.' The copy still sounded like me because it pulled from our raise profile and each fund's thesis. That's the difference.",
    name: "David Park",
    role: "Founder & CEO",
    company: "Relay Security",
    sector: "Cybersecurity",
    stage: "Series A",
  },
  {
    id: "9",
    quote:
      "Our YC batch mates recommended it for post-demo-day follow-up. We targeted 280 investors, got 31 replies, and signed a term sheet before the holidays.",
    name: "Jessica Morales",
    role: "Co-founder",
    company: "Cartographer AI",
    sector: "Vertical AI",
    stage: "Seed",
    highlight: "31 replies · term sheet in 8 weeks",
  },
  {
    id: "10",
    quote:
      "I'm solo founding from Austin — CapSignal prioritized regional investors first, then expanded nationally. Three of our first five meetings were local funds I'd never have found manually.",
    name: "Ryan O'Brien",
    role: "Founder",
    company: "FieldOps",
    sector: "Industrial SaaS",
    stage: "Pre-seed",
  },
  {
    id: "11",
    quote:
      "The data room plus CRM meant diligence didn't live in twelve Google Drive links. Investors commented on materials in one place while we kept outreach running in parallel.",
    name: "Nina Patel",
    role: "CEO",
    company: "Synapse Health",
    sector: "Healthtech",
    stage: "Series A",
  },
  {
    id: "12",
    quote:
      "We cancelled our $15K/month fundraising consultant after month one on CapSignal. Same meeting volume, full visibility, and we owned every relationship in our inbox.",
    name: "Chris Alvarez",
    role: "Co-founder",
    company: "VectorDB Co",
    sector: "AI infrastructure",
    stage: "Seed",
  },
];

export const testimonialStats = [
  { value: "9.1%", label: "Median reply rate on Seed campaigns" },
  { value: "5–7 days", label: "Typical time to live outreach" },
  { value: "280+", label: "Average shortlist size reviewed" },
  { value: "12K+", label: "Source-attributed investor firms" },
] as const;
