"use client";

import { Suspense } from "react";
import { HomeAdsEntry } from "@/components/home/home-ads-entry";

export function HomeAdsEntryWithParams() {
  return (
    <Suspense fallback={null}>
      <HomeAdsEntry />
    </Suspense>
  );
}
