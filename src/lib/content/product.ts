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
    title: "Analytics & reporting",
    headline: "Know what's working before the week ends",
    description:
      "Campaign dashboard tracks sends, opens, replies, and meetings. Weekly reports summarize conversion by investor segment and recommend targeting adjustments for the next batch.",
    bullets: [
      "Funnel view: sent → opened → replied → meeting",
      "Segment breakdown by sector and stage",
      "Subject line and send-window performance",
      "Export to CSV for board updates",
    ],
  },
] as const;

export const productStats = [
  { label: "Avg. shortlist size", value: "247" },
  { label: "Sequences per campaign", value: "4.2" },
  { label: "Follow-up touchpoints", value: "3–5" },
  { label: "Dashboard refresh", value: "Real-time" },
] as const;
