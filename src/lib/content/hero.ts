export const heroContent = {
  eyebrow: "The new way to raise",
  headline: ["Raise capital.", "AI-native all-in-one platform."],
  subhead:
    "Stop juggling spreadsheets, stale lists, and $20K advisor retainers. Match VC funds and angels, run outreach from your inbox, and manage the full pipeline to term sheet — in one system built for raises.",
  cta: "Build your raise profile",
  ctaSecondary: "See how it works",
} as const;

export const heroPipeline = {
  label: "Raise pipeline",
  status: "Live preview",
  phases: [
    {
      id: "match",
      step: "01",
      title: "Match",
      caption: "12K+ firms · scored daily",
    },
    {
      id: "outreach",
      step: "02",
      title: "Outreach",
      caption: "From your domain",
    },
    {
      id: "crm",
      step: "03",
      title: "CRM",
      caption: "Reply → meeting",
    },
    {
      id: "close",
      step: "04",
      title: "Close",
      caption: "Data room · term sheet",
    },
  ],
  matches: [
    { firm: "Point Nine Capital", partner: "P. Chudzinski", score: 94, tag: "Seed · B2B" },
    { firm: "First Round Capital", partner: "J. Kopelman", score: 89, tag: "Thesis fit" },
  ],
  sequence: [
    { day: 0, label: "Thesis-aware intro" },
    { day: 3, label: "Portfolio overlap" },
    { day: 7, label: "Meeting ask" },
  ],
  pipeline: [
    { stage: "Contacted", count: 48, active: false },
    { stage: "Replied", count: 6, active: true },
    { stage: "Meeting", count: 2, active: false },
    { stage: "Diligence", count: 1, active: false },
  ],
  close: {
    doc: "Pitch deck v3.pdf",
    views: 12,
    investors: 4,
    note: "Term sheet in progress",
  },
} as const;
