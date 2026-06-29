import type { CaseStudy } from "./customers";

/** Representative outcomes — illustrative composites for marketing; not individual verified clients. */
export const additionalCaseStudies: CaseStudy[] = [
  {
    slug: "latticemind-ai-seed",
    company: "LatticeMind AI",
    founder: "Priya N.",
    role: "CEO & Co-founder",
    stage: "Seed",
    sector: "AI infrastructure",
    raiseAmount: "$3.2M",
    headline: "340 scored investors, 6 partner calls in week one",
    summary:
      "Pre-seed infra startup replaced a Notion investor list with CapSignal matching and inbox-native sequences.",
    challenge:
      "First-time founders had warm intros to three funds but needed 200+ additional targets for a competitive Seed process.",
    approach:
      "Raise profile emphasized inference optimization and design partners. Shortlist weighted funds with ML infra follow-ons in the last two quarters.",
    results: [
      { label: "Investors contacted", value: "312" },
      { label: "Reply rate", value: "9.4%" },
      { label: "Partner meetings", value: "18" },
      { label: "Time to term sheet", value: "10 weeks" },
    ],
    quote:
      "The match rationale saved us — we stopped wasting time on funds that hadn't done infra in two years.",
    timeline: "Week 1: shortlist · Week 2: live outreach · Week 10: signed",
  },
  {
    slug: "agentflow-seed",
    company: "AgentFlow",
    founder: "Sarah Kim",
    role: "Co-founder",
    stage: "Seed",
    sector: "AI agents",
    raiseAmount: "$2.8M",
    headline: "Five new AI funds found via deployment signals",
    summary:
      "Vertical AI agents company used CapSignal to find funds actively deploying in workflow automation.",
    challenge:
      "Generic 'AI investor' lists included funds that only invest in foundation models, not agents.",
    approach:
      "Segmented shortlist by portfolio overlap with automation and enterprise SaaS. Thesis hooks referenced specific portfolio companies.",
    results: [
      { label: "New funds discovered", value: "5" },
      { label: "Reply rate", value: "8.1%" },
      { label: "Lead investor", value: "Seed-focused VC" },
      { label: "Round close", value: "11 weeks" },
    ],
    quote: "The 48-hour guarantee forced us to actually read the shortlist — that's when we found our lead.",
    timeline: "Match preview → trial → outreach live day 6",
  },
  {
    slug: "clearledger-series-a",
    company: "ClearLedger",
    founder: "James Okonkwo",
    role: "CEO",
    stage: "Series A",
    sector: "Fintech",
    raiseAmount: "$8M",
    headline: "Series A outreach from founder@ domain",
    summary:
      "Payments infrastructure company ran parallel diligence tracks while CapSignal managed top-of-funnel outreach.",
    challenge:
      "Prior round used a consultant's email domain — investors didn't recognize follow-up threads on the A.",
    approach:
      "All sequences from founder domain. CRM tracked 40 active diligences while new batch targeted growth-stage fintech.",
    results: [
      { label: "Reply rate", value: "7.2%" },
      { label: "Meetings booked", value: "24" },
      { label: "Lead + syndicate", value: "Closed" },
      { label: "Consultant cost avoided", value: "$18K/mo" },
    ],
    quote: "Investors replied like it was a normal thread because it was — from my inbox, not a platform alias.",
    timeline: "14-week process · CapSignal from week 1",
  },
  {
    slug: "cartographer-ai-seed",
    company: "Cartographer AI",
    founder: "Jessica Morales",
    role: "Co-founder",
    stage: "Seed",
    sector: "Vertical AI",
    raiseAmount: "$4.1M",
    headline: "31 replies post-demo-day follow-up",
    summary:
      "YC company used CapSignal for batch follow-up after demo day plus cold outreach to thesis-fit funds.",
    challenge:
      "200+ demo day cards with no system to prioritize or personalize follow-up at scale.",
    approach:
      "Hot leads personal note; warm segment on accelerated cadence; cold AI vertical funds on standard sequence.",
    results: [
      { label: "Post-DD replies", value: "31" },
      { label: "Investors targeted", value: "285" },
      { label: "Term sheet", value: "Week 8" },
    ],
    quote: "Our batch mates asked what we used — the match preview before checkout sold us immediately.",
    timeline: "Demo day + 8 weeks to close",
  },
  {
    slug: "northwind-analytics-seed",
    company: "Northwind Analytics",
    founder: "Tom Bradley",
    role: "Founder",
    stage: "Seed",
    sector: "B2B SaaS",
    raiseAmount: "$2.4M",
    headline: "From OpenVC research to executed outreach",
    summary:
      "Analytics startup used OpenVC for research and CapSignal for scoring, sequences, and pipeline.",
    challenge:
      "Exported CSV from a directory but no way to personalize or track 260 contacts.",
    approach:
      "Imported sector filters into CapSignal raise profile. Approved shortlist in dashboard before launch.",
    results: [
      { label: "Shortlist size", value: "260" },
      { label: "Reply rate", value: "6.8%" },
      { label: "Meetings", value: "14" },
    ],
    quote: "OpenVC told us who exists. CapSignal told us who to email this month and handled the cadence.",
    timeline: "5 days to live outreach",
  },
  {
    slug: "helio-climate-seed",
    company: "Helio Climate",
    founder: "Amira Hassan",
    role: "CEO",
    stage: "Seed",
    sector: "Climate software",
    raiseAmount: "$3.5M",
    headline: "Lead closed in 11 weeks with deck review support",
    summary:
      "Climate software company combined investor matching with pitch deck review sessions before launch.",
    challenge:
      "Investors passed on 'climate' label without seeing software metrics and enterprise traction.",
    approach:
      "Shortlist verified deployment via recorded investments. Messaging led with software ACV, carbon as context.",
    results: [
      { label: "Verified climate deployers", value: "89 on shortlist" },
      { label: "Reply rate", value: "8.5%" },
      { label: "Lead closed", value: "11 weeks" },
    ],
    quote: "Deck review plus investor-specific hooks — we sounded prepared on every first call.",
    timeline: "Deck review → outreach → close",
  },
  {
    slug: "vectordb-co-seed",
    company: "VectorDB Co",
    founder: "Chris Alvarez",
    role: "Co-founder",
    stage: "Seed",
    sector: "AI infrastructure",
    raiseAmount: "$5M",
    headline: "Replaced $15K/mo consultant with CapSignal",
    summary:
      "Second-time founder switched from fundraising consultant to self-serve platform with same meeting volume.",
    challenge:
      "Consultant owned relationships in their inbox; founder had limited visibility into pipeline.",
    approach:
      "Full shortlist rebuild in CapSignal. Founder-owned domain outreach with weekly iteration on reply data.",
    results: [
      { label: "Monthly cost", value: "$99.99 vs $15K" },
      { label: "Partner meetings", value: "Same volume" },
      { label: "Pipeline visibility", value: "Full dashboard" },
    ],
    quote: "I wanted to own every relationship. CapSignal was the first tool that didn't get in the way of that.",
    timeline: "Consultant offboarded month 1",
  },
  {
    slug: "fieldops-pre-seed",
    company: "FieldOps",
    founder: "Ryan O'Brien",
    role: "Founder",
    stage: "Pre-seed",
    sector: "Industrial SaaS",
    raiseAmount: "$900K",
    headline: "Austin-first investor targeting, then national",
    summary:
      "Solo founder prioritized regional investors before expanding to coastal funds.",
    challenge:
      "No network in SF/NYC; needed local angels and regional funds to anchor the round.",
    approach:
      "City field in raise profile prioritized metro investors. First batch 80 regional, second batch national.",
    results: [
      { label: "Local meetings", value: "3 of first 5" },
      { label: "Round size", value: "$900K" },
      { label: "Time to close", value: "7 weeks" },
    ],
    quote: "Three of our first five meetings were Austin funds I'd never have found in a generic CSV.",
    timeline: "Regional batch → national expansion",
  },
];
