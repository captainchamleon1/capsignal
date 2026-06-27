import type { MatchPreviewInvestor } from "@/lib/leads/match-types";
import { PREVIEW_TOP_COUNT } from "@/lib/match-display";

type DemoFirm = MatchPreviewInvestor & {
  fundSize: string;
  checkSize: string;
  investments: string[];
};

export type DemoSampleFirm = {
  name: string;
  partner: string | null;
  dataQuality: number;
  sectorLabel: string;
};

const sampleSectorLabels = ["B2B SaaS", "Enterprise", "Cloud SaaS", "Fintech", "Developer tools"];

const seedInvestors: DemoFirm[] = [
  { firm: "Point Nine Capital", partner: "Pawel Chudzinski", score: 94, reason: "Active B2B SaaS seed investor with recent portfolio adds.", fundSize: "$180M fund", checkSize: "$500K–$2M checks", investments: ["Zendesk", "Typeform", "Algolia"], blurred: false },
  { firm: "Unusual Ventures", partner: "John Vrionis", score: 91, reason: "Seed-stage enterprise software focus with operator-led support.", fundSize: "$400M AUM", checkSize: "$1M–$3M checks", investments: ["Carta", "Palo Alto Networks", "Workato"], blurred: false },
  { firm: "First Round Capital", partner: "Josh Kopelman", score: 89, reason: "Premier seed fund with deep B2B SaaS portfolio.", fundSize: "$1.2B AUM", checkSize: "$500K–$3M checks", investments: ["Notion", "Square", "Roblox"], blurred: false },
  { firm: "Bessemer Venture Partners", partner: "Mary D'Onofrio", score: 87, reason: "Cloud & SaaS thesis with active seed program.", fundSize: "$4.5B AUM", checkSize: "$1M–$5M checks", investments: ["Twilio", "Shopify", "Canva"], blurred: false },
  { firm: "Index Ventures", partner: "Danny Rimer", score: 86, reason: "European-US seed with strong SaaS track record.", fundSize: "$2.3B AUM", checkSize: "$1M–$10M checks", investments: ["Figma", "Dropbox", "Discord"], blurred: false },
  { firm: "Accel Partners", partner: "Ryan Sweeney", score: 85, reason: "Seed-to-growth with dedicated SaaS practice.", fundSize: "$3.1B AUM", checkSize: "$500K–$5M checks", investments: ["Slack", "Atlassian", "Segment"], blurred: false },
  { firm: "Craft Ventures", partner: "David Sacks", score: 84, reason: "Operator-led seed with B2B and fintech overlap.", fundSize: "$1.1B AUM", checkSize: "$1M–$5M checks", investments: ["Airtable", "Reddit", "SpaceX"], blurred: false },
  { firm: "Initialized Capital", partner: "Garry Tan", score: 83, reason: "Early-stage with strong YC pipeline and SaaS bets.", fundSize: "$500M AUM", checkSize: "$250K–$2M checks", investments: ["Instacart", "Flexport", "Rippling"], blurred: false },
  { firm: "Homebrew", partner: "Satya Patel", score: 82, reason: "Seed fund focused on bottom-up SaaS and marketplaces.", fundSize: "$90M fund", checkSize: "$500K–$1.5M checks", investments: ["Chime", "Gusto", "Plaid"], blurred: false },
  { firm: "Boldstart Ventures", partner: "Ed Sim", score: 81, reason: "Day-zero enterprise seed with developer tools focus.", fundSize: "$250M AUM", checkSize: "$500K–$2M checks", investments: ["Snyk", "BigID", "StackHawk"], blurred: false },
  { firm: "Felicis Ventures", partner: "Renata Quintini", score: 80, reason: "Seed investor with enterprise and AI software bets.", fundSize: "$900M AUM", checkSize: "$500K–$3M checks", investments: ["Notion", "Canva", "Plaid"], blurred: false },
  { firm: "Haystack", partner: "Semil Shah", score: 79, reason: "Concentrated seed portfolio with B2B software focus.", fundSize: "$120M fund", checkSize: "$250K–$1M checks", investments: ["DoorDash", "Instacart", "Gusto"], blurred: false },
];

export function getDemoMatches(_stage: string, _sector: string, limit = PREVIEW_TOP_COUNT): DemoFirm[] {
  return seedInvestors.slice(0, Math.min(limit, seedInvestors.length));
}

/** Homepage / marketing table sample when the local DB is empty. */
export function getDemoInvestorSample(limit = 5): DemoSampleFirm[] {
  return seedInvestors.slice(0, Math.min(limit, seedInvestors.length)).map((inv, i) => ({
    name: inv.firm,
    partner: inv.partner,
    dataQuality: inv.score,
    sectorLabel: sampleSectorLabels[i % sampleSectorLabels.length],
  }));
}
