export const compareColumns = [
  { id: "capsignal", label: "CapSignal" },
  { id: "manual", label: "Manual outreach" },
  { id: "crm", label: "Sales CRM" },
  { id: "agency", label: "Fundraising agency" },
] as const;

export const compareFeatures = [
  {
    feature: "Investor targeting method",
    capsignal: "Live signal scoring, daily refresh",
    manual: "Static lists, manual research",
    crm: "Contact database, no scoring",
    agency: "Consultant research, variable quality",
  },
  {
    feature: "Outreach personalization",
    capsignal: "Thesis-aware per investor",
    manual: "Copy-paste, low consistency",
    crm: "Mail merge fields",
    agency: "Human-written, expensive to scale",
  },
  {
    feature: "Send domain",
    capsignal: "Your domain + inbox",
    manual: "Your domain",
    crm: "Often third-party sender",
    agency: "Mixed—sometimes third party",
  },
  {
    feature: "Follow-up automation",
    capsignal: "Engagement-triggered cadence",
    manual: "Manual reminders",
    crm: "Generic sequences",
    agency: "Human follow-up, inconsistent",
  },
  {
    feature: "Time to launch",
    capsignal: "5–7 business days",
    manual: "2–4 weeks",
    crm: "1–2 weeks setup",
    agency: "2–6 weeks onboarding",
  },
  {
    feature: "Cost structure",
    capsignal: "Monthly subscription ($49.99–$299.99/mo)",
    manual: "Founder time (hidden cost)",
    crm: "Monthly SaaS + setup",
    agency: "$10K–$50K+ retainers",
  },
  {
    feature: "Reply rate (median)",
    capsignal: "11.4%",
    manual: "1–3%",
    crm: "2–5%",
    agency: "8–15% (varies widely)",
  },
  {
    feature: "Pipeline analytics",
    capsignal: "Built-in dashboard + weekly reports",
    manual: "Spreadsheet",
    crm: "Sales-focused, not raise-specific",
    agency: "Custom reports, delayed",
  },
  {
    feature: "Scales with volume",
    capsignal: "Yes—same system, more investors",
    manual: "No—linear time cost",
    crm: "Partial",
    agency: "Expensive to extend scope",
  },
] as const;

export const compareVerdicts = [
  {
    title: "Choose CapSignal if",
    items: [
      "You want structured outreach without hiring a fundraising associate",
      "You need investor targeting based on who's deploying now",
      "You want outreach from your inbox with automated follow-up",
      "You're running a Seed or Series A raise with 5–7 days to launch",
    ],
  },
  {
    title: "Manual outreach works if",
    items: [
      "You already have 20+ warm investor relationships",
      "You're raising a small friends-and-family round",
      "You have full-time bandwidth for 3+ months of outreach",
    ],
  },
  {
    title: "An agency makes sense if",
    items: [
      "You're raising $20M+ Series B with complex syndicate needs",
      "You need in-person roadshow coordination across multiple cities",
      "Budget exceeds $30K and you want white-glove human strategy",
    ],
  },
] as const;
