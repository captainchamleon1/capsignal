import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutSuccessClient } from "@/app/checkout/success/checkout-success-client";

export const metadata: Metadata = {
  title: "Welcome to CapSignal",
  description: "Your subscription is active. Complete onboarding to unlock your investor shortlist.",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-text-tertiary">
          Confirming payment…
        </div>
      }
    >
      <CheckoutSuccessClient />
    </Suspense>
  );
}
