import type { Metadata } from "next";
import { Suspense } from "react";
import { PlanGateClient } from "./plan-gate-client";

export const metadata: Metadata = {
  title: "Choose your plan",
  description:
    "VC funds and angels matched to your raise — outreach, CRM, data room, and deck review. 7-day free trial.",
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
