export type CaseStudy = {
  slug: string;
  company: string;
  founder: string;
  role: string;
  stage: string;
  sector: string;
  raiseAmount: string;
  headline: string;
  summary: string;
  challenge: string;
  approach: string;
  results: { label: string; value: string }[];
  quote: string;
  timeline: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "meridian-labs",
    company: "Meridian Labs",
    founder: "Sarah Chen",
    role: "CEO",
    stage: "Seed",
    sector: "B2B SaaS",
    raiseAmount: "$2.5M",
    headline: "Ten investor meetings in two weeks from a standing start",
    summary:
      "Meridian had strong product traction but zero warm investor relationships. CapSignal built a ranked shortlist of 240 Seed-stage B2B investors and launched personalized sequences within six days.",
    challenge:
      "The team had been fundraising manually for three weeks with a 2% reply rate on generic outreach. Their CRM had 400 contacts but no signal on who was actively deploying in infrastructure SaaS.",
    approach:
      "CapSignal scored investors on recent B2B infra investments, partner-level activity, and check size fit. Messaging referenced specific portfolio companies for each investor. A three-step email cadence ran from Sarah's domain with follow-ups on non-replies at day 3 and day 7.",
    results: [
      { label: "Reply rate", value: "13.8%" },
      { label: "Meetings booked", value: "10 in 14 days" },
      { label: "Investors contacted", value: "186" },
      { label: "Time to launch", value: "6 days" },
    ],
    quote:
      "Ten meetings in two weeks. The shortlist was the difference—every firm had deployed in our space within the last two quarters.",
    timeline: "March – April 2026",
  },
  {
    slug: "stackline",
    company: "Stackline",
    founder: "James Okonkwo",
    role: "Founder",
    stage: "Series A",
    sector: "Fintech",
    raiseAmount: "$4.2M",
    headline: "Series A closed in eleven weeks with inbox-native outreach",
    summary:
      "Stackline needed to reach fintech-focused growth investors while running the business. CapSignal handled targeting, sequencing, and follow-up so James could focus on meetings.",
    challenge:
      "Previous raise outreach felt templated. Investors replied asking if it was a mass email. James needed personalization at scale without hiring a fundraising associate.",
    approach:
      "Scale tier with top-100 investor deep research. Each message referenced the investor's recent fintech portfolio moves. LinkedIn sequences supplemented email for partners who were active on the platform.",
    results: [
      { label: "Round closed", value: "$4.2M" },
      { label: "Weeks to close", value: "11" },
      { label: "Reply rate", value: "12.1%" },
      { label: "Meetings held", value: "34" },
    ],
    quote:
      "We closed Series A in eleven weeks. Outreach came from my inbox and investors treated it like a warm intro, not a blast.",
    timeline: "January – March 2026",
  },
  {
    slug: "relay-db",
    company: "RelayDB",
    founder: "Priya Sharma",
    role: "CEO",
    stage: "Seed",
    sector: "Deep tech",
    raiseAmount: "$3.1M",
    headline: "217 interested investors and tier-1 VC meetings in three weeks",
    summary:
      "RelayDB's deep tech positioning made generic outreach ineffective. CapSignal matched investors with recent database and infrastructure investments and ran a four-week campaign.",
    challenge:
      "Deep tech raises require investors who understand the category. RelayDB's team spent 40+ hours building lists manually before switching to CapSignal.",
    approach:
      "Full shortlist of 310 investors filtered by deep tech and infrastructure thesis. Messaging led with technical differentiation and referenced comparable portfolio companies. Weekly targeting adjustments based on reply patterns.",
    results: [
      { label: "Interested investors", value: "217" },
      { label: "Tier-1 VC meetings", value: "8" },
      { label: "Reply rate", value: "14.6%" },
      { label: "Campaign duration", value: "4 weeks" },
    ],
    quote:
      "The administrative lift was completely off my plate. I spent my time in meetings instead of managing spreadsheets and follow-up reminders.",
    timeline: "February – March 2026",
  },
  {
    slug: "voltgrid",
    company: "VoltGrid",
    founder: "Marcus Webb",
    role: "CEO",
    stage: "Series A",
    sector: "Climate",
    raiseAmount: "$6.8M",
    headline: "Climate investors who were actually deploying—not just rebranding",
    summary:
      "VoltGrid's grid software needed investors with recent climate infra deployment. CapSignal filtered out funds with stale portfolios and focused on 195 active climate investors.",
    challenge:
      "After 2022, many funds added 'climate' to their thesis without new investments. VoltGrid wasted six weeks on a list that included inactive names.",
    approach:
      "Deployment signal filtering required portfolio activity in last 9 months. Outreach referenced specific climate portfolio companies. Scale tier with data room guidance.",
    results: [
      { label: "Round closed", value: "$6.8M" },
      { label: "Reply rate", value: "12.4%" },
      { label: "Meetings", value: "28" },
      { label: "Weeks to close", value: "13" },
    ],
    quote:
      "Every investor on our list had made a climate investment in the last two quarters. That alone saved us months.",
    timeline: "November 2025 – February 2026",
  },
  {
    slug: "patchwork",
    company: "Patchwork Health",
    founder: "Dr. Amara Osei",
    role: "CEO",
    stage: "Seed",
    sector: "Healthtech",
    raiseAmount: "$3.5M",
    headline: "Healthtech specialists reached in a regulated category",
    summary:
      "Patchwork needed healthtech investors who understood FDA pathways. CapSignal matched on health-specific thesis and avoided generalist funds wrong for the category.",
    challenge:
      "Healthtech outreach requires regulatory context. Generic SaaS messaging failed. Dr. Osei had limited time outside clinical operations.",
    approach:
      "Healthtech-specific shortlist of 220 investors. Messaging reviewed for regulatory accuracy. Full Service tier with weekly strategy calls during diligence.",
    results: [
      { label: "Interested investors", value: "89" },
      { label: "Reply rate", value: "10.9%" },
      { label: "Lead secured", value: "Week 8" },
      { label: "Round size", value: "$3.5M" },
    ],
    quote:
      "They understood healthtech isn't SaaS. The messaging reflected our regulatory path without me rewriting every email.",
    timeline: "September – December 2025",
  },
  {
    slug: "kernel-ai",
    company: "Kernel AI",
    founder: "Yuki Tanaka",
    role: "Co-founder & CEO",
    stage: "Pre-seed",
    sector: "AI / ML",
    raiseAmount: "$1.2M",
    headline: "Pre-seed raise closed in five weeks from cold start",
    summary:
      "Kernel had strong technical founders but no investor network. CapSignal built a 180-investor pre-seed shortlist and launched in five days.",
    challenge:
      "AI label is overcrowded—investors ignore 'AI startup' pitches. Kernel needed outreach that led with specific technical differentiation and customer traction.",
    approach:
      "Filtered for pre-seed ML infra investors with recent deployment. Copy led with benchmark results, not 'AI platform.' Compressed 3-step cadence for faster iteration.",
    results: [
      { label: "Round closed", value: "$1.2M" },
      { label: "Reply rate", value: "15.1%" },
      { label: "Meetings", value: "18" },
      { label: "Days to launch", value: "5" },
    ],
    quote:
      "Five days from signup to first send. We had our first term sheet conversation in week three.",
    timeline: "April – May 2026",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
