# CapSignal — Ad Campaign Drafts (Google Ads + Meta)

Launch-ready. Build these in each platform **paused**, confirm tracking is green (see `GO-LIVE.md`), then turn on. All copy is within current character limits. Everything points to **`/start`** (the dedicated landing page; conversion = the Request Access form).

**The offer, for reference:** match with active investors, thesis-aware outreach from your own inbox, every reply tracked. Pre-seed–Series B founders in B2B SaaS, fintech, healthtech, climate, deep tech. From **$49.99/mo, no success fee, cancel anytime.** Proof points: ~11.4% median reply rate, ~10 investor meetings in 14 days, go live same business day.

---

## Budget & ramp (recommendation)

Start small, let conversion data accumulate, then scale what works. Don't switch to automated bidding until each platform has ~15–30 conversions.

| Week | Google Search | Meta | Bidding | Goal |
|------|--------------|------|---------|------|
| 1–2 (learn) | $50/day | $30/day | Manual CPC / Max conversions; Meta lowest-cost | Gather conversion data, kill dead keywords/audiences |
| 3–4 (optimize) | $60–80/day | $40/day | Switch to tCPA / cost cap once ~15–30 conv. | Lower CPL, scale winners |
| 5+ (scale) | scale winners 20%/wk | duplicate winning ad sets | tCPA / cost cap | Hold CPL while growing volume |

Total starting spend ≈ **$80/day (~$2,400/mo)**. A B2B lead like this typically costs **$40–120** per Request Access; expect to spend into the first week before CPL stabilizes. Set a comfortable cap and treat weeks 1–2 as paid learning, not performance.

---

# GOOGLE ADS — Search

**Campaign:** `Search — Founder Fundraising`
**Type:** Search · **Networks:** Google Search only (uncheck Search Partners + Display to start) · **Locations:** US, Canada, UK (add others as desired) · **Language:** English · **Bidding:** Maximize Conversions (cap manual CPC ~$8 first week) → tCPA after data · **Conversion:** while lead volume is low, set **`email_captured`** (fires when a visitor saves contact info at wizard step 2 — wire the dataLayer event to a Google Ads conversion in GTM) as the primary conversion so bidding has signal; once *Request Access* fires ~15+/month, switch primary to *Request Access* and demote `email_captured` to secondary.

Final URL: `https://getcapsignal.com/start` · Final URL suffix: `utm_source=google&utm_medium=cpc&utm_campaign=search_founder&utm_content={creative}` · enable auto-tagging.

### Ad group 1 — Investor outreach tools
Keywords (start phrase/exact, watch search-terms report):
- `"investor outreach tool"` · `"investor outreach software"` · `[automated investor outreach]` · `"cold email investors"` · `"investor email outreach"` · `"reach out to investors"`

### Ad group 2 — Find / match investors
- `"find investors for startup"` · `[how to find investors]` · `"investor database startup"` · `"find angel investors"` · `"match with investors"` · `"investors for my startup"`

### Ad group 3 — Raising a round (high intent)
- `"raise a seed round"` · `"how to raise seed funding"` · `[raise pre-seed]` · `"raising series a"` · `"startup fundraising help"` · `"fundraising for founders"`

### Ad group 4 — Investor CRM / pipeline
- `"investor crm"` · `"fundraising crm"` · `"investor pipeline tracker"` · `"track investor outreach"` · `"fundraising pipeline software"`

### Campaign negative keyword list (apply to all ad groups)
`jobs`, `career`, `salary`, `internship`, `become an investor`, `how to invest`, `stock`, `crypto`, `real estate`, `free`, `grant`, `loan`, `scholarship`, `nonprofit`, `mutual fund`, `day trading`, `course`, `udemy`, `meaning`, `definition`, `intern`

### Responsive Search Ad — assets (reused across ad groups; pin nothing at first, let Google rotate)

**Headlines (≤30 chars each — provide 12–15):**
1. Find Investors, Faster
2. Investor Outreach on Autopilot
3. Stop Cold-Emailing Blindly
4. Meet Active Investors
5. Thesis-Aware Investor Outreach
6. 10 Investor Meetings, 14 Days
7. From Your Inbox, Not a CRM
8. Raise Without the Grind
9. Matched to Active Investors
10. Sent From Your Domain
11. No Success Fees, Ever
12. Plans From $49.99/mo
13. Go Live Same Business Day
14. Built for Pre-Seed–Series A
15. Track Every Investor Reply

**Descriptions (≤90 chars each — provide 4):**
1. We score active investors in your space and run personalized outreach from your inbox.
2. Thesis-aware sequences, automated follow-up, every reply tracked. From $49.99/mo.
3. Pre-seed to Series B in SaaS, fintech, climate, deep tech. No success fee, cancel anytime.
4. Approve your matches, launch in days, book meetings — not months of spreadsheets.

**Sitelinks:**
- *How it works* → `/product` · *Pricing* → `/pricing` · *Case studies* → `/customers` · *For founders* → `/founders`

**Callouts:** `No success fee` · `Send from your domain` · `Go live same business day` · `Cancel anytime` · `Reply tracking` · `Founder-built`

**Structured snippet** (Header: *Services*): Investor matching, Personalized outreach, Follow-up automation, Reply tracking, Pitch review

---

# META — Facebook / Instagram

**Campaign:** `CapSignal — Leads` · **Objective:** **Leads** (optimize for website **Lead** event — already firing) · **Conversion location:** Website · **Attribution:** 7-day click / 1-day view.

> Note: founder/CEO targeting is hard on Meta (weaker B2B job-title data than LinkedIn). Lean on **interests + lookalikes**, then let **Advantage+ audience** expand once the pixel learns. Use the retargeting set as soon as you have site traffic.

### Ad set A — Interests (cold prospecting)
- **Detailed targeting (interests/behaviors):** Startup company, Entrepreneurship, Venture capital, Y Combinator, AngelList, Crunchbase, TechCrunch, Seed money, Angel investor, Software as a service, Startup accelerator
- **Optional narrowing — job titles:** Founder, Co-Founder, CEO, Chief Executive Officer (apply as a *narrow*, not primary, given thin data)
- **Geo:** US/CA/UK · **Age:** 25–55 · **Budget:** $15/day

### Ad set B — Lookalike (turn on after ~50–100 leads)
- **1% Lookalike** of your Leads custom audience (built from pixel `Lead` events) · **Geo:** US · **Budget:** $15/day

### Ad set C — Retargeting (turn on once site has traffic)
- **Custom audiences:** all site visitors (180d), `/pricing` viewers, `/start` visitors who did **not** submit Lead (ViewContent/PageView minus Lead)
- **Budget:** $10/day · expect the cheapest leads here.

### Creative — primary text / headline / description (make 3 variants per ad set)

**Variant 1 — Pain/relief**
- *Primary text:* Still copy-pasting investors into a spreadsheet? CapSignal scores active investors in your space and runs personalized outreach from your own inbox — so you book meetings, not busywork. From $49.99/mo, no success fee.
- *Headline:* 10 investor meetings in 14 days
- *Description:* Go live same business day. Cancel anytime.
- *CTA:* Sign Up

**Variant 2 — Proof/outcome**
- *Primary text:* Founders using CapSignal see ~11% reply rates from investors — because outreach is thesis-aware and sent from your domain, not a generic blast. Approve your matches, we launch the campaign, you track every reply.
- *Headline:* Outreach that actually gets replies
- *Description:* From $49.99/mo. No success fee.
- *CTA:* Learn More

**Variant 3 — Direct/offer**
- *Primary text:* Raising pre-seed to Series A? Get matched to investors actively writing checks in your space, with personalized sequences and reply tracking built in. No success fees. Plans from $49.99/mo.
- *Headline:* Fundraising outreach, done right
- *Description:* SaaS · Fintech · Climate · Deep tech
- *CTA:* Sign Up

**Destination URL (all ads):**
`https://getcapsignal.com/start?utm_source=meta&utm_medium=paid_social&utm_campaign=leads_prospecting&utm_content={{ad.name}}`

### Creative assets (images/video) — you'll need visuals
No ad images exist in the repo yet. Three concepts that fit the brand (clean, editorial, off-white + serif headline, single brand accent):
1. **Dashboard crop** — a screenshot of the product's investor-match/reply view with one bold stat overlaid ("11.4% reply rate"). Highest-performing format for B2B SaaS.
2. **Text-forward** — off-white background, big serif line "Ten investor meetings. Two weeks." + small CapSignal logo. Cheap to make, scroll-stopping.
3. **Before/after** — "Spreadsheet of 400 investors" struck through vs. "10 booked meetings." Speaks straight to the pain.

Run square (1:1) for feed + vertical (9:16) for Stories/Reels. **I can generate these images for you on request** — just say the word and which concept(s).

---

## After launch — what to watch (first 2 weeks)

- **Google:** check the **Search Terms report** every 2–3 days; add junk as negatives, promote strong terms to exact. Pause keywords with >$60 spend and 0 conversions.
- **Meta:** don't touch ad sets for 3–4 days (learning phase). Kill any ad below a ~0.8% CTR. Scale winners by duplicating, not by big budget jumps.
- **Both:** CPL (cost per Request Access) is the number that matters, not clicks. Watch lead quality in your webhook inbox — tighten targeting if leads are off-ICP (wrong stage/sector).
- **Attribution:** every lead carries its UTM, so you'll see exactly which campaign/ad converted in your lead data.
