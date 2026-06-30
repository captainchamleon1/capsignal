export type PreviewInvestor = {
  firm: string;
  partner: string;
  score: number;
  type: "VC" | "Angel";
  sector: string;
  check: string;
  signal: string;
  rationale: string;
  lastDeploy: string;
  portfolio: string[];
  warmPath?: string;
  breakdown: { deployment: number; thesis: number; check: number; geo: number };
  emailVerified: boolean;
};

export const previewMatchingMeta = {
  raise: "Acme AI · Seed · $2M",
  filters: ["Seed", "B2B SaaS", "$500K–$3M", "US + EU"],
  stats: [
    { label: "Qualified", value: "247" },
    { label: "VC funds", value: "38" },
    { label: "Angels", value: "22" },
    { label: "High-fit 85+", value: "31" },
    { label: "Warm paths", value: "12" },
  ],
  signalLayers: [
    { label: "Deployment", detail: "Fund closes · follow-ons · partner hires" },
    { label: "Thesis", detail: "Sector concentration · stage shifts" },
    { label: "Check size", detail: "Min/max vs your raise target" },
    { label: "Network", detail: "Portfolio overlap · co-investors" },
  ],
} as const;

export const previewInvestors: PreviewInvestor[] = [
  {
    firm: "Point Nine Capital",
    partner: "Pawel Chudzinski",
    score: 94,
    type: "VC",
    sector: "B2B SaaS",
    check: "$500K–$2M",
    signal: "Deployed 14d ago",
    rationale:
      "Led 2 workflow SaaS seeds in last 6 months. Check size aligns with $2M target. Partner actively posting on enterprise automation.",
    lastDeploy: "14 days ago",
    portfolio: ["Typeform", "Algolia", "Front"],
    warmPath: "Portfolio founder intro · Notion connection",
    breakdown: { deployment: 96, thesis: 92, check: 94, geo: 88 },
    emailVerified: true,
  },
  {
    firm: "First Round Capital",
    partner: "Josh Kopelman",
    score: 89,
    type: "VC",
    sector: "Seed",
    check: "$500K–$3M",
    signal: "Portfolio overlap",
    rationale:
      "3 portfolio companies in adjacent fintech ops space. Strong seed program with operator support post-investment.",
    lastDeploy: "28 days ago",
    portfolio: ["Notion", "Square", "Roblox"],
    warmPath: "Co-investor overlap · Initialized",
    breakdown: { deployment: 88, thesis: 90, check: 91, geo: 82 },
    emailVerified: true,
  },
  {
    firm: "Sarah Kim",
    partner: "Angel · ex-Stripe PM",
    score: 85,
    type: "Angel",
    sector: "Fintech ops",
    check: "$25K–$100K",
    signal: "Angel · 6 seed checks/yr",
    rationale:
      "Operator angel with 4 fintech SaaS investments. Writes first checks and intro'd 2 founders to Series A leads.",
    lastDeploy: "45 days ago",
    portfolio: ["Mercury", "Ramp", "Brex alumni network"],
    breakdown: { deployment: 82, thesis: 88, check: 78, geo: 95 },
    emailVerified: true,
  },
  {
    firm: "Index Ventures",
    partner: "Danny Rimer",
    score: 86,
    type: "VC",
    sector: "SaaS",
    check: "$1M–$10M",
    signal: "Recent AI infra deal",
    rationale:
      "EU-US seed practice with recent B2B automation bet. Geo expansion into US mid-market matches your ICP.",
    lastDeploy: "21 days ago",
    portfolio: ["Figma", "Dropbox", "Discord"],
    breakdown: { deployment: 84, thesis: 86, check: 80, geo: 90 },
    emailVerified: true,
  },
];

export const previewSequence = {
  campaign: "Seed batch 01 · Week 2",
  batchStats: [
    { label: "In sequence", value: "48" },
    { label: "Sent", value: "12" },
    { label: "Opened", value: "8" },
    { label: "Replied", value: "2" },
  ],
  deliverability: [
    { label: "SPF", ok: true },
    { label: "DKIM", ok: true },
    { label: "DMARC", ok: true },
    { label: "Domain rep", ok: true, detail: "98/100" },
  ],
  recipients: [
    { firm: "Point Nine Capital", partner: "P. Chudzinski", status: "replied" as const },
    { firm: "First Round Capital", partner: "J. Kopelman", status: "opened" as const },
    { firm: "Index Ventures", partner: "D. Rimer", status: "queued" as const },
  ],
  from: "alex@acme.ai",
  to: "pawel@pointnine.com",
  subject: "Acme AI · workflow automation for finance teams (Point Nine portfolio overlap)",
  steps: [
    {
      day: 0,
      label: "Thesis-aware intro",
      status: "sent" as const,
      sentAt: "Mon 9:04 AM",
      opens: 2,
      replies: 1,
    },
    {
      day: 3,
      label: "Portfolio overlap follow-up",
      status: "scheduled" as const,
      sentAt: "Thu 10:00 AM",
      opens: 0,
      replies: 0,
    },
    {
      day: 7,
      label: "Meeting ask + calendar link",
      status: "draft" as const,
      sentAt: "—",
      opens: 0,
      replies: 0,
    },
    {
      day: 14,
      label: "Final touch · traction update",
      status: "draft" as const,
      sentAt: "—",
      opens: 0,
      replies: 0,
    },
  ],
  bodyParagraphs: [
    "Hi Pawel — I'm Alex, founder of Acme AI. We sell workflow automation to mid-market finance teams ($420K ARR, 18 customers, 40% QoQ growth).",
    "Noticed Point Nine's recent bets on Typeform and Front — we're solving a similar ops layer for finance back-office, replacing manual Excel workflows incumbents charge six figures to implement.",
    "Would love 20 minutes to walk through traction and how we're positioning for Seed. Happy to share deck + model beforehand.",
  ],
  replySnippet: {
    from: "pawel@pointnine.com",
    preview: "Thanks Alex — this is interesting. Can you send the deck and your view on ACV expansion…",
    time: "Today 2:14 PM",
  },
  settings: {
    sendWindow: "Tue–Thu · 9:00–11:00 AM recipient local",
    throttle: "18 emails/day · domain-safe cadence",
    pauseOnReply: true,
  },
} as const;

export const previewCrm = {
  metrics: [
    { label: "Reply rate", value: "9.2%", delta: "+4.1 vs manual" },
    { label: "Open rate", value: "31%", delta: "Week 2" },
    { label: "Meetings", value: "2", delta: "Booked" },
    { label: "In diligence", value: "1", delta: "Data room active" },
  ],
  funnel: [
    { stage: "Sent", value: 48, pct: 100 },
    { stage: "Opened", value: 31, pct: 65 },
    { stage: "Replied", value: 6, pct: 13 },
    { stage: "Meeting", value: 2, pct: 4 },
    { stage: "Diligence", value: 1, pct: 2 },
  ],
  pipeline: [
    {
      stage: "Shortlisted",
      count: 48,
      tone: "muted" as const,
      cards: [] as { firm: string; note: string }[],
    },
    {
      stage: "Contacted",
      count: 48,
      tone: "muted" as const,
      cards: [{ firm: "Index Ventures", note: "Seq step 1 · Thu" }],
    },
    {
      stage: "Replied",
      count: 6,
      tone: "active" as const,
      cards: [
        { firm: "Point Nine", note: "Interested · deck sent" },
        { firm: "First Round", note: "Asked re: ACV" },
      ],
    },
    {
      stage: "Meeting",
      count: 2,
      tone: "gold" as const,
      cards: [{ firm: "Bessemer", note: "Partner call Fri 10a" }],
    },
  ],
  segments: [
    { segment: "B2B SaaS VC", sent: 32, replied: 4, rate: "12.5%" },
    { segment: "Fintech angels", sent: 10, replied: 1, rate: "10%" },
    { segment: "Enterprise seed", sent: 6, replied: 1, rate: "16.7%" },
  ],
  activity: [
    { firm: "Point Nine Capital", event: "Opened pitch deck · slide 4", time: "2h ago", type: "view" as const },
    { firm: "First Round", event: "Replied · asked about ACV expansion", time: "5h ago", type: "reply" as const },
    { firm: "Bessemer", event: "Meeting confirmed · Fri 10:00 AM PT", time: "1d ago", type: "meeting" as const },
    { firm: "Index Ventures", event: "Email opened · 47s read time", time: "1d ago", type: "open" as const },
    { firm: "Sarah Kim (angel)", event: "LinkedIn path found · 2nd degree", time: "2d ago", type: "network" as const },
  ],
  dataRoom: {
    files: [
      { name: "Pitch deck v3.pdf", views: 12, investors: 4, slides: 14 },
      { name: "Financial model.xlsx", views: 3, investors: 2, slides: 0 },
      { name: "Cap table.pdf", views: 1, investors: 1, slides: 0 },
    ],
    permissions: "Per-investor · watermark on",
  },
  dealFocus: {
    firm: "Point Nine Capital",
    partner: "Pawel Chudzinski",
    stage: "Diligence",
    nextStep: "Send customer references by Wed",
    notes: "Strong fit on workflow SaaS thesis. Asked for 3 finance customer refs.",
    tags: ["Lead candidate", "Thesis match", "EU fund"],
  },
} as const;
