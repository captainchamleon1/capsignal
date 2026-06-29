"use client";

import { Suspense } from "react";
import { UtmCapture } from "@/components/analytics/utm-capture";
import { ScrollTracker } from "@/components/analytics/scroll-tracker";
import { SessionReport } from "@/components/analytics/session-report";

export function AnalyticsCapture() {
  return (
    <>
      <Suspense fallback={null}>
        <UtmCapture />
      </Suspense>
      <ScrollTracker />
      <SessionReport />
    </>
  );
}
