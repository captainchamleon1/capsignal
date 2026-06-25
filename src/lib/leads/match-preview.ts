export type InvestorMatch = {
  firm: string;
  partner: string;
  score: number;
  reason: string;
  blurred?: boolean;
};

export type MatchPreview = {
  totalMatches: number;
  topInvestors: InvestorMatch[];
  projectedReplies: number;
  projectedMeetings: number;
  replyRate: number;
  launchDays: string;
};

const investorsBySector: Record<string, { firm: string; partner: string }[]> = {
  "B2B SaaS": [
    { firm: "Horizon Capital", partner: "M. Reeves" },
    { firm: "Northwind Ventures", partner: "E. Vasquez" },
    { firm: "Basecamp Fund", partner: "A. Park" },
    { firm: "Lattice Ventures", partner: "K. Morgan" },
    { firm: "Signal Peak", partner: "J. Walsh" },
    { firm: "Meridian Partners", partner: "S. Chen" },
    { firm: "Cedar Grove Capital", partner: "D. Okonkwo" },
    { firm: "First Round-adjacent angels", partner: "Portfolio syndicate" },
  ],
  Fintech: [
    { firm: "Harbor Street Ventures", partner: "L. Kim" },
    { firm: "Ledger Fund", partner: "R. Patel" },
    { firm: "Northwind Ventures", partner: "E. Vasquez" },
    { firm: "Payflow Capital", partner: "T. Brooks" },
    { firm: "Summit Fintech", partner: "A. Nguyen" },
    { firm: "Bridgepoint Seed", partner: "C. Ellis" },
  ],
  Healthtech: [
    { firm: "Vital Spring Capital", partner: "N. Hartman" },
    { firm: "Careline Ventures", partner: "P. Morrison" },
    { firm: "BioBridge Fund", partner: "K. Singh" },
    { firm: "Northwind Ventures", partner: "E. Vasquez" },
    { firm: "Helix Partners", partner: "M. Torres" },
  ],
  Climate: [
    { firm: "VoltGrid Capital", partner: "M. Webb" },
    { firm: "Terra Infra Fund", partner: "S. Lindqvist" },
    { firm: "Cascade Climate", partner: "J. Rivera" },
    { firm: "Greenline Ventures", partner: "A. Park" },
    { firm: "Northwind Ventures", partner: "E. Vasquez" },
  ],
  "Deep tech": [
    { firm: "Kernel Ventures", partner: "A. Volkov" },
    { firm: "RelayDB Capital", partner: "S. Yamamoto" },
    { firm: "Deepcurrent Fund", partner: "R. Chen" },
    { firm: "Lattice Ventures", partner: "K. Morgan" },
    { firm: "Horizon Capital", partner: "M. Reeves" },
  ],
  Other: [
    { firm: "Horizon Capital", partner: "M. Reeves" },
    { firm: "Northwind Ventures", partner: "E. Vasquez" },
    { firm: "Basecamp Fund", partner: "A. Park" },
    { firm: "Lattice Ventures", partner: "K. Morgan" },
    { firm: "Summit Partners", partner: "R. Chen" },
  ],
};

const reasonsBySector: Record<string, string[]> = {
  "B2B SaaS": [
    "Deployed in B2B infra in last 2 quarters",
    "Partner led 3 Seed rounds in your vertical",
    "Thesis overlap: workflow + data tooling",
    "Recent follow-on in pipeline software",
    "Check size fits your target raise",
    "Active in your geography this month",
  ],
  Fintech: [
    "Closed fintech fund II in last 6 months",
    "Portfolio overlap with your category",
    "Partner posting about embedded finance",
    "Led 2 payments deals this year",
    "Stage and check size match",
  ],
  Healthtech: [
    "Recent healthtech seed in last quarter",
    "FDA-path experience in portfolio",
    "Partner hire signals sector push",
    "Thesis: clinical workflow software",
  ],
  Climate: [
    "Climate infra deployment in last 9 months",
    "Portfolio company in grid software",
    "Fund re-up with energy thesis",
    "Active co-investor network in sector",
  ],
  "Deep tech": [
    "Technical diligence bench in-house",
    "Recent infra / systems investments",
    "Partner background in your stack",
    "Seed specialist with deep tech focus",
  ],
  Other: [
    "Recent deployment in your stage",
    "Thesis alignment from public portfolio",
    "Check size and geo fit",
    "Partner active on LinkedIn this month",
  ],
};

const stageMultipliers: Record<string, { min: number; max: number }> = {
  "Pre-seed": { min: 95, max: 165 },
  Seed: { min: 165, max: 285 },
  "Series A": { min: 130, max: 220 },
  "Series B": { min: 75, max: 145 },
};

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h << 5) - h + input.charCodeAt(i);
  return Math.abs(h);
}

function pickRange(min: number, max: number, seed: number) {
  return min + (seed % (max - min + 1));
}

export function generateMatchPreview(input: {
  company: string;
  sector: string;
  stage: string;
  raise?: string;
}): MatchPreview {
  const sector = input.sector || "Other";
  const stage = input.stage || "Seed";
  const pool = investorsBySector[sector] ?? investorsBySector.Other;
  const reasons = reasonsBySector[sector] ?? reasonsBySector.Other;
  const seed = hashSeed(`${input.company}-${sector}-${stage}`);
  const mult = stageMultipliers[stage] ?? stageMultipliers.Seed;

  const totalMatches = pickRange(mult.min, mult.max, seed);
  const replyRate = 11.4;
  const projectedReplies = Math.max(8, Math.round(totalMatches * (replyRate / 100)));
  const projectedMeetings = Math.max(2, Math.round(projectedReplies * 0.35));

  const topInvestors: InvestorMatch[] = pool.slice(0, 5).map((inv, i) => ({
    ...inv,
    score: 96 - i * 4 - (seed % 3),
    reason: reasons[i % reasons.length],
    blurred: i >= 3,
  }));

  return {
    totalMatches,
    topInvestors,
    projectedReplies,
    projectedMeetings,
    replyRate,
    launchDays: "5–7",
  };
}
