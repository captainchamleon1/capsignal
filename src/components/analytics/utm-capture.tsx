"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { parseUtmFromSearch, storeUtm } from "@/lib/analytics/utm";
import { trackPageView } from "@/lib/analytics";

export function UtmCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const utm = parseUtmFromSearch(searchParams.toString());
    storeUtm(utm);
  }, [searchParams]);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
