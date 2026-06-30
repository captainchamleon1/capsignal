/** Site-wide positioning: CapSignal as the new default way to raise. */
export const raiseMovement = {
  eyebrow: "The new way to raise",
  heroHeadline: ["Raise capital.", "AI-native all-in-one platform."],
  heroSubhead:
    "Stop juggling spreadsheets, stale investor lists, and $20K advisor retainers. Match VC funds and angels, run outreach from your inbox, and manage the full pipeline to term sheet — in one system built for raises.",
  oldWay: [
    "Export a CSV from Crunchbase and guess who is deploying",
    "Copy-paste the same email to 200 investors",
    "Lose track of replies across Gmail threads and Notion",
    "Pay a retainer and wait weeks to go live",
  ],
  newWay: [
    "12,000+ investors scored on live deployment and thesis fit",
    "Thesis-aware sequences from your domain — one investor at a time",
    "CRM, data room, and deck review through diligence",
    "Live in days. $99/mo. No success fees.",
  ],
  easePoints: [
    { title: "Know who to contact", body: "Ranked shortlist with rationale — VC funds and angels." },
    { title: "Know what to say", body: "Outreach drafted from your raise profile and their thesis." },
    { title: "Know where you stand", body: "Every reply, meeting, and doc view in one pipeline." },
  ],
  bookCall: {
    title: "Book a call",
    subtitle: "Prefer to talk first? Pick a time — we'll walk through your raise and how CapSignal fits.",
    cta: "Book a call",
    success: "You're on the calendar. We'll confirm by email shortly.",
    duration: "15 minutes · no pitch deck required",
  },
} as const;
