"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/** Scroll to the mid-page apply CTA when paid traffic lands on /?cta=apply. */
export function HomeAdsEntry() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("cta") !== "apply") return;

    const timer = window.setTimeout(() => {
      const target = document.getElementById("homepage-apply");
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      target?.classList.add("ring-2", "ring-brand/40", "ring-offset-2", "ring-offset-surface-page");
      window.setTimeout(() => {
        target?.classList.remove(
          "ring-2",
          "ring-brand/40",
          "ring-offset-2",
          "ring-offset-surface-page",
        );
      }, 2400);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchParams]);

  return null;
}
