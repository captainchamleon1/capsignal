export const productModules = [
  {
    id: "matching",
    title: "Investor matching",
    headline: "Rank investors by who is deploying right now",
    description:
      "CapSignal scores every investor against your raise using four signal layers refreshed daily. You get a ranked shortlist with written rationale—not a exported CSV from a stale database.",
    bullets: [
      "Match scores from 0–100 with per-investor explanation",
      "Filter by check size, stage, sector, and geography",
      "Warm intro path mapping from portfolio overlap",
      "Exclude list sync before campaign launch",
    ],
  },
  {
    id: "outreach",
    title: "Outreach sequences",
    headline: "Sequences that send from your inbox",
    description:
      "Each investor receives copy generated from your raise profile and their public investment thesis. Follow-ups trigger on opens, non-replies, and positive signals—on a schedule you approve upfront.",
    bullets: [
      "SPF/DKIM setup on your domain",
      "3–5 step sequences with configurable timing",
      "Reply detection and auto-pause on response",
      "LinkedIn touchpoints on Scale and Full Service tiers",
    ],
  },
  {
    id: "analytics",
    title: "Investor CRM & data room",
    headline: "Keep momentum from first reply to term sheet",
    description:
      "Once investors engage, don't lose them to scattered spreadsheets and Drive links. Track every relationship in one CRM, share deck and diligence docs through a secure data room, and see exactly who's moving toward a meeting—or a check.",
    bullets: [
      "Investor pipeline with status, notes, and next steps",
      "Secure data room with permission controls per investor",
      "View tracking on deck and diligence materials",
      "Funnel view: sent → opened → replied → meeting",
      "Weekly reports on what's converting into meetings",
    ],
  },
] as const;

export const productStats = [
  { label: "Avg. shortlist size", value: "247" },
  { label: "Sequences per campaign", value: "4.2" },
  { label: "Follow-up touchpoints", value: "3–5" },
  { label: "Dashboard refresh", value: "Real-time" },
] as const;
