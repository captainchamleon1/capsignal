export type ChangelogEntry = {
  date: string;
  title: string;
  type: "feature" | "improvement" | "fix";
  body: string;
};

export const changelog: ChangelogEntry[] = [
  { date: "2026-06-18", title: "LinkedIn sequence builder", type: "feature", body: "Scale tier users can configure LinkedIn touchpoints alongside email sequences in the dashboard." },
  { date: "2026-06-10", title: "Segment-level analytics", type: "feature", body: "Analytics view now breaks reply rates by sector, stage, and geography tags." },
  { date: "2026-06-02", title: "Bulk shortlist actions", type: "improvement", body: "Select multiple investors to exclude, tag, or export in one action." },
  { date: "2026-05-22", title: "Faster score refresh", type: "improvement", body: "Investor activity scores now update every 24 hours, down from 48." },
  { date: "2026-05-14", title: "CSV pipeline export", type: "feature", body: "Export full campaign pipeline with status, scores, and reply history." },
  { date: "2026-05-01", title: "Open-trigger follow-ups", type: "feature", body: "Optional accelerated follow-up when an investor opens but doesn't reply within 48 hours." },
  { date: "2026-04-20", title: "Microsoft 365 support", type: "feature", body: "Inbox connection now supports Microsoft 365 in addition to Google Workspace." },
  { date: "2026-04-08", title: "Weekly report emails", type: "feature", body: "Automated Monday reports with funnel metrics and targeting recommendations." },
  { date: "2026-03-25", title: "Match rationale expansion", type: "improvement", body: "Rationale text now cites specific portfolio companies and investment dates." },
  { date: "2026-03-10", title: "Partner referral portal", type: "feature", body: "Partners can track referred founders and commission status in a private dashboard." },
  { date: "2026-02-28", title: "Deliverability monitoring", type: "improvement", body: "Automatic campaign pause if bounce rate exceeds 3% threshold." },
  { date: "2026-02-15", title: "CapSignal launch", type: "feature", body: "Initial release: investor matching, email sequences, and campaign dashboard." },
];
