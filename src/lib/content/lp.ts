export const lpProofStats = [
  { value: "11.4%", label: "Median reply rate" },
  { value: "10", label: "Meetings in 14 days" },
  { value: "5–7 days", label: "To campaign launch" },
  { value: "182K", label: "Investor records" },
] as const;

export const lpSteps = [
  {
    step: "01",
    title: "Submit your raise profile",
    body: "Stage, sector, traction, and check size. We respond within one business day.",
  },
  {
    step: "02",
    title: "Approve your shortlist",
    body: "Ranked investors with deployment signals and thesis fit—nothing sends until you sign off.",
  },
  {
    step: "03",
    title: "Launch from your inbox",
    body: "Thesis-aware sequences from your domain. Follow-ups, reply tracking, weekly iteration.",
  },
] as const;

export const lpFaqs = [
  {
    q: "Who is this for?",
    a: "Pre-seed through Series B founders raising in software, fintech, healthtech, climate, and deep tech.",
  },
  {
    q: "Where do emails send from?",
    a: "Your domain. We configure SPF/DKIM and connect to your inbox. Replies land with you.",
  },
  {
    q: "How fast can we launch?",
    a: "Most campaigns go live within 5–7 business days after profile submission and shortlist approval.",
  },
  {
    q: "Is there a success fee?",
    a: "No. Flat monthly subscription—no carry or percentage of capital raised.",
  },
] as const;
