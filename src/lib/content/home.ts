export const stats = [
  { value: "12K+", label: "Investor firms (public datasets)" },
  { value: "3", label: "Licensed open data sources" },
  { value: "Daily", label: "SEC Form ADV refresh" },
  { value: "100%", label: "Source-attributed records" },
] as const;

export const logos = [
  "Initialized",
  "Techstars",
  "Hustle Fund",
  "Precursor",
  "500 Global",
  "Antler",
] as const;

export const capabilities = [
  {
    id: "matching",
    title: "Investor matching",
    description:
      "Daily scores from deployment activity, thesis alignment, and check-size fit. Review the shortlist before anything sends.",
    span: "large" as const,
  },
  {
    id: "outreach",
    title: "Outreach sequences",
    description:
      "Per-investor copy from your raise profile and their public thesis. Follow-ups on a fixed cadence with reply detection.",
    span: "small" as const,
  },
  {
    id: "pipeline",
    title: "Investor CRM",
    description:
      "Every relationship, reply, and meeting in one pipeline. Status tracking, notes, and next steps built for raises—not sales.",
    span: "small" as const,
  },
  {
    id: "dataroom",
    title: "Data room",
    description:
      "Share deck, model, cap table, and legal docs securely. Permission controls and view tracking per investor.",
    span: "small" as const,
  },
] as const;

export const signalLayers = [
  {
    title: "Deployment",
    items: ["Fund closes & re-ups", "Partner hires", "Portfolio follow-ons"],
  },
  {
    title: "Thesis",
    items: ["Sector concentration", "Stage preference shifts", "Geo expansion"],
  },
  {
    title: "Engagement",
    items: ["Reply rates by vertical", "Subject line performance", "Send window data"],
  },
  {
    title: "Network",
    items: ["Mutual connections", "Portfolio founder paths", "Co-investor overlap"],
  },
] as const;

export const workflow = [
  {
    step: "1",
    title: "Raise profile",
    body: "Stage, sector, traction, target check size, and investor preferences.",
  },
  {
    step: "2",
    title: "Shortlist review",
    body: "Ranked investors with scores and rationale. Approve or exclude before launch.",
  },
  {
    step: "3",
    title: "Sequence launch",
    body: "Outreach from your domain. Follow-ups trigger on opens and non-replies.",
  },
  {
    step: "4",
    title: "Weekly iteration",
    body: "Reply and meeting data feeds back into targeting and messaging.",
  },
] as const;

export const testimonials = [] as const;

export const comparisonRows = [
  {
    feature: "Investor targeting",
    manual: "Spreadsheets & Crunchbase",
    crm: "Static contact lists",
    capsignal: "Live signal scoring",
  },
  {
    feature: "Outreach personalization",
    manual: "Copy-paste templates",
    crm: "Mail merge fields",
    capsignal: "Thesis-aware per investor",
  },
  {
    feature: "Follow-up cadence",
    manual: "Manual reminders",
    crm: "Generic sequences",
    capsignal: "Engagement-triggered",
  },
  {
    feature: "Send domain",
    manual: "Personal Gmail",
    crm: "Third-party sender",
    capsignal: "Your domain + inbox",
  },
  {
    feature: "Time to launch",
    manual: "2–4 weeks",
    crm: "1–2 weeks setup",
    capsignal: "5–7 business days",
  },
  {
    feature: "Investor CRM",
    manual: "Spreadsheet tabs",
    crm: "Sales-focused contacts",
    capsignal: "Raise-specific pipeline",
  },
  {
    feature: "Data room",
    manual: "Google Drive links",
    crm: "Not included",
    capsignal: "Built-in with access controls",
  },
] as const;

export const outcomeScenarios = [
  {
    id: "focused",
    label: "Focused",
    investors: 150,
    manualHours: 113,
    manualReplies: 4,
    manualMeetings: 1,
  },
  {
    id: "typical",
    label: "Typical Seed",
    investors: 250,
    manualHours: 188,
    manualReplies: 6,
    manualMeetings: 2,
  },
  {
    id: "broad",
    label: "Broad",
    investors: 400,
    manualHours: 300,
    manualReplies: 10,
    manualMeetings: 3,
  },
] as const;

export const integrations = [
  "Google Workspace",
  "Microsoft 365",
  "LinkedIn Sales Nav",
  "Notion",
  "DocSend",
  "Carta",
] as const;
