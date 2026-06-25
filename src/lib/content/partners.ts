export const partnerBenefits = [
  {
    title: "Referral commission",
    body: "Earn a fixed percentage on every referred client who signs and launches a campaign. Clear terms, no caps.",
  },
  {
    title: "Zero execution burden",
    body: "CapSignal runs the raise end-to-end—investor mapping, outreach, materials support, tracking, and reporting.",
  },
  {
    title: "White-glove for your founders",
    body: "Your portfolio companies get the same execution quality as a dedicated fundraising advisory firm.",
  },
  {
    title: "Visibility without overhead",
    body: "Private campaign updates and performance recaps so you stay informed without managing the process.",
  },
] as const;

export const partnerServices = [
  "Map and qualify high-fit investors",
  "Personalize outreach using live market signals",
  "Build and refine investor materials",
  "Run multi-week outbound campaigns",
  "Track responses, intros, and conversions",
  "Support post-raise investor relations",
] as const;

export const partnerTypes = [
  { type: "VCs & micro-VCs", detail: "Refer portfolio companies between rounds" },
  { type: "Accelerators", detail: "Demo day follow-on raise support" },
  { type: "Investment banks", detail: "Boutique raise execution" },
  { type: "Advisors & consultants", detail: "Fundraising ops for clients" },
] as const;

export const partnerFaqs = [
  {
    q: "How does the referral commission work?",
    a: "You earn a fixed percentage when a referred founder signs and launches. Commission is tied to CapSignal engagement, not funding outcomes.",
  },
  {
    q: "Do I manage the campaign?",
    a: "No. One intro is enough. CapSignal handles onboarding, execution, and reporting. You receive periodic updates.",
  },
  {
    q: "Can we co-brand materials?",
    a: "Yes. We provide co-branded one-pagers and landing copy for portfolio resources on request.",
  },
] as const;
