"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { guarantee } from "@/lib/content/guarantee";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "verified" | "pending" | "error">("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("pending");
      return;
    }

    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => setStatus(data.ok ? "verified" : "pending"))
      .catch(() => setStatus("error"));
  }, [sessionId]);

  return (
    <Container narrow className="px-4 py-8 pb-safe text-center md:py-(--spacing-section-sm)">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
        {status === "loading" ? "Confirming payment…" : "Payment confirmed"}
      </p>
      <h1 className="display-serif mt-4 text-2xl font-semibold text-text-primary sm:text-3xl">
        You&apos;re in — let&apos;s build your shortlist
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-text-secondary">
        {status === "verified"
          ? "Your subscription is active. Create your account to unlock verified contacts and launch outreach."
          : "Thanks for subscribing. Create your account to get started — payment may take a moment to confirm."}
      </p>
      <p className="mx-auto mt-4 max-w-md text-xs text-text-tertiary">{guarantee.short}</p>
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
