# CapSignal

Signal-driven fundraising infrastructure — full marketing site.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3005](http://localhost:3005) (dev runs on port 3005).

## Site map — 52 pages

### Core
| Route | Description |
|-------|-------------|
| `/` | Home with tabbed product demo, ROI calculator, guides preview |
| `/product` | Product overview with 3 module deep-dives |
| `/product/matching` | Investor matching module |
| `/product/outreach` | Outreach sequences module |
| `/product/analytics` | Analytics module |
| `/platform` | Data pipeline, signal layers, FAQ |
| `/compare` | CapSignal vs manual / CRM / agency |
| `/pricing` | Tiers + feature comparison + FAQ |

### Solutions
| Route | Description |
|-------|-------------|
| `/founders` | Founder benefits, stages, timeline |
| `/partners` | Partner referral program |
| `/solutions/b2b-saas` | B2B SaaS sector page |
| `/solutions/fintech` | Fintech sector page |
| `/solutions/deep-tech` | Deep tech sector page |
| `/solutions/climate` | Climate sector page |

### Resources
| Route | Description |
|-------|-------------|
| `/resources` | 8 fundraising guides (index) |
| `/resources/[slug]` | Full guide articles with related links |
| `/docs` | Help center with sidebar navigation |
| `/docs/[slug]` | 8 documentation articles |
| `/glossary` | 20 fundraising terms |
| `/changelog` | 12 product updates |

### Customers
| Route | Description |
|-------|-------------|
| `/customers` | 6 case studies (index) |
| `/customers/[slug]` | Full case study pages |

### Company
| Route | Description |
|-------|-------------|
| `/about` | Team, principles, timeline |
| `/security` | Encryption, compliance |
| `/contact` | Email + request access form |
| `/request-access` | Lead capture form |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### SEO
- `/sitemap.xml` — auto-generated from all routes
- `/robots.txt`

## Stack

- Next.js 16 (App Router, SSG)
- TypeScript
- Tailwind CSS v4
- Geist typography

## Structure

```
src/
├── app/                    # 52 static routes
├── components/
│   ├── layout/             # Nav, footer, announcement bar, mobile nav
│   ├── sections/           # Home sections + product showcase + ROI calc
│   ├── product/            # Dark UI previews
│   ├── forms/              # Request access form
│   └── ui/                 # Button, tabs, breadcrumbs, pricing cards, etc.
└── lib/content/            # All copy — 14 content modules
```

## Content modules

`src/lib/content/` — edit here to update copy without touching components:

- `site.ts` — brand config
- `navigation.ts` — nav + footer links
- `home.ts` — home page data
- `product.ts` — product modules
- `platform.ts` — platform metrics + pipeline
- `founders.ts` / `partners.ts` — audience pages
- `pricing.ts` — tiers + comparison
- `customers.ts` — 6 case studies
- `resources.ts` — 8 guides
- `docs.ts` — 8 help articles
- `sectors.ts` — 4 sector pages
- `compare.ts` — comparison table
- `glossary.ts` — 20 terms
- `changelog.ts` — product updates
