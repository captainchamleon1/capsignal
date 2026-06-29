"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { selfServePricing } from "@/lib/content/guarantee";
import { trackFunnelMilestone } from "@/lib/analytics";
import { GuaranteeLine } from "@/components/ui/guarantee-line";
import { loadRaiseProfile } from "@/lib/raise-profile";
import { formatInvestorCount } from "@/lib/match-display";
import { UnlockSignalPreview } from "@/components/checkout/unlock-signal-preview";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

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
    const saved = loadRaiseProfile();
    if (!saved?.email) {
      router.replace("/start#apply");
      return;
    }
    setProfile(saved);
    setReady(true);
    trackFunnelMilestone("checkout_view", {
      company: saved.company,
      matchCount: saved.matchCount,
    });
  }, [router]);

  if (!ready || !profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-text-tertiary">
        Loading checkout…
      </div>
    );
  }

  const stageLabel = profile.stage ?? stage?.replace(/_/g, "-");
  const sectorLabel = profile.sector ?? sector?.replace(/_/g, " ");

  async function startCheckout() {
    if (!profile) return;
    setLoading(true);
    setError(null);
    trackFunnelMilestone("checkout_start", { company: profile.company });
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
    <Container narrow className="px-4 py-8 pb-safe sm:px-5 md:py-(--spacing-section-sm)">
      <div className="mx-auto max-w-md">
        <UnlockSignalPreview
          company={profile.company}
          stage={stageLabel}
          sector={sectorLabel}
        />

        <div className="mt-8">
          {profile.matchCount ? (
            <p className="text-center text-sm text-text-secondary">
              <span className="font-medium text-text-primary">
                {formatInvestorCount(profile.matchCount)}
              </span>{" "}
              investors match · unlock the rest
            </p>
          ) : (
            <p className="text-center text-sm text-text-secondary">
              Unlock verified contacts for your ranked shortlist
            </p>
          )}

          <div className="mt-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
              {selfServePricing.trialLabel}
            </p>
            <div className="mt-2 flex items-baseline justify-center gap-2">
              <span className="font-mono text-3xl font-medium tabular-nums text-text-primary">
                $0
              </span>
              <span className="text-sm text-text-tertiary">today</span>
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              then {selfServePricing.priceFull}/mo · cancel anytime
            </p>
          </div>

          {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}

          <Button
            type="button"
            variant="primary"
            className="mt-6 min-h-[52px] w-full bg-brand border-brand text-base hover:bg-brand/90"
            disabled={loading}
            onClick={startCheckout}
          >
            {loading ? "Redirecting to Stripe…" : selfServePricing.cta}
          </Button>

          <GuaranteeLine className="mt-4" suffix="Card required · secure checkout via Stripe" />
        </div>
      </div>
    </Container>
  );
}
