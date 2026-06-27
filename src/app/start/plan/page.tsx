import type { Metadata } from "next";
import { Suspense } from "react";
import { PlanGateClient } from "./plan-gate-client";

export const metadata: Metadata = {
  title: "Choose your plan",
  description: "Your raise profile is complete. Subscribe to unlock verified investor contacts.",
};

export default function StartPlanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-text-tertiary">
          Loading…
        </div>
      }
    >
      <PlanGateClient />
    </Suspense>
  );
}
