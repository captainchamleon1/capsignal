export type GuideSection = {
  heading: string;
  body: string;
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  published: string;
  sections: GuideSection[];
};

export const guideCategories = [
  "Fundraising strategy",
  "Outreach",
  "Investor relations",
  "Data & targeting",
] as const;

export const coreGuides: Guide[] = [
  {
    slug: "investor-outreach-that-gets-replies",
    title: "Investor outreach that gets replies",
    description: "Why generic templates fail and what thesis-aware messaging looks like in practice.",
    category: "Outreach",
    readTime: "8 min",
    published: "2026-05-12",
    sections: [
      {
        heading: "The reply rate problem",
        body: "Most founder outreach sits between 1–3% reply rate. Investors receive hundreds of pitches monthly. The emails that break through reference something specific: a recent investment, a portfolio company overlap, or a thesis shift the firm publicly stated.",
      },
      {
        heading: "What thesis-aware copy looks like",
        body: "Instead of 'We're building X for Y market,' effective outreach opens with context: 'Saw your follow-on in RelayDB last month—we're building the orchestration layer upstream from that stack.' The investor knows you did homework before asking for time.",
      },
      {
        heading: "Cadence matters as much as copy",
        body: "Single emails rarely convert. A three-step cadence—initial outreach, value-add follow-up, final touch—outperforms one-shot emails by 4× on meeting conversion. Timing between steps should account for open signals: if they opened but didn't reply, the follow-up references that implicitly.",
      },
      {
        heading: "Send from your domain",
        body: "Investors reply differently to founder@company.com versus a third-party sending tool. Domain reputation, SPF/DKIM configuration, and send volume throttling all affect deliverability. CapSignal sends from your inbox so replies land where you can respond immediately.",
      },
    ],
  },
  {
    slug: "how-to-build-an-investor-shortlist",
    title: "How to build an investor match list that converts",
    description: "Ranking investors by deployment activity, not database size.",
    category: "Data & targeting",
    readTime: "10 min",
    published: "2026-04-28",
    sections: [
      {
        heading: "Static lists go stale fast",
        body: "A CSV of 500 VCs exported from a database tells you who exists—not who is deploying in your sector right now. Partner moves, fund closes, and portfolio follow-ons change investor appetite weekly.",
      },
      {
        heading: "Four signals that predict fit",
        body: "Deployment velocity (recent investments in your space), thesis alignment (sector and stage concentration), check size fit (fund size vs. your target raise), and engagement history (reply patterns from comparable campaigns). Weight these together—not any single factor alone.",
      },
      {
        heading: "Quality over quantity",
        body: "240 well-scored investors outperform 800 spray-and-pray contacts. CapSignal campaigns typically target 200–500 investors depending on tier, with every row reviewed before launch.",
      },
      {
        heading: "The exclude list is as important as the include list",
        body: "Existing relationships, prior rejections, and conflict investors should be flagged before anything sends. A match pool you trust is one you've edited—not one you imported blindly.",
      },
    ],
  },
  {
    slug: "seed-round-timeline",
    title: "The realistic Seed round timeline",
    description: "Week-by-week expectations from first outreach to term sheet.",
    category: "Fundraising strategy",
    readTime: "12 min",
    published: "2026-03-15",
    sections: [
      {
        heading: "Weeks 1–2: Pipeline build",
        body: "Raise profile, AI-matched investors, messaging approval, domain setup. Most founders underestimate this prep phase. Rushing to send before copy is approved creates rework when replies start coming.",
      },
      {
        heading: "Weeks 3–4: First conversations",
        body: "Initial outreach batch goes out. Reply rate peaks in days 3–10. First meetings typically book in this window. Founders should protect calendar capacity—ten intro calls in two weeks is a full-time job alongside running the company.",
      },
      {
        heading: "Weeks 5–8: Momentum and follow-through",
        body: "Second and third sequence steps reach investors who didn't reply initially. Warm intros from early meetings accelerate the pipeline. Weekly targeting adjustments based on who's converting.",
      },
      {
        heading: "Weeks 9–12: Close or extend",
        body: "Most Seed rounds that close do so within 10–14 weeks of first outreach. If you're past week 12 without a lead, revisit positioning and match quality before increasing volume.",
      },
    ],
  },
  {
    slug: "follow-up-cadence-playbook",
    title: "The follow-up cadence playbook",
    description: "When to follow up, what to say, and when to stop.",
    category: "Outreach",
    readTime: "6 min",
    published: "2026-05-01",
    sections: [
      {
        heading: "Day 0: Initial outreach",
        body: "Lead with thesis context and a clear ask—15 minutes, not 'would love to connect.' Include traction in one line. Keep under 150 words.",
      },
      {
        heading: "Day 3: First follow-up",
        body: "Only if no reply. Add new information—a customer win, metric update, or relevant news—not 'just bumping this.' If they opened the first email, acknowledge the space without being creepy.",
      },
      {
        heading: "Day 7: Second follow-up",
        body: "Shorter. One paragraph. Different angle on why this fits their portfolio. Some founders share a one-pager link here.",
      },
      {
        heading: "Day 14: Final touch",
        body: "Graceful close. 'I'll assume timing isn't right—happy to reconnect if your thesis shifts.' This often triggers replies from investors who were busy, not uninterested.",
      },
    ],
  },
  {
    slug: "data-room-before-outreach",
    title: "What to prepare before investor outreach",
    description: "Materials you need ready before the first email sends.",
    category: "Fundraising strategy",
    readTime: "7 min",
    published: "2026-02-20",
    sections: [
      {
        heading: "Minimum viable data room",
        body: "Pitch deck (10–15 slides), one-pager, financial model summary, cap table, and incorporation docs. You don't need everything perfect—但 you need enough that a interested investor can diligence without waiting weeks.",
      },
      {
        heading: "Deck vs. email",
        body: "Don't attach the deck to cold outreach. The email earns the meeting; the deck supports the meeting. Attachments hurt deliverability and signal mass blast.",
      },
      {
        heading: "Raise profile inputs",
        body: "Stage, sector, target amount, current traction metrics, use of funds, and investor preferences (geo, check size, strategic vs. financial). This becomes the input layer for matching and messaging.",
      },
    ],
  },
  {
    slug: "post-meeting-investor-tracking",
    title: "Tracking investors after the first meeting",
    description: "Pipeline hygiene from intro call through term sheet.",
    category: "Investor relations",
    readTime: "9 min",
    published: "2026-01-10",
    sections: [
      {
        heading: "Status taxonomy",
        body: "Use consistent stages: Contacted → Replied → Meeting scheduled → Meeting held → Diligence → Term sheet → Closed. Ambiguous statuses like 'interested' create pipeline fiction.",
      },
      {
        heading: "Follow-up after meetings",
        body: "Send recap within 24 hours. Include answers to questions raised, requested materials, and clear next step. Investors running multiple processes prioritize founders who are organized.",
      },
      {
        heading: "Weekly pipeline review",
        body: "Every week: who's stalled, who needs a nudge, who's in diligence, who passed and why. Pass reasons feed back into targeting for the next batch.",
      },
    ],
  },
  {
    slug: "linkedin-vs-email-outreach",
    title: "LinkedIn vs. email for investor outreach",
    description: "When each channel works and how to combine them.",
    category: "Outreach",
    readTime: "5 min",
    published: "2026-04-10",
    sections: [
      {
        heading: "Email is the primary channel",
        body: "Most investment decisions still start in inbox. Email allows longer context, attachments when appropriate, and thread history. CapSignal Launch tier is email-only; Scale adds LinkedIn.",
      },
      {
        heading: "LinkedIn for partners who are active",
        body: "Connection request plus short note works for partners who post frequently and engage on the platform. Don't duplicate email copy—reference the email thread if they received one.",
      },
      {
        heading: "Sequence order",
        body: "Email first, LinkedIn day 5–7 if no reply and the partner is active on LinkedIn. Never both on the same day—it feels like surround-sound spam.",
      },
    ],
  },
  {
    slug: "reading-investor-signals",
    title: "How to read investor deployment signals",
    description: "Public data points that indicate an investor is active in your space.",
    category: "Data & targeting",
    readTime: "11 min",
    published: "2026-03-01",
    sections: [
      {
        heading: "Portfolio follow-ons",
        body: "A follow-on investment signals conviction in a sector and often precedes new investments in adjacent companies. Track follow-ons in your category within the last 6 months.",
      },
      {
        heading: "Partner hires and promotions",
        body: "New partners often deploy quickly to establish track record. A new B2B partner at a Seed fund is a stronger signal than a generalist partner who hasn't invested in 18 months.",
      },
      {
        heading: "Fund close announcements",
        body: "Fresh capital means deployment pressure. Funds in year 1–3 of a new vehicle are actively writing checks. Funds in year 5+ may be selective or raising their next fund.",
      },
      {
        heading: "Thesis page changes",
        body: "When a firm updates their website to emphasize a sector, they're signaling LP and founders where capital is going. Compare current thesis language to archived versions.",
      },
    ],
  },
];

import { additionalGuides } from "./guides-additional";

/** Full guide catalog (core + extended). */
export const guides: Guide[] = [...coreGuides, ...additionalGuides];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
