export const platformMetrics = [
  {
    label: "Investor records",
    value: "182,000+",
    detail: "Partners, associates, and family office contacts with firm affiliation",
  },
  {
    label: "Signal refresh",
    value: "24h",
    detail: "Deployment and thesis scores recalculated nightly",
  },
  {
    label: "Campaign dataset",
    value: "840+",
    detail: "Active and completed raises informing engagement models",
  },
  {
    label: "Deliverability",
    value: "98.4%",
    detail: "Inbox placement across Google Workspace and M365",
  },
] as const;

export const dataPipeline = [
  {
    stage: "Ingest",
    description: "Fund filings, portfolio announcements, partner moves, and public thesis data",
  },
  {
    stage: "Enrich",
    description: "Behavioral tags: deployment velocity, sector concentration, stage preference",
  },
  {
    stage: "Score",
    description: "Raise-specific match score with natural-language rationale",
  },
  {
    stage: "Feedback",
    description: "Reply and meeting outcomes reweight models for your campaign",
  },
] as const;

export const platformFaqs = [
  {
    q: "Where does investor data come from?",
    a: "Public filings, fund websites, portfolio pages, LinkedIn, and proprietary engagement data from prior CapSignal campaigns. We do not sell your campaign data to third parties.",
  },
  {
    q: "Can I see why an investor was ranked?",
    a: "Yes. Every match includes a rationale citing the signals that drove the score—recent investments, thesis overlap, check size fit, and activity indicators.",
  },
  {
    q: "How is my data handled?",
    a: "Campaign data is encrypted at rest and in transit. See our Security page for infrastructure details, access controls, and retention policy.",
  },
] as const;
