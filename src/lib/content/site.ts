export const siteConfig = {
  name: "CapSignal",
  tagline: "Built to get you investors",
  description:
    "Investor matching and thesis-aware outreach for startup founders — especially AI, B2B SaaS, and Seed–Series B raises. 7-day free trial.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://getcapsignal.com",
  email: "hello@getcapsignal.com",
  supportEmail: "support@getcapsignal.com",
} as const;
