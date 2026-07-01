export type DocArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  sections: { heading: string; body: string }[];
};

export const docCategories = [
  { id: "getting-started", label: "Getting started" },
  { id: "campaigns", label: "Campaigns" },
  { id: "outreach", label: "Outreach" },
  { id: "account", label: "Account & billing" },
] as const;

export const coreDocs: DocArticle[] = [
  {
    slug: "quickstart",
    title: "Quickstart guide",
    description: "Launch your first campaign in under a week.",
    category: "getting-started",
    sections: [
      { heading: "1. Submit raise profile", body: "Complete the request access form with stage, sector, traction, target raise, and investor preferences. Our team reviews within one business day." },
      { heading: "2. Kickoff call", body: "30-minute call to align on positioning, timeline, and tier selection. You'll receive onboarding checklist afterward." },
      { heading: "3. Review matches", body: "AI-ranked investor list appears in your dashboard within 3–5 days. Approve, exclude, or request additions before messaging begins." },
      { heading: "4. Approve messaging", body: "Review sample sequences for top investors. Edit tone or facts as needed. Nothing sends until you approve." },
      { heading: "5. Domain setup", body: "We configure SPF/DKIM on your domain and connect to your inbox. Test send confirms deliverability." },
      { heading: "6. Launch", body: "Campaign goes live. Dashboard tracks sends, opens, replies, and meetings in real time." },
    ],
  },
  {
    slug: "raise-profile",
    title: "Raise profile fields",
    description: "What each input affects in matching and messaging.",
    category: "getting-started",
    sections: [
      { heading: "Stage", body: "Pre-seed through Series B. Determines investor universe and messaging tone." },
      { heading: "Sector", body: "Primary and secondary tags. Drives thesis matching and comparable portfolio references." },
      { heading: "Traction metrics", body: "ARR, growth rate, customers, team size. Used in email copy and investor filtering." },
      { heading: "Target raise", body: "Check size range filters investors by typical deployment size." },
      { heading: "Geography", body: "HQ location and target investor geos. Affects timezone send windows." },
    ],
  },
  {
    slug: "investor-scores",
    title: "Understanding match scores",
    description: "How 0–100 scores are calculated and what the rationale means.",
    category: "campaigns",
    sections: [
      { heading: "Score components", body: "Deployment (40%), thesis fit (30%), check size (20%), engagement signals (10%). Weights adjust slightly by sector." },
      { heading: "Rationale text", body: "Each investor row includes human-readable explanation citing specific signals—recent investments, thesis overlap, fund timing." },
      { heading: "Score refresh", body: "Scores recalculate nightly. Material changes (new investment in your space) can shift rankings between review and launch." },
    ],
  },
  {
    slug: "approving-shortlist",
    title: "Reviewing and approving your matches",
    description: "How to exclude investors and request additions.",
    category: "campaigns",
    sections: [
      { heading: "Bulk actions", body: "Select multiple rows to exclude or tag. Excluded investors never receive outreach in this campaign." },
      { heading: "Add investors", body: "Submit names via dashboard or email. We score and add within 24 hours if data is available." },
      { heading: "Approval lock", body: "Once approved, your match pool locks for the initial batch. Additions possible but require re-approval for new messaging." },
    ],
  },
  {
    slug: "sequence-settings",
    title: "Sequence configuration",
    description: "Steps, timing, and follow-up triggers.",
    category: "outreach",
    sections: [
      { heading: "Default cadence", body: "Day 0, 3, 7, 14 unless customized. Scale tier allows per-segment timing." },
      { heading: "Reply detection", body: "Any reply pauses sequence for that investor automatically. You take over the thread." },
      { heading: "Open triggers", body: "Optional: accelerated follow-up if opened but no reply within 48 hours." },
      { heading: "Send windows", body: "Emails send Tue–Thu, 8–10am investor local time by default. Configurable on request." },
    ],
  },
  {
    slug: "email-domain-setup",
    title: "Email domain setup",
    description: "SPF, DKIM, and inbox connection.",
    category: "outreach",
    sections: [
      { heading: "DNS records", body: "We provide SPF and DKIM records to add to your domain registrar. Typically propagates within 24 hours." },
      { heading: "Supported providers", body: "Google Workspace and Microsoft 365. Personal Gmail supported with app passwords; not recommended for volume." },
      { heading: "Deliverability monitoring", body: "Bounce and complaint rates tracked daily. Campaign pauses automatically if thresholds exceeded." },
    ],
  },
  {
    slug: "dashboard-analytics",
    title: "Dashboard and analytics",
    description: "Metrics, exports, and weekly reports.",
    category: "campaigns",
    sections: [
      { heading: "Funnel metrics", body: "Sent, opened, replied, meeting booked—per investor and aggregate." },
      { heading: "Weekly report", body: "Emailed every Monday with conversion summary, top-performing segments, and recommended adjustments." },
      { heading: "Export", body: "CSV export of full pipeline for board decks and internal tracking." },
    ],
  },
  {
    slug: "billing-faq",
    title: "Billing and tiers",
    description: "Payment, upgrades, and refunds.",
    category: "account",
    sections: [
      { heading: "Payment timing", body: "All plans bill monthly on signup. You can cancel anytime from account settings." },
      { heading: "Upgrades", body: "Pay the prorated tier difference anytime. Scope extends immediately." },
      { heading: "Refunds", body: "Full refund if campaign hasn't launched within 14 days of payment. Partial refund case-by-case after launch." },
    ],
  },
];

import { additionalDocs } from "./docs-additional";

export const docs: DocArticle[] = [...coreDocs, ...additionalDocs];

export function getDoc(slug: string) {
  return docs.find((d) => d.slug === slug);
}

export function getDocsByCategory(category: string) {
  return docs.filter((d) => d.category === category);
}
