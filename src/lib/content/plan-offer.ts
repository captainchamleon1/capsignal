import { selfServePricing } from "@/lib/content/guarantee";

/** Full-platform value props for /start/plan and checkout. */
export const planOffer = {
  eyebrow: "Profile scored · raise stack ready",
  headline: "The complete fundraising stack — not just a list.",
  subhead:
    "What fundraising advisors charge $15K+ for: AI matching across 12,000+ investors, verified contacts, automated outreach, CRM, data room, and pitch deck tools — in one subscription.",
  ctaSubline: "No success fees · no carry · cancel anytime",
  vsAdvisor: {
    label: "Typical fundraising advisor",
    price: "$15K–$50K retainer",
    note: "Plus weeks to onboard · often takes carry",
  },
  vsCapSignal: {
    label: "CapSignal",
    price: `${selfServePricing.priceFull}/mo`,
    note: `${selfServePricing.trialDays}-day free trial · live in days, not months`,
  },
} as const;

export const planOfferPillars = [
  {
    id: "matching",
    title: "AI investor matching",
    description:
      "12,000+ source-attributed firms scored daily on stage, sector, check size, and live deployment activity — not a stale CSV export.",
    highlight: "Verified emails & LinkedIn paths",
  },
  {
    id: "outreach",
    title: "AI outreach system",
    description:
      "Thesis-aware sequences drafted from your raise profile and each investor's public thesis. Sends from your domain with automated follow-ups.",
    highlight: "SPF/DKIM · reply detection",
  },
  {
    id: "crm",
    title: "Investor CRM",
    description:
      "Every conversation, reply, and meeting in one pipeline built for raises — status tracking, notes, and next steps from first email to term sheet.",
    highlight: "Shortlist → meeting funnel",
  },
  {
    id: "dataroom",
    title: "Secure data room",
    description:
      "Share deck, model, cap table, and diligence docs with permission controls. See exactly who opened what and when.",
    highlight: "Per-investor access & view tracking",
  },
  {
    id: "deck",
    title: "Pitch deck studio",
    description:
      "AI-assisted deck structure and copy plus two expert review sessions before you send — so your story lands with partners.",
    highlight: "Builder tools + live review",
  },
  {
    id: "support",
    title: "Raise support included",
    description:
      "Onboarding call, top-100 investor deep research, data room setup guidance, and priority support when you need a human.",
    highlight: "Not a self-serve directory",
  },
] as const;

export const planOfferProof = [
  "48-hour match guarantee — 5+ active investors or full refund",
  "Up to 500 investor targets per campaign",
  "Most founders live in 5–7 business days after approval",
] as const;
