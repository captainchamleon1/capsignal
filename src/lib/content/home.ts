export const stats = [
  { value: "11.4%", label: "Median reply rate" },
  { value: "182K", label: "Investor records" },
  { value: "5–7 days", label: "To campaign launch" },
  { value: "3.1×", label: "Faster to first meeting" },
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
    title: "Pipeline & analytics",
    description:
      "Status, replies, and meetings in one view. Weekly reports on what's converting and where to adjust targeting.",
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

export const testimonials = [
  {
    quote:
      "Ten meetings in two weeks. The shortlist was the difference—every firm had deployed in our space within the last two quarters.",
    author: "Sarah Chen",
    title: "CEO, Meridian Labs",
    detail: "Seed · 13.8% reply rate",
    slug: "meridian-labs",
  },
  {
    quote:
      "We closed Series A in eleven weeks. Outreach came from my inbox and investors treated it like a warm intro, not a blast.",
    author: "James Okonkwo",
    title: "Founder, Stackline",
    detail: "Series A · $4.2M",
    slug: "stackline",
  },
] as const;

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
] as const;

export const outcomeScenarios = [
  {
    id: "focused",
    label: "Focused",
    investors: 150,
    manualHours: 113,
    manualReplies: 4,
    manualMeetings: 1,
    capsignalReplies: 17,
    capsignalMeetings: 6,
  },
  {
    id: "typical",
    label: "Typical Seed",
    investors: 250,
    manualHours: 188,
    manualReplies: 6,
    manualMeetings: 2,
    capsignalReplies: 29,
    capsignalMeetings: 10,
  },
  {
    id: "broad",
    label: "Broad",
    investors: 400,
    manualHours: 300,
    manualReplies: 10,
    manualMeetings: 3,
    capsignalReplies: 46,
    capsignalMeetings: 14,
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
