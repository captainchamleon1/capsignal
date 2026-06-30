import type { RaiseProfileDraft } from "@/lib/raise-profile";
import { selfServePricing } from "@/lib/content/guarantee";
import { buildRaiseBrief } from "@/lib/plan/raise-brief";
import { UnlockSignalPreview } from "@/components/checkout/unlock-signal-preview";
import { PlanOfferStack } from "@/components/checkout/plan-offer-stack";
import { PlanPricingCard } from "@/components/checkout/plan-pricing-card";
import { PlanCampaignBrief } from "@/components/checkout/plan-campaign-brief";
import { PlanMatchIntel } from "@/components/checkout/plan-match-intel";
import { PlanLaunchTimeline } from "@/components/checkout/plan-launch-timeline";
import { PlanSocialProof } from "@/components/checkout/plan-social-proof";
import { Container } from "@/components/ui/container";

type PlanGateViewProps = {
  profile: RaiseProfileDraft;
  checkoutHref?: string;
  preview?: boolean;
};

export function PlanGateView({ profile, checkoutHref, preview }: PlanGateViewProps) {
  const brief = buildRaiseBrief(profile);

  const checkoutParams = new URLSearchParams({
    plan: selfServePricing.plan,
    ...(profile.stageKey ? { stage: profile.stageKey } : {}),
    ...(profile.sectorKey ? { sector: profile.sectorKey } : {}),
  });

  return (
    <div className="border-b border-border bg-[radial-gradient(ellipse_80%_60%_at_50%_-8%,var(--brand-tint),transparent)]">
      {preview ? (
        <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-text-secondary">
          Design preview · sample raise profile ·{" "}
          <a href="/start/plan" className="underline underline-offset-2">
            live page
          </a>
        </div>
      ) : null}

      <Container wide className="px-4 py-8 pb-safe sm:px-5 md:py-(--spacing-section)">
        <div className="mx-auto max-w-5xl">
          <header className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
              {profile.stage} · {profile.sector}
            </p>
            <h1 className="display-serif mt-4 break-safe text-balance text-[1.65rem] font-semibold leading-[1.2] text-text-primary sm:text-3xl md:text-[2.125rem]">
              {brief.headline}
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-text-secondary md:text-base">
              {brief.subhead}
            </p>
          </header>

          <div className="mt-10 grid gap-10 xl:grid-cols-[1fr_360px] xl:items-start xl:gap-12">
            <div className="min-w-0 space-y-12">
              <PlanCampaignBrief profile={profile} brief={brief} />
              <PlanMatchIntel profile={profile} brief={brief} />
              <PlanLaunchTimeline profile={profile} />
              <PlanOfferStack profile={profile} />
              <PlanSocialProof brief={brief} />
              <UnlockSignalPreview
                company={profile.company}
                city={profile.city}
                stage={profile.stage}
                sector={profile.sector}
                className="xl:hidden"
              />
            </div>

            <aside className="xl:sticky xl:top-20">
              <UnlockSignalPreview
                company={profile.company}
                city={profile.city}
                stage={profile.stage}
                sector={profile.sector}
                className="mb-6 hidden xl:block"
              />
              <PlanPricingCard
                company={profile.company}
                ctaLabel={brief.ctaLabel}
                checkoutHref={checkoutHref ?? `/checkout?${checkoutParams.toString()}`}
              />
            </aside>
          </div>
        </div>
      </Container>
    </div>
  );
}
