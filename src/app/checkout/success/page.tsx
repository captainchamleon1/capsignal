import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { guarantee } from "@/lib/content/guarantee";

export const metadata: Metadata = {
  title: "Welcome to CapSignal",
  description: "Your subscription is active. Complete onboarding to unlock your investor shortlist.",
};

export default function CheckoutSuccessPage() {
  return (
    <Container narrow className="py-(--spacing-section-sm) text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">Payment confirmed</p>
      <h1 className="display-serif mt-4 text-3xl font-semibold text-text-primary">
        You&apos;re in — let&apos;s build your shortlist
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-text-secondary">
        Your subscription is active. Complete onboarding to unlock verified contacts, launch outreach,
        and track every investor through close.
      </p>
      <p className="mx-auto mt-4 max-w-md text-xs text-text-tertiary">{guarantee.short}</p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button variant="primary" href="/signup" className="bg-brand border-brand hover:bg-brand/90">
          Create your account
        </Button>
        <Button variant="secondary" href="/onboarding">
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
