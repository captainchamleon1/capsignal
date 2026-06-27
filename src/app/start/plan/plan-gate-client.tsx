"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { guarantee, selfServePricing } from "@/lib/content/guarantee";
import { capsignalPlan } from "@/lib/content/pricing";
import { loadRaiseProfile, type RaiseProfileDraft } from "@/lib/raise-profile";
import { formatInvestorCount } from "@/lib/match-display";
import { UnlockSignalPreview } from "@/components/checkout/unlock-signal-preview";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function PlanGateClient() {
  const router = useRouter();
  const [profile, setProfile] = useState<RaiseProfileDraft | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = loadRaiseProfile();
    if (!saved?.email || !saved?.company) {
      router.replace("/start#apply");
      return;
    }
    setProfile(saved);
    setReady(true);
  }, [router]);

  if (!ready || !profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
        <p className="text-sm text-text-tertiary">Loading your raise profile…</p>
      </div>
    );
  }

  const checkoutParams = new URLSearchParams({
    plan: selfServePricing.plan,
    ...(profile.stageKey ? { stage: profile.stageKey } : {}),
    ...(profile.sectorKey ? { sector: profile.sectorKey } : {}),
  });

  return (
    <div className="border-b border-border bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--brand-tint),transparent)]">
      <Container wide className="px-4 py-8 pb-safe sm:px-5 md:py-(--spacing-section-sm)">
        <div className="mx-auto max-w-lg">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
              Profile scored
            </p>
            <h1 className="display-serif mt-3 text-2xl font-semibold text-text-primary md:text-3xl">
              {profile.company}
            </h1>
            {profile.matchCount ? (
              <p className="mt-3 text-[15px] text-text-secondary">
                <span className="font-medium text-text-primary">
                  {formatInvestorCount(profile.matchCount)}
                </span>{" "}
                investors match · your top picks are ready
              </p>
            ) : (
              <p className="mt-3 text-[15px] text-text-secondary">
                Your shortlist is ready to unlock
              </p>
            )}
          </div>

          <div className="mt-8">
            <UnlockSignalPreview
              company={profile.company}
              stage={profile.stage}
              sector={profile.sector}
            />
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-baseline justify-center gap-2">
              <span className="font-mono text-3xl font-medium tabular-nums text-text-primary">
                {capsignalPlan.price}
              </span>
              <span className="text-sm text-text-tertiary">/mo</span>
            </div>
            <p className="mt-1 text-xs text-text-tertiary">Cancel anytime</p>

            <Button
              variant="primary"
              href={`/checkout?${checkoutParams.toString()}`}
              className="mt-6 h-12 w-full bg-brand border-brand text-base hover:bg-brand/90"
            >
              {selfServePricing.cta}
            </Button>

            <p className="mt-4 text-[11px] leading-relaxed text-text-tertiary">
              {guarantee.short}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
