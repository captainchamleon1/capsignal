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
    description:
      "Filter the investor database by sector tags from source data. Portfolio and deployment signals improve as you add licensed enrichment feeds.",
    stats: [
      { label: "Sector tagging", value: "From source data" },
      { label: "Match basis", value: "Stage + sector fields" },
      { label: "Reply metrics", value: "Your campaigns" },
    ],
    challenges: [
      "Generic 'SaaS investor' lists include growth funds wrong for your stage",
      "Thesis drift—firms that did Seed SaaS now focus on Series B+",
      "Outreach that doesn't reference specific portfolio companies gets ignored",
    ],
    approach: [
      "Filter by stage and sector fields where present in source data",
      "Reference portfolio companies when recorded in your database",
      "Segment by sub-vertical: infra, vertical SaaS, PLG, enterprise",
    ],
    exampleInvestors: ["Bessemer", "Unusual Ventures", "First Round", "Point Nine"],
  },
  {
    slug: "fintech",
    name: "Fintech",
    headline: "Target investors with fintech focus in source data",
    description:
      "Regulatory complexity makes generic outreach fail. Match on fintech sector tags and recorded investments where available.",
    stats: [
      { label: "Sector tagging", value: "From source data" },
      { label: "Match basis", value: "Stage + sector fields" },
      { label: "Reply metrics", value: "Your campaigns" },
    ],
    challenges: [
      "Fintech means different things to different funds—payments vs. lending vs. infra",
      "Regulatory narrative required in positioning",
      "Many 'fintech' investors paused after 2022—verify recent activity",
    ],
    approach: [
      "Sub-sector tagging: payments, lending, banking infra, insurtech, crypto",
      "Compliance-aware messaging review on Scale tier",
      "Partner-level data when enriched from licensed sources",
    ],
    exampleInvestors: ["QED Investors", "Nyca Partners", "Ribbit Capital", "Matrix Partners"],
  },
  {
    slug: "deep-tech",
    name: "Deep tech",
    headline: "Find investors who fund technical risk",
    description:
      "Deep tech raises need investors who understand long development cycles and technical differentiation.",
    stats: [
      { label: "Sector tagging", value: "From source data" },
      { label: "Match basis", value: "Stage + sector fields" },
      { label: "Reply metrics", value: "Your campaigns" },
    ],
    challenges: [
      "Smaller investor universe than SaaS",
      "Outreach must lead with technical differentiation, not market size",
      "Longer diligence cycles require sustained follow-up",
    ],
    approach: [
      "Match on technical thesis tags from source data",
      "Messaging led by technical founder review before launch",
      "Extended follow-up cadence for partners with longer decision cycles",
    ],
    exampleInvestors: ["Lux Capital", "Playground Global", "The Engine", "DCVC"],
  },
  {
    slug: "climate",
    name: "Climate & energy",
    headline: "Connect with climate investors in source data",
    description:
      "Target firms tagged for climate, energy, and sustainability in open datasets. Verify deployment with portfolio enrichment when available.",
    stats: [
      { label: "Sector tagging", value: "From source data" },
      { label: "Match basis", value: "Stage + sector fields" },
      { label: "Reply metrics", value: "Your campaigns" },
    ],
    challenges: [
      "Climate label overused—many funds rebranded without deploying",
      "Hardware vs. software climate companies need different investors",
      "Policy and grant context matters in positioning",
    ],
    approach: [
      "Verify deployment via recorded investments, not marketing pages alone",
      "Segment: climate software, energy, mobility, agtech, carbon",
      "Reference specific portfolio companies when on record",
    ],
    exampleInvestors: ["Breakthrough Energy", "Lowercarbon Capital", "Congruent Ventures", "Energy Impact Partners"],
  },
];

export function getSector(slug: string) {
  return sectors.find((s) => s.slug === slug);
}
