"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { guarantee, selfServePricing } from "@/lib/content/guarantee";
import { trackFunnelMilestone } from "@/lib/analytics";
import { logServerMilestone } from "@/lib/analytics/log-server-milestone";
import { GuaranteeLine } from "@/components/ui/guarantee-line";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { data: session } = authClient.useSession();
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
          logServerMilestone("checkout_success", { pagePath: "/checkout/success" });
          if (data.trialing) {
            trackFunnelMilestone("trial_start");
            logServerMilestone("trial_start", { pagePath: "/checkout/success" });
          }
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  const signedIn = Boolean(session?.user);
  const primaryHref = signedIn ? "/onboarding" : "/signup/create?next=/onboarding";
  const primaryLabel = signedIn ? "Set up your workspace" : "Create your account";

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
        {trialing ? "Your trial is live" : "You're in"}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-text-secondary">
        {status === "verified"
          ? trialing
            ? `You're all set for ${selfServePricing.trialDays} days free. ${signedIn ? "Finish workspace setup to unlock verified contacts and launch outreach." : "Create your account to unlock verified contacts and launch outreach."}`
            : signedIn
              ? "Your subscription is active. Finish workspace setup to unlock verified contacts and launch outreach."
              : "Your subscription is active. Create your account to unlock verified contacts and launch outreach."
          : trialing
            ? "Thanks for starting your trial. Your account may take a moment to confirm."
            : "Thanks for subscribing. Payment may take a moment to confirm."}
      </p>
      <GuaranteeLine className="mx-auto mt-4 max-w-md" />
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button
          variant="primary"
          href={primaryHref}
          className="min-h-[48px] w-full bg-brand border-brand hover:bg-brand/90 sm:w-auto"
        >
          {primaryLabel}
        </Button>
        {!signedIn ? (
          <Button variant="secondary" href="/login" className="min-h-[48px] w-full sm:w-auto">
            Sign in
          </Button>
        ) : null}
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
