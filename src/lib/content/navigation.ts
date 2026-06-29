export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  items?: NavItem[];
};

export const mainNav: NavGroup[] = [
  {
    label: "Product",
    items: [
      { label: "Overview", href: "/product", description: "Matching, outreach, and pipeline" },
      { label: "Investor matching", href: "/product/matching", description: "Live signal scoring" },
      { label: "Outreach sequences", href: "/product/outreach", description: "Per-investor cadence" },
      { label: "Analytics", href: "/product/analytics", description: "Funnel and weekly reports" },
      { label: "Compare", href: "/compare", description: "CapSignal vs alternatives" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { label: "Founders", href: "/founders", description: "Seed through Series B" },
      { label: "AI founders", href: "/for-ai-founders", description: "AI / ML fundraising" },
      { label: "Partners", href: "/partners", description: "Referral program" },
      { label: "AI & ML", href: "/solutions/ai", description: "Infra, vertical AI, agents" },
      { label: "B2B SaaS", href: "/solutions/b2b-saas", description: "Software raises" },
      { label: "Fintech", href: "/solutions/fintech", description: "Financial services" },
      { label: "Deep tech", href: "/solutions/deep-tech", description: "Technical risk" },
      { label: "Climate", href: "/solutions/climate", description: "Energy & climate" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Guides", href: "/resources", description: "Fundraising strategy & outreach" },
      { label: "Answers", href: "/answers", description: "FAQ for founders" },
      { label: "Documentation", href: "/docs", description: "Product help center" },
      { label: "Case studies", href: "/customers", description: "Results from recent raises" },
      { label: "Glossary", href: "/glossary", description: "Fundraising terms" },
      { label: "Changelog", href: "/changelog", description: "Product updates" },
    ],
  },
  {
    label: "Platform",
    href: "/platform",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
];

export const footerNav = {
  Product: [
    { label: "Overview", href: "/product" },
    { label: "Matching", href: "/product/matching" },
    { label: "Outreach", href: "/product/outreach" },
    { label: "Analytics", href: "/product/analytics" },
    { label: "Platform", href: "/platform" },
    { label: "Compare", href: "/compare" },
    { label: "Security", href: "/security" },
  ],
  Solutions: [
    { label: "Founders", href: "/founders" },
    { label: "AI founders", href: "/for-ai-founders" },
    { label: "Partners", href: "/partners" },
    { label: "AI & ML", href: "/solutions/ai" },
    { label: "B2B SaaS", href: "/solutions/b2b-saas" },
    { label: "Fintech", href: "/solutions/fintech" },
    { label: "Deep tech", href: "/solutions/deep-tech" },
    { label: "Climate", href: "/solutions/climate" },
  ],
  Resources: [
    { label: "Guides", href: "/resources" },
    { label: "Answers", href: "/answers" },
    { label: "Documentation", href: "/docs" },
    { label: "Case studies", href: "/customers" },
    { label: "Glossary", href: "/glossary" },
    { label: "Changelog", href: "/changelog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Request access", href: "/request-access" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;

export const allRoutes = [
  "/",
  "/product",
  "/product/matching",
  "/product/outreach",
  "/product/analytics",
  "/platform",
  "/founders",
  "/partners",
  "/pricing",
  "/customers",
  "/compare",
  "/answers",
  "/best-investor-outreach-tool",
  "/capsignal-vs-openvc",
  "/for-ai-founders",
  "/resources",
  "/docs",
  "/glossary",
  "/changelog",
  "/contact",
  "/about",
  "/security",
  "/request-access",
  "/privacy",
  "/terms",
  ...["ai", "b2b-saas", "fintech", "deep-tech", "climate"].map((s) => `/solutions/${s}`),
] as const;
