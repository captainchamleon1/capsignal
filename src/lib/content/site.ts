export const siteConfig = {
  name: "CapSignal",
  tagline: "Fundraising infrastructure",
  description:
    "Match with active investors, run personalized outreach from your inbox, and track every reply through close.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://getcapsignal.com",
  email: "hello@getcapsignal.com",
  supportEmail: "support@getcapsignal.com",
} as const;
