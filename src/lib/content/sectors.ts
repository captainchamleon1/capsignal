export type Sector = {
  slug: string;
  name: string;
  headline: string;
  description: string;
  stats: { label: string; value: string }[];
  challenges: string[];
  approach: string[];
  exampleInvestors: string[];
};

export const sectors: Sector[] = [
  {
    slug: "b2b-saas",
    name: "B2B SaaS",
    headline: "Reach Seed and Series A investors deploying in software",
    description: "CapSignal's strongest signal coverage. We track 4,200+ active B2B investors with weekly deployment updates.",
    stats: [
      { label: "Median reply rate", value: "12.8%" },
      { label: "Avg. shortlist", value: "280" },
      { label: "Typical close", value: "9 weeks" },
    ],
    challenges: [
      "Generic 'SaaS investor' lists include growth funds wrong for your stage",
      "Thesis drift—firms that did Seed SaaS now focus on Series B+",
      "Outreach that doesn't reference specific portfolio companies gets ignored",
    ],
    approach: [
      "Filter by check size and stage-specific deployment in last 12 months",
      "Reference portfolio companies in outreach copy per investor",
      "Segment by sub-vertical: infra, vertical SaaS, PLG, enterprise",
    ],
    exampleInvestors: ["Bessemer", "Unusual Ventures", "First Round", "Point Nine"],
  },
  {
    slug: "fintech",
    name: "Fintech",
    headline: "Target investors with recent fintech deployment",
    description: "Regulatory complexity makes generic outreach fail. We match on fintech-specific thesis and recent portfolio moves.",
    stats: [
      { label: "Median reply rate", value: "11.2%" },
      { label: "Avg. shortlist", value: "210" },
      { label: "Typical close", value: "11 weeks" },
    ],
    challenges: [
      "Fintech means different things to different funds—payments vs. lending vs. infra",
      "Regulatory narrative required in positioning",
      "Many 'fintech' investors paused after 2022—signal filtering critical",
    ],
    approach: [
      "Sub-sector tagging: payments, lending, banking infra, insurtech, crypto",
      "Compliance-aware messaging review on Scale tier",
      "Partner-level tracking for fintech specialists vs. generalists",
    ],
    exampleInvestors: ["QED Investors", "Nyca Partners", "Ribbit Capital", "Matrix Partners"],
  },
  {
    slug: "deep-tech",
    name: "Deep tech",
    headline: "Find investors who fund technical risk",
    description: "Deep tech raises need investors who understand long development cycles and technical differentiation.",
    stats: [
      { label: "Median reply rate", value: "10.4%" },
      { label: "Avg. shortlist", value: "190" },
      { label: "Typical close", value: "14 weeks" },
    ],
    challenges: [
      "Smaller investor universe than SaaS",
      "Outreach must lead with technical differentiation, not market size",
      "Longer diligence cycles require sustained follow-up",
    ],
    approach: [
      "Match on technical thesis: AI/ML, robotics, materials, quantum, biotech platforms",
      "Messaging led by technical founder review before launch",
      "Extended follow-up cadence for partners with longer decision cycles",
    ],
    exampleInvestors: ["Lux Capital", "Playground Global", "The Engine", "DCVC"],
  },
  {
    slug: "climate",
    name: "Climate & energy",
    headline: "Connect with climate investors actively deploying",
    description: "Climate capital surged and contracted. Signal-based targeting finds who's writing checks now—not in 2021.",
    stats: [
      { label: "Median reply rate", value: "11.9%" },
      { label: "Avg. shortlist", value: "175" },
      { label: "Typical close", value: "12 weeks" },
    ],
    challenges: [
      "Climate label overused—many funds rebranded without deploying",
      "Hardware vs. software climate companies need different investors",
      "Policy and grant context matters in positioning",
    ],
    approach: [
      "Verify deployment via portfolio, not marketing pages",
      "Segment: climate software, energy, mobility, agtech, carbon",
      "Reference specific climate portfolio companies per investor",
    ],
    exampleInvestors: ["Breakthrough Energy", "Lowercarbon Capital", "Congruent Ventures", "Energy Impact Partners"],
  },
];

export function getSector(slug: string) {
  return sectors.find((s) => s.slug === slug);
}
