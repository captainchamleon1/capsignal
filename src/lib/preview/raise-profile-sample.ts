import type { RaiseProfileDraft } from "@/lib/raise-profile";
import { getDemoMatches } from "@/lib/data/demo-investors";
import { resolveDisplayMatchCount } from "@/lib/match-display";

/** Sample profile for /preview/plan — no form required. */
export const previewRaiseProfile: RaiseProfileDraft = {
  name: "Alex Chen",
  email: "alex@preview.capsignal.dev",
  role: "Founder & CEO",
  company: "Acme AI",
  city: "San Francisco",
  website: "https://acme.ai",
  sector: "AI / Machine learning",
  segment: "Enterprise",
  businessDescription:
    "We sell workflow automation to mid-market finance teams. $420K ARR, 18 paying customers, 40% QoQ growth. Replacing manual Excel processes incumbents charge six figures to implement.",
  priorFunding: "None",
  hadExit: "No",
  stage: "Seed",
  raise: "$2M",
  traction: "$420K ARR · 18 customers",
  timeline: "Close by Q3 2026",
  priorOutreach: "Some cold outreach, no CRM",
  matchCount: resolveDisplayMatchCount("seed", "deep_tech", "Acme AI", undefined, "San Francisco"),
  stageKey: "seed",
  sectorKey: "deep_tech",
  topInvestors: getDemoMatches("seed", "deep_tech", 6).map((inv, i) => ({
    firm: inv.firm,
    partner: inv.partner,
    score: inv.score,
    reason: inv.reason.replace(/B2B SaaS|enterprise software/i, "AI / ML"),
    fundSize: inv.fundSize,
    checkSize: inv.checkSize,
    investments: inv.investments,
    blurred: i >= 1,
  })),
};
