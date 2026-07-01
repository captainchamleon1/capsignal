import type { MatchPreviewInvestor } from "@/lib/leads/match-types";
import { PREVIEW_TOP_COUNT } from "@/lib/match-display";
import { cityFit } from "@/lib/data/scoring/location";

type DemoFirm = MatchPreviewInvestor & {
  fundSize: string;
  checkSize: string;
  investments: string[];
  hqCity?: string;
};

export type DemoSampleFirm = {
  name: string;
  partner: string | null;
  dataQuality: number;
  sectorLabel: string;
};

const sampleSectorLabels = ["B2B SaaS", "Enterprise", "Cloud SaaS", "Fintech", "Developer tools"];

const b2bSaasInvestors: DemoFirm[] = [
  { firm: "Point Nine Capital", partner: "Pawel Chudzinski", score: 94, reason: "Active B2B SaaS seed investor with recent portfolio adds.", fundSize: "$180M fund", checkSize: "$500K–$2M checks", investments: ["Zendesk", "Typeform", "Algolia"], hqCity: "Berlin", blurred: false },
  { firm: "Unusual Ventures", partner: "John Vrionis", score: 91, reason: "Seed-stage enterprise software focus with operator-led support.", fundSize: "$400M AUM", checkSize: "$1M–$3M checks", investments: ["Carta", "Workato"], hqCity: "Menlo Park", blurred: false },
  { firm: "First Round Capital", partner: "Josh Kopelman", score: 89, reason: "Premier seed fund with deep B2B SaaS portfolio.", fundSize: "$1.2B AUM", checkSize: "$500K–$3M checks", investments: ["Notion", "Square"], hqCity: "San Francisco", blurred: false },
  { firm: "Bessemer Venture Partners", partner: "Mary D'Onofrio", score: 87, reason: "Cloud & SaaS thesis with active seed program.", fundSize: "$4.5B AUM", checkSize: "$1M–$5M checks", investments: ["Twilio", "Shopify"], hqCity: "San Francisco", blurred: false },
  { firm: "Boldstart Ventures", partner: "Ed Sim", score: 86, reason: "Day-zero enterprise seed with developer tools focus.", fundSize: "$250M AUM", checkSize: "$500K–$2M checks", investments: ["Snyk", "BigID"], hqCity: "New York", blurred: false },
  { firm: "Accel Partners", partner: "Ryan Sweeney", score: 85, reason: "Seed-to-growth with dedicated SaaS practice.", fundSize: "$3.1B AUM", checkSize: "$500K–$5M checks", investments: ["Slack", "Atlassian"], hqCity: "Palo Alto", blurred: false },
  { firm: "Initialized Capital", partner: "Garry Tan", score: 84, reason: "Early-stage with strong YC pipeline and SaaS bets.", fundSize: "$500M AUM", checkSize: "$250K–$2M checks", investments: ["Instacart", "Rippling"], hqCity: "San Francisco", blurred: false },
  { firm: "Homebrew", partner: "Satya Patel", score: 83, reason: "Seed fund focused on bottom-up SaaS and marketplaces.", fundSize: "$90M fund", checkSize: "$500K–$1.5M checks", investments: ["Chime", "Gusto"], hqCity: "San Francisco", blurred: false },
  { firm: "Felicis Ventures", partner: "Renata Quintini", score: 82, reason: "Seed investor with enterprise and AI software bets.", fundSize: "$900M AUM", checkSize: "$500K–$3M checks", investments: ["Notion", "Canva"], hqCity: "Menlo Park", blurred: false },
  { firm: "Index Ventures", partner: "Danny Rimer", score: 81, reason: "European-US seed with strong SaaS track record.", fundSize: "$2.3B AUM", checkSize: "$1M–$10M checks", investments: ["Figma", "Dropbox"], hqCity: "San Francisco", blurred: false },
  { firm: "Craft Ventures", partner: "David Sacks", score: 80, reason: "Operator-led seed with B2B and fintech overlap.", fundSize: "$1.1B AUM", checkSize: "$1M–$5M checks", investments: ["Airtable", "Reddit"], hqCity: "San Francisco", blurred: false },
  { firm: "Haystack", partner: "Semil Shah", score: 79, reason: "Concentrated seed portfolio with B2B software focus.", fundSize: "$120M fund", checkSize: "$250K–$1M checks", investments: ["DoorDash", "Gusto"], hqCity: "San Francisco", blurred: false },
];

const fintechInvestors: DemoFirm[] = [
  { firm: "QED Investors", partner: "Nigel Morris", score: 93, reason: "Fintech specialist with payments and lending focus.", fundSize: "$2B+ AUM", checkSize: "$1M–$10M checks", investments: ["Credit Karma", "Klarna"], hqCity: "Alexandria", blurred: false },
  { firm: "Ribbit Capital", partner: "Micky Malka", score: 91, reason: "Global fintech seed and growth with active deployment.", fundSize: "$4B AUM", checkSize: "$2M–$15M checks", investments: ["Coinbase", "Robinhood"], hqCity: "Palo Alto", blurred: false },
  { firm: "Nyca Partners", partner: "Hans Morris", score: 89, reason: "Seed fintech focused on infrastructure and B2B payments.", fundSize: "$350M AUM", checkSize: "$1M–$5M checks", investments: ["Plaid", "Affirm"], hqCity: "New York", blurred: false },
  { firm: "Homebrew", partner: "Satya Patel", score: 87, reason: "Bottom-up fintech and SaaS at seed.", fundSize: "$90M fund", checkSize: "$500K–$1.5M checks", investments: ["Chime", "Plaid"], hqCity: "San Francisco", blurred: false },
  { firm: "Andreessen Horowitz", partner: "Anish Acharya", score: 86, reason: "Active fintech and crypto practice at seed.", fundSize: "$35B AUM", checkSize: "$1M–$10M checks", investments: ["Stripe", "Coinbase"], hqCity: "Menlo Park", blurred: false },
  { firm: "Index Ventures", partner: "Danny Rimer", score: 85, reason: "European fintech and SaaS crossover.", fundSize: "$2.3B AUM", checkSize: "$1M–$10M checks", investments: ["Revolut", "Adyen"], hqCity: "San Francisco", blurred: false },
  { firm: "Bessemer Venture Partners", partner: "Mary D'Onofrio", score: 84, reason: "Cloud fintech and vertical SaaS at seed.", fundSize: "$4.5B AUM", checkSize: "$1M–$5M checks", investments: ["Toast", "Shopify"], hqCity: "San Francisco", blurred: false },
  { firm: "Union Square Ventures", partner: "Albert Wenger", score: 83, reason: "Networked fintech and marketplace seed bets.", fundSize: "$1B AUM", checkSize: "$500K–$3M checks", investments: ["Coinbase", "Stripe"], hqCity: "New York", blurred: false },
];

const healthtechInvestors: DemoFirm[] = [
  { firm: "7wireVentures", partner: "Lee Shapiro", score: 92, reason: "Healthcare IT and digital health seed specialist.", fundSize: "$350M AUM", checkSize: "$1M–$5M checks", investments: ["Livongo", "Health Catalyst"], hqCity: "Chicago", blurred: false },
  { firm: "Oak HC/FT", partner: "Andrew Adams", score: 90, reason: "Healthcare and fintech crossover with active seed.", fundSize: "$3.5B AUM", checkSize: "$2M–$10M checks", investments: ["Hims", "Devoted Health"], hqCity: "Greenwich", blurred: false },
  { firm: "a16z Bio", partner: "Jorge Conde", score: 88, reason: "Bio + health software with deep technical diligence.", fundSize: "$35B AUM", checkSize: "$1M–$15M checks", investments: ["Freenome", "Devoted"], hqCity: "Menlo Park", blurred: false },
  { firm: "General Catalyst", partner: "Hemant Taneja", score: 87, reason: "Health assurance thesis with software-first bets.", fundSize: "$25B AUM", checkSize: "$2M–$10M checks", investments: ["Commure", "Ro"], hqCity: "San Francisco", blurred: false },
  { firm: "Venrock", partner: "Bob Kocher", score: 86, reason: "Healthcare services and tech at seed through growth.", fundSize: "$450M AUM", checkSize: "$1M–$5M checks", investments: ["Athenahealth", "Illumina"], hqCity: "Palo Alto", blurred: false },
  { firm: "Bessemer Venture Partners", partner: "Mary D'Onofrio", score: 84, reason: "Digital health and vertical SaaS seed program.", fundSize: "$4.5B AUM", checkSize: "$1M–$5M checks", investments: ["Teladoc", "Canva"], hqCity: "San Francisco", blurred: false },
];

const deepTechInvestors: DemoFirm[] = [
  { firm: "Lux Capital", partner: "Josh Wolfe", score: 93, reason: "Deep tech and frontier science at seed.", fundSize: "$4B AUM", checkSize: "$1M–$10M checks", investments: ["Anduril", "Hugging Face"], hqCity: "New York", blurred: false },
  { firm: "Radical Ventures", partner: "Tomi Poutanen", score: 91, reason: "AI-native seed with infra and application bets.", fundSize: "$800M AUM", checkSize: "$1M–$5M checks", investments: ["Cohere", "Waabi"], hqCity: "Toronto", blurred: false },
  { firm: "Conviction", partner: "Sarah Guo", score: 90, reason: "AI application and infra seed specialist.", fundSize: "$230M fund", checkSize: "$500K–$3M checks", investments: ["Harvey", "Mistral"], hqCity: "San Francisco", blurred: false },
  { firm: "Bloomberg Beta", partner: "James Cham", score: 88, reason: "Future of work and ML infrastructure seed.", fundSize: "$150M AUM", checkSize: "$500K–$2M checks", investments: ["GitHub", "Stack Overflow"], hqCity: "San Francisco", blurred: false },
  { firm: "Amplify Partners", partner: "Sunil Dhaliwal", score: 87, reason: "Technical seed in AI, data, and dev infra.", fundSize: "$700M AUM", checkSize: "$1M–$5M checks", investments: ["Databricks", "Temporal"], hqCity: "Menlo Park", blurred: false },
  { firm: "Index Ventures", partner: "Danny Rimer", score: 85, reason: "AI and deep tech with US-Europe coverage.", fundSize: "$2.3B AUM", checkSize: "$1M–$10M checks", investments: ["Figma", "Scale AI"], hqCity: "San Francisco", blurred: false },
];

const climateInvestors: DemoFirm[] = [
  { firm: "Breakthrough Energy Ventures", partner: "Carmichael Roberts", score: 92, reason: "Climate and hard-tech with patient capital.", fundSize: "$2B+ AUM", checkSize: "$2M–$15M checks", investments: ["Form Energy", "Commonwealth Fusion"], hqCity: "Kirkland", blurred: false },
  { firm: "Lowercarbon Capital", partner: "Chris Sacca", score: 90, reason: "Climate software and hardware at seed.", fundSize: "$800M AUM", checkSize: "$500K–$5M checks", investments: ["Twelve", "Watershed"], hqCity: "Jackson", blurred: false },
  { firm: "Energize Capital", partner: "John Tough", score: 88, reason: "Climate software and grid infrastructure seed.", fundSize: "$500M AUM", checkSize: "$1M–$5M checks", investments: ["Arcadia", "SparkMeter"], hqCity: "Chicago", blurred: false },
  { firm: "Congruent Ventures", partner: "Abe Yokell", score: 86, reason: "Seed climate tech with software-first thesis.", fundSize: "$300M AUM", checkSize: "$500K–$3M checks", investments: ["Lithium Americas", "QuantumScape"], hqCity: "San Francisco", blurred: false },
  { firm: "Galvanize Climate Solutions", partner: "Tom Steyer", score: 84, reason: "Climate software and industrial decarbonization.", fundSize: "$1B AUM", checkSize: "$1M–$8M checks", investments: ["Watershed", "LanzaTech"], hqCity: "San Francisco", blurred: false },
];

const consumerInvestors: DemoFirm[] = [
  { firm: "Forerunner Ventures", partner: "Kirsten Green", score: 92, reason: "Consumer and commerce seed with category creation focus.", fundSize: "$2B AUM", checkSize: "$500K–$5M checks", investments: ["Dollar Shave Club", "Warby Parker"], hqCity: "San Francisco", blurred: false },
  { firm: "Lightspeed Venture Partners", partner: "Nicole Quinn", score: 90, reason: "Consumer and marketplace seed with global reach.", fundSize: "$18B AUM", checkSize: "$1M–$10M checks", investments: ["Snap", "Affirm"], hqCity: "Menlo Park", blurred: false },
  { firm: "Benchmark", partner: "Sarah Tavel", score: 88, reason: "Networked consumer and marketplace seed bets.", fundSize: "$425M fund", checkSize: "$1M–$5M checks", investments: ["Uber", "Twitter"], hqCity: "San Francisco", blurred: false },
  { firm: "Greycroft", partner: "Dana Settle", score: 86, reason: "Consumer and media seed with LA and NYC presence.", fundSize: "$1B AUM", checkSize: "$500K–$3M checks", investments: ["Venmo", "The RealReal"], hqCity: "Los Angeles", blurred: false },
  { firm: "Slow Ventures", partner: "Sam Lessin", score: 84, reason: "Consumer and creator economy seed bets.", fundSize: "$300M AUM", checkSize: "$250K–$2M checks", investments: ["Postmates", "Airtable"], hqCity: "San Francisco", blurred: false },
];

const SECTOR_POOLS: Record<string, DemoFirm[]> = {
  b2b_saas: b2bSaasInvestors,
  fintech: fintechInvestors,
  healthtech: healthtechInvestors,
  deep_tech: deepTechInvestors,
  climate: climateInvestors,
  consumer: consumerInvestors,
};

function sortByCity(pool: DemoFirm[], city?: string): DemoFirm[] {
  if (!city?.trim()) return pool;
  return [...pool].sort((a, b) => {
    const aScore = cityFit(a.hqCity, city) ?? 0;
    const bScore = cityFit(b.hqCity, city) ?? 0;
    if (bScore !== aScore) return bScore - aScore;
    return b.score - a.score;
  });
}

export function getDemoMatches(
  _stage: string,
  sector: string,
  limit = PREVIEW_TOP_COUNT,
  city?: string,
): DemoFirm[] {
  const pool = SECTOR_POOLS[sector] ?? b2bSaasInvestors;
  return sortByCity(pool, city).slice(0, Math.min(limit, pool.length));
}

/** Homepage / marketing table sample when the local DB is empty. */
export function getDemoInvestorSample(limit = 5): DemoSampleFirm[] {
  return b2bSaasInvestors.slice(0, Math.min(limit, b2bSaasInvestors.length)).map((inv, i) => ({
    name: inv.firm,
    partner: inv.partner,
    dataQuality: inv.score,
    sectorLabel: sampleSectorLabels[i % sampleSectorLabels.length],
  }));
}
