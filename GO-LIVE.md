# CapSignal — Go-Live Runbook

Domain: **`getcapsignal.com`** (purchased via Vercel). Steps marked **[you]** need your login or a click; **[done]** is handled in the codebase.

---

## 1. Domain — `getcapsignal.com` ✅ purchased

Bought through Vercel Domains ($11.25/yr, autorenew on). Because it's a Vercel-registered domain, DNS is managed by Vercel automatically — no records to copy by hand.

---

## 2. Deploy live on Vercel

The repo is linked to the Vercel project `capsignal` (`.vercel/project.json`). Build verified (TypeScript clean; Next 16 SSG, 52 static routes).

**[you] — from the repo root:**
```bash
npm i -g vercel        # if not installed
vercel login
vercel --prod          # builds + deploys to production
```
Or push to the connected Git branch and Vercel auto-deploys.

---

## 3. Attach the domain to the project

**[you] In Vercel → project `capsignal` → Settings → Domains:** add `getcapsignal.com` and `www.getcapsignal.com`. Since the domain is already in your Vercel account, it attaches in one click and SSL provisions automatically (minutes). No external DNS to edit.

**Email deliverability (before sending outreach):** give `hello@getcapsignal.com` SPF + DMARC records so confirmation emails don't spam-folder. Set up later via Google Workspace / Fastmail.

---

## 4. Set environment variables in Vercel

**[you] In Vercel → Settings → Environment Variables.** All are `NEXT_PUBLIC_*` (build-time) — **redeploy after setting.**

| Variable | Value | Source |
|----------|-------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://getcapsignal.com` | **[done]** now the default |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` | Step 4b |
| `STRIPE_PRICE_CAPSIGNAL` | `price_...` | Step 4b |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Step 4c |
| `BETTER_AUTH_SECRET` | random 32+ chars | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | `https://getcapsignal.com` | same as site URL |
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` | Step 5 |
| `NEXT_PUBLIC_META_PIXEL_ID` | `1234567890` | Step 6 |
| `LEAD_WEBHOOK_URL` | your Zapier/Slack/Formspree URL | so leads reach your inbox |
| `RESEND_API_KEY` | `re_...` | lead emails + visitor session reports (same key) |

**Stripe (Step 4b):** In [Stripe Dashboard](https://dashboard.stripe.com) → **Product catalog** → add product **CapSignal** at **$99.99/month** recurring. Copy the **Price ID** (`price_...`) into `STRIPE_PRICE_CAPSIGNAL`. Copy **Secret key** from Developers → API keys into `STRIPE_SECRET_KEY`. Use **test keys** first (`sk_test_`, test mode price); switch to live when ready.

**Stripe webhook (Step 4c — recommended):** Developers → **Webhooks** → **Add endpoint** → URL `https://getcapsignal.com/api/stripe/webhook` (or your Vercel URL while testing). Events: `checkout.session.completed`. Copy the **Signing secret** (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`. Successful checkouts also post to `LEAD_WEBHOOK_URL` if set (type `stripe_checkout_completed`).

**Test checkout:** `/start` → complete profile → plan → checkout. Card `4242 4242 4242 4242`, any future expiry, any CVC. Success lands on `/checkout/success`.

**Redeploy after changing any env var.**

**Lead routing:** `/api/leads` forwards to `LEAD_WEBHOOK_URL`. Quickest path — Zapier "Catch Hook" → Gmail/Slack, paste the hook URL here. **Until this is set, form submissions succeed but the lead only goes to server logs — you won't receive it.**

---

## 5. Google Ads conversion tracking (via GTM)

Site already pushes a `generate_lead` event to `dataLayer` on form submit — **[done]**.

**[you]:**
1. Create a **GTM** container → put `GTM-XXXXXXX` in `NEXT_PUBLIC_GTM_ID`.
2. **Google Ads → Goals → Conversions** → new action *Request Access*, category **Submit lead form**, count **One**. Note Conversion ID + Label.
3. In GTM add: **Google Ads Conversion Linker** (trigger: All Pages) + **Google Ads Conversion Tracking** (your ID/label, trigger: Custom Event where event = `generate_lead`).
4. Publish. Verify with GTM Preview + a test submit on `/start`.

---

## 6. Meta Pixel tracking

Site fires `fbq('track', 'Lead')` on submit and `PageView` on load — **[done]**.

**[you]:**
1. **Meta Events Manager → Connect data source → Web → Meta Pixel.** Copy the numeric ID into `NEXT_PUBLIC_META_PIXEL_ID`.
2. Redeploy. Open `getcapsignal.com/start`, submit a test lead.
3. In Events Manager → **Test Events**, confirm `PageView` + `Lead` arrive.

---

## 7. UTM attribution (already wired) — **[done]**

`/start` captures UTM params and attaches them to every lead. Ad destination URLs:
```
https://getcapsignal.com/start?utm_source=google&utm_medium=cpc&utm_campaign={campaign}&utm_content={creative}
https://getcapsignal.com/start?utm_source=meta&utm_medium=paid_social&utm_campaign={campaign}&utm_content={creative}
```

---

## 8. Visitor analytics — friction & conversion — **[done in code]**

The site logs every page view, click, scroll milestone, and funnel step during a visit. When the visitor **closes the tab or leaves the site**, a full session report is emailed via **Resend**.

### What you get

| Signal | Where to see it |
|--------|-----------------|
| **End-of-session email** | Same `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` as leads — full event timeline when they close the tab |
| **Clicks & scroll heatmaps** | [Microsoft Clarity](https://clarity.microsoft.com) (free) → `NEXT_PUBLIC_CLARITY_ID` |
| **Funnel drop-off** | GTM → GA4, or read the session emails |
| **Session recordings** | Clarity — watch exactly where users stall |

### Events logged (and included in the email)

| Event | When |
|-------|------|
| `session_start` | Tab opened |
| `page_view` | Every route change |
| `click` | Any link or button click |
| `scroll_depth` | 25 / 50 / 75 / 100% on each page |
| `funnel_step_view` | Onboarding wizard step shown (steps 1–6) |
| `funnel_step_complete` | User clicks Continue on a wizard step |
| `funnel_milestone` | `match_scan_start`, `match_preview_open`, `plan_view`, `checkout_view`, `checkout_start`, `checkout_success`, `trial_start` |
| `generate_lead` | Profile submitted (existing) |

Email subject line summarizes how far they got, e.g. `Visitor session — Saw investor matches (/start)`.

### Setup (≈10 min)

**[you]:**

1. **Already wired:** Visitor reports use your existing `RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL` — same inbox as leads. Deploy latest `master`, then test.

2. **Test:** Incognito → browse the site → **close the tab** (not just navigate away within the site). One email with the full event log should arrive within seconds.

3. **Clarity (optional):** clarity.microsoft.com → Project ID → `NEXT_PUBLIC_CLARITY_ID` for heatmaps and recordings.

4. **Find friction:** Sort emails by subject — sessions that stop at `Onboarding step 3/6` or `Viewed plan` without checkout are your drop-off points. Cross-check with Clarity recordings.

---

## Go-live checklist

- [x] `getcapsignal.com` registered
- [ ] `vercel --prod` deployed **[you]**
- [ ] Domain + `www` attached in Vercel, SSL green **[you]**
- [ ] `LEAD_WEBHOOK_URL` set → test submit reaches you **[you]**
- [ ] GTM live, `generate_lead` → Google Ads conversion verified **[you]**
- [ ] Meta Pixel `Lead` event verified in Test Events **[you]**
- [ ] `STRIPE_SECRET_KEY` + `STRIPE_PRICE_CAPSIGNAL` set → test checkout on `/checkout` **[you]**
- [ ] `STRIPE_WEBHOOK_SECRET` set → webhook shows 200 in Stripe dashboard **[you]**
- [ ] `BETTER_AUTH_SECRET` set **[you]**
- [ ] Campaigns built per `AD-CAMPAIGNS.md`, paused, ready to launch **[you]**
