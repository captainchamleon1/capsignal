export const platformMetrics = [
  {
    label: "Investor firms",
    value: "12,000+",
    detail: "From SEC IAPD, PE/VC Atlas, and Hugging Face datasets (deduplicated)",
  },
  {
    label: "Data sources",
    value: "3",
    detail: "Public filings and open CSV datasets with license attribution",
  },
  {
    label: "Signal refresh",
    value: "On ingest",
    detail: "Deployment and partner signals computed from recorded investments and people",
  },
  {
    label: "Campaign metrics",
    value: "Your data",
    detail: "Reply and meeting rates come from your outreach — not platform benchmarks",
  },
] as const;

export const dataPipeline = [
  {
    stage: "Ingest",
    description: "SEC Form ADV, PE/VC Atlas, and startup investor CSV datasets",
  },
  {
    stage: "Enrich",
    description: "Partners, investments, and fund data from licensed sources (as available)",
  },
  {
    stage: "Score",
    description: "Raise-specific match score using only source-attributed fields",
  },
  {
    stage: "Feedback",
    description: "Reply and meeting outcomes from your campaigns reweight future targeting",
  },
] as const;

export const platformFaqs = [
  {
    q: "Where does investor data come from?",
    a: "SEC IAPD Form ADV (public), Imergea PE/VC Atlas (CC BY 4.0), and the Hugging Face startup investor dataset (MIT). We attribute every record to its source. Portfolio, partner, and check-size data require additional licensed feeds.",
  },
  {
    q: "Can I see why an investor was ranked?",
    a: "Yes. Every match includes a rationale citing only fields we have from source data — stage, sector, investments on record, and computed signals from that data.",
  },
  {
    q: "How is my data handled?",
    a: "Campaign data is encrypted at rest and in transit. See our Security page for infrastructure details, access controls, and retention policy.",
  },
] as const;
