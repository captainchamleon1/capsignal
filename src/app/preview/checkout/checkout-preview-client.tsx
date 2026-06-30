"use client";

import { selfServePricing } from "@/lib/content/guarantee";
import { buildRaiseBrief } from "@/lib/plan/raise-brief";
import { previewRaiseProfile } from "@/lib/preview/raise-profile-sample";
import { UnlockSignalPreview } from "@/components/checkout/unlock-signal-preview";
import { PlanOfferStack } from "@/components/checkout/plan-offer-stack";
import { PlanPricingCard } from "@/components/checkout/plan-pricing-card";
import { PlanCampaignBrief } from "@/components/checkout/plan-campaign-brief";
import { PlanMatchIntel } from "@/components/checkout/plan-match-intel";
import { Container } from "@/components/ui/container";

export function CheckoutPreviewClient() {
  const profile = previewRaiseProfile;
  const brief = buildRaiseBrief(profile);

  return (
    <Container wide className="px-4 py-8 pb-safe sm:px-5 md:py-(--spacing-section-sm)">
      <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-text-secondary -mx-4 sm:-mx-5 mb-8">
        Checkout preview · CTA disabled ·{" "}
        <a href="/preview/plan" className="underline underline-offset-2">
          plan page
        </a>
      </div>

      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
            Secure checkout
          </p>
          <h1 className="display-serif mt-3 text-2xl font-semibold text-text-primary md:text-3xl">
            Confirm your {selfServePricing.trialDays}-day trial
          </h1>
          <p className="mt-3 text-sm font-medium text-text-primary">{brief.headline}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">{brief.subhead}</p>
        </header>

        <div className="mt-8 grid gap-10 xl:grid-cols-[1fr_360px] xl:items-start xl:gap-12">
          <div className="min-w-0 space-y-10">
            <PlanCampaignBrief profile={profile} brief={brief} />
            <PlanMatchIntel profile={profile} brief={brief} />
            <PlanOfferStack profile={profile} compact />
            <UnlockSignalPreview
              company={profile.company}
              stage={profile.stage}
              sector={profile.sector}
              className="xl:hidden"
            />
          </div>

          <aside className="xl:sticky xl:top-20">
            <UnlockSignalPreview
              company={profile.company}
              stage={profile.stage}
              sector={profile.sector}
              className="mb-6 hidden xl:block"
            />
            <PlanPricingCard
              company={profile.company}
              ctaLabel={brief.ctaLabel}
              loading={false}
              onCheckout={() => window.alert("Preview only — checkout disabled.")}
              suffix="Preview mode · Stripe checkout disabled"
            />
          </aside>
        </div>
      </div>
    </Container>
  );
}
