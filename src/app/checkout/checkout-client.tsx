"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { selfServePricing } from "@/lib/content/guarantee";
import { buildRaiseBrief } from "@/lib/plan/raise-brief";
import { trackFunnelMilestone } from "@/lib/analytics";
import { logServerMilestone } from "@/lib/analytics/log-server-milestone";
import {
  keyToSectorLabel,
  keyToStageLabel,
  loadRaiseProfile,
  saveRaiseProfile,
  type RaiseProfileDraft,
} from "@/lib/raise-profile";
import { UnlockSignalPreview } from "@/components/checkout/unlock-signal-preview";
import { PlanOfferStack } from "@/components/checkout/plan-offer-stack";
import { PlanPricingCard } from "@/components/checkout/plan-pricing-card";
import { PlanCampaignBrief } from "@/components/checkout/plan-campaign-brief";
import { PlanMatchIntel } from "@/components/checkout/plan-match-intel";
import { Container } from "@/components/ui/container";

export function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stage = searchParams.get("stage");
  const sector = searchParams.get("sector");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<ReturnType<typeof loadRaiseProfile>>(null);

  useEffect(() => {
    let resolved = loadRaiseProfile();

    // Visitors arriving from lead emails have no wizard session — build a
    // minimal profile from URL params (?email=&name=&company=&stage=&sector=&firms=)
    // so they can reach checkout directly.
    if (!resolved?.email) {
      const emailParam = searchParams.get("email")?.trim();
      if (!emailParam) {
        router.replace("/start#apply");
        return;
      }
      const stageKey = stage ?? undefined;
      const sectorKey = sector ?? undefined;
      const stageLabel =
        (stageKey && keyToStageLabel[stageKey]) ?? stageKey?.replace(/_/g, "-");
      const sectorLabel =
        (sectorKey && keyToSectorLabel[sectorKey]) ?? sectorKey?.replace(/_/g, " ");

      // `firms` carries the exact investors named in the outreach email so the
      // preview on this page matches what the founder was already sent.
      const firmNames = (searchParams.get("firms") ?? "")
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
        .slice(0, 5);
      const topInvestors = firmNames.map((firm, i) => ({
        firm,
        partner: null,
        score: 96 - i * 3,
        reason: [
          "Hand-matched for your raise",
          stageLabel && sectorLabel ? `${stageLabel} · ${sectorLabel}` : stageLabel ?? sectorLabel,
        ]
          .filter(Boolean)
          .join(" — "),
        blurred: i > 0,
      }));

      const fromLink: RaiseProfileDraft = {
        name: searchParams.get("name")?.trim() ?? "",
        email: emailParam,
        company: searchParams.get("company")?.trim() ?? "your company",
        city: "",
        website: "",
        sector: sectorLabel ?? "",
        segment: "",
        businessDescription: "",
        priorFunding: "",
        hadExit: "",
        stage: stageLabel ?? "",
        raise: "",
        traction: "",
        timeline: "",
        priorOutreach: "",
        stageKey,
        sectorKey,
        ...(topInvestors.length > 0 ? { topInvestors } : {}),
        source: "lead_email",
      };
      saveRaiseProfile(fromLink);
      resolved = fromLink;
    }

    setProfile(resolved);
    setReady(true);
    trackFunnelMilestone("checkout_view", {
      company: resolved.company,
      matchCount: resolved.matchCount,
    });
    logServerMilestone("checkout_view", {
      pagePath: "/checkout",
      leadEmail: resolved.email,
      leadName: resolved.name,
      leadCompany: resolved.company,
    });
  }, [router, searchParams, stage, sector]);

  if (!ready || !profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-text-tertiary">
        Loading checkout…
      </div>
    );
  }

  const brief = buildRaiseBrief(profile);
  const stageLabel = profile.stage ?? stage?.replace(/_/g, "-");
  const sectorLabel = profile.sector ?? sector?.replace(/_/g, " ");

  async function startCheckout() {
    if (!profile) return;
    setLoading(true);
    setError(null);
    trackFunnelMilestone("checkout_start", { company: profile.company });
    logServerMilestone("checkout_start", {
      pagePath: "/checkout",
      leadEmail: profile.email,
      leadName: profile.name,
      leadCompany: profile.company,
    });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selfServePricing.plan,
          email: profile.email,
          name: profile.name,
          company: profile.company,
          stage: profile.stageKey ?? stage ?? undefined,
          sector: profile.sectorKey ?? sector ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Checkout unavailable");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <Container wide className="px-4 py-8 pb-safe sm:px-5 md:py-(--spacing-section-sm)">
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
              stage={stageLabel}
              sector={sectorLabel}
              className="xl:hidden"
            />
          </div>

          <aside className="xl:sticky xl:top-20">
            <UnlockSignalPreview
              company={profile.company}
              stage={stageLabel}
              sector={sectorLabel}
              className="mb-6 hidden xl:block"
            />
            {error ? (
              <p className="mb-4 text-center text-sm text-red-600 xl:text-left">{error}</p>
            ) : null}
            <PlanPricingCard
              company={profile.company}
              ctaLabel={brief.ctaLabel}
              loading={loading}
              onCheckout={startCheckout}
              suffix="Card required · secure checkout via Stripe"
            />
          </aside>
        </div>
      </div>
    </Container>
  );
}
