export const openvcComparison = {
  title: "Why founders upgrade from free directories",
  subtitle:
    "OpenVC and similar tools give you a list. CapSignal gives you the infrastructure to actually close your round.",
  columns: {
    free: "Free directories (OpenVC, etc.)",
    capsignal: "CapSignal ($99.99/mo)",
  },
  rows: [
    {
      feature: "Pitch sharing",
      free: "Public / unsecured pitch sharing",
      capsignal: "Secure data room with slide-by-slide tracking",
      freeBad: true,
    },
    {
      feature: "Investor updates",
      free: "One-time blast (low response)",
      capsignal: "Automated monthly investor update CRM",
      freeBad: true,
    },
    {
      feature: "Contact quality",
      free: "Outdated / dead investor emails",
      capsignal: "Verified, active founder-investor pathways",
      freeBad: true,
    },
    {
      feature: "Outreach",
      free: "Manual copy-paste from spreadsheets",
      capsignal: "Thesis-aware sequences from your domain",
      freeBad: true,
    },
    {
      feature: "Match scoring",
      free: "Static filters only",
      capsignal: "Live signal scoring refreshed daily",
      freeBad: true,
    },
    {
      feature: "Pipeline tracking",
      free: "None — you track in Notion",
      capsignal: "Full investor CRM through close",
      freeBad: true,
    },
  ],
} as const;
