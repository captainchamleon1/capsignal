import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Subscribe",
  description: "Start your CapSignal subscription and unlock verified investor contacts.",
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-text-tertiary">
          Loading checkout…
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
