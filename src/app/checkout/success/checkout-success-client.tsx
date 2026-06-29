"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { guarantee, selfServePricing } from "@/lib/content/guarantee";
import { trackFunnelMilestone } from "@/lib/analytics";
import { GuaranteeLine } from "@/components/ui/guarantee-line";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "verified" | "pending" | "error">("loading");
  const [trialing, setTrialing] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus("pending");
      return;
    }

    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        setTrialing(Boolean(data.trialing));
        setStatus(data.ok ? "verified" : "pending");
        if (data.ok) {
          trackFunnelMilestone("checkout_success");
          if (data.trialing) {
            trackFunnelMilestone("trial_start");
          }
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  return (
    <Container narrow className="px-4 py-8 pb-safe text-center md:py-(--spacing-section-sm)">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
        {status === "loading"
          ? "Confirming checkout…"
          : trialing
            ? `${selfServePricing.trialLabel} started`
            : "Payment confirmed"}
      </p>
      <h1 className="display-serif mt-4 text-2xl font-semibold text-text-primary sm:text-3xl">
        {trialing ? "Your trial is live — let's build your shortlist" : "You're in — let's build your shortlist"}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-text-secondary">
        {status === "verified"
          ? trialing
            ? `You're all set for ${selfServePricing.trialDays} days free. Create your account to unlock verified contacts and launch outreach — billing starts after the trial unless you cancel.`
            : "Your subscription is active. Create your account to unlock verified contacts and launch outreach."
          : trialing
            ? "Thanks for starting your trial. Create your account to get started — checkout may take a moment to confirm."
            : "Thanks for subscribing. Create your account to get started — payment may take a moment to confirm."}
      </p>
      <GuaranteeLine className="mx-auto mt-4 max-w-md" />
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button variant="primary" href="/signup" className="min-h-[48px] w-full bg-brand border-brand hover:bg-brand/90 sm:w-auto">
          Create your account
        </Button>
        <Button variant="secondary" href="/onboarding" className="min-h-[48px] w-full sm:w-auto">
          Go to onboarding
        </Button>
      </div>
      <p className="mt-6 text-xs text-text-tertiary">
        Need help? Email{" "}
        <Link href={`mailto:${guarantee.email}`} className="text-text-secondary underline">
          {guarantee.email}
        </Link>
      </p>
    </Container>
  );
}
