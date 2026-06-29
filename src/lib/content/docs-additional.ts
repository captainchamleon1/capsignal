import type { DocArticle } from "./docs";

export const additionalDocs: DocArticle[] = [
  {
    slug: "ai-founder-onboarding",
    title: "Onboarding for AI founders",
    description: "Raise profile tips for AI infra, vertical AI, and agents.",
    category: "getting-started",
    sections: [
      { heading: "Pick the right sector tag", body: "Select AI/ML and clarify sub-sector in business description — infra, vertical, agents, or dev tools." },
      { heading: "Traction fields", body: "Include inference cost, design partners, model metrics, or ACV depending on layer." },
    ],
  },
  {
    slug: "match-preview",
    title: "Understanding your match preview",
    description: "How to read investor scores before subscribing.",
    category: "getting-started",
    sections: [
      { heading: "Score breakdown", body: "Each investor shows fit score and rationale citing deployment and thesis signals." },
      { heading: "Before checkout", body: "Preview top matches free during raise profile onboarding at /start." },
    ],
  },
  {
    slug: "free-trial",
    title: "7-day free trial",
    description: "What's included during trial and when billing starts.",
    category: "account",
    sections: [
      { heading: "Trial access", body: "Full platform access for 7 days. Card required; billing starts after trial unless cancelled." },
      { heading: "Guarantee", body: "5+ matched investors in 48 hours or refund — see guarantee terms." },
    ],
  },
  {
    slug: "linkedin-sequences",
    title: "LinkedIn outreach sequences",
    description: "When and how LinkedIn touches complement email.",
    category: "outreach",
    sections: [
      { heading: "Timing", body: "LinkedIn follow-up typically day 5–7 if email received no reply and partner is active on platform." },
      { heading: "Copy", body: "Short note referencing email thread — never duplicate full email body." },
    ],
  },
  {
    slug: "data-room-permissions",
    title: "Data room permissions",
    description: "Control who sees which documents.",
    category: "campaigns",
    sections: [
      { heading: "Access levels", body: "Grant view access per investor or stage. Revoke anytime." },
      { heading: "View tracking", body: "See which documents each investor opened and when." },
    ],
  },
  {
    slug: "exclude-investors",
    title: "Excluding investors from outreach",
    description: "Conflicts, prior passes, and existing relationships.",
    category: "campaigns",
    sections: [
      { heading: "When to exclude", body: "Board conflicts, portfolio competitors, prior explicit passes, active conversations off-platform." },
      { heading: "How", body: "Bulk exclude in shortlist review or tag with do-not-contact." },
    ],
  },
  {
    slug: "weekly-reports",
    title: "Weekly campaign reports",
    description: "What's in your Monday report email.",
    category: "campaigns",
    sections: [
      { heading: "Metrics", body: "Sent, opened, replied, meetings — week over week." },
      { heading: "Recommendations", body: "Suggested shortlist and copy adjustments based on performance." },
    ],
  },
  {
    slug: "import-contacts",
    title: "Importing existing investor contacts",
    description: "CSV import and merge with scored shortlist.",
    category: "getting-started",
    sections: [
      { heading: "CSV format", body: "Columns: firm, partner, email, notes, stage. Import from dashboard." },
      { heading: "Deduping", body: "CapSignal merges imports with database records and scores new rows." },
    ],
  },
  {
    slug: "cancel-subscription",
    title: "Cancel or pause subscription",
    description: "Billing and access after cancellation.",
    category: "account",
    sections: [
      { heading: "Cancel", body: "Settings → Billing → Cancel. Access through current period end." },
      { heading: "Data export", body: "Export pipeline CSV before cancel if needed." },
    ],
  },
  {
    slug: "pitch-deck-review",
    title: "Pitch deck review sessions",
    description: "How to schedule included deck reviews.",
    category: "getting-started",
    sections: [
      { heading: "Booking", body: "Schedule from dashboard after onboarding. Two sessions included on CapSignal plan." },
      { heading: "Prep", body: "Share deck 24h before; include target investor list for context." },
    ],
  },
  {
    slug: "api-webhooks",
    title: "Webhooks and integrations",
    description: "Connecting CapSignal to your stack.",
    category: "account",
    sections: [
      { heading: "Lead webhooks", body: "Configure webhook URL for lead and checkout events in environment settings." },
      { heading: "CRM export", body: "Weekly CSV export; native HubSpot integration on roadmap." },
    ],
  },
  {
    slug: "deliverability-troubleshooting",
    title: "Deliverability troubleshooting",
    description: "Bounces, spam folder, and domain reputation.",
    category: "outreach",
    sections: [
      { heading: "Bounce spikes", body: "Campaign auto-pauses. Review list quality and stale emails." },
      { heading: "Spam placement", body: "Verify SPF/DKIM/DMARC. Reduce links and images in cold copy." },
    ],
  },
  {
    slug: "team-seats",
    title: "Adding co-founders to your account",
    description: "Shared pipeline access for founding team.",
    category: "account",
    sections: [
      { heading: "Invite", body: "Settings → Team → Invite by email. Co-founders see pipeline and approve messaging." },
      { heading: "Permissions", body: "Admin vs. viewer roles. Only admins approve campaign launch." },
    ],
  },
  {
    slug: "investor-notes",
    title: "Investor notes and tags",
    description: "Organize pipeline with custom tags.",
    category: "campaigns",
    sections: [
      { heading: "Notes", body: "Per-investor notes sync across team. Timestamped activity log." },
      { heading: "Tags", body: "Custom tags: hot, diligence, passed — filter pipeline views." },
    ],
  },
  {
    slug: "security-overview",
    title: "Security and data handling",
    description: "Encryption, retention, and access controls.",
    category: "account",
    sections: [
      { heading: "Encryption", body: "AES-256 at rest, TLS in transit. See /security for full details." },
      { heading: "Retention", body: "Campaign data deleted on request within 30 days of account closure." },
    ],
  },
];
