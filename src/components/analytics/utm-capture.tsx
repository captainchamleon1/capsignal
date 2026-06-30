"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { parseUtmFromSearch, storeUtm } from "@/lib/analytics/utm";
import { storePaidClickAttribution } from "@/lib/analytics/paid-click";
import { trackPageView } from "@/lib/analytics";

export function UtmCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const utm = parseUtmFromSearch(query);
    storeUtm(utm);
    storePaidClickAttribution(query);
  }, [searchParams]);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
