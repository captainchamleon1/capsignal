"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { captureInternalBypassFromUrl } from "@/lib/analytics/internal-traffic";
import {
  flushSessionReport,
  initSessionMeta,
  logSessionEvent,
} from "@/lib/analytics/session-log";

function logClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const clickable = target.closest("a, button, [role='button'], input[type='submit']");
  if (!clickable) return;

  const href =
    clickable instanceof HTMLAnchorElement && clickable.href ? clickable.href : undefined;
  const label =
    clickable.getAttribute("data-analytics-id") ??
    clickable.getAttribute("aria-label") ??
    clickable.textContent?.trim().replace(/\s+/g, " ").slice(0, 100) ??
    clickable.tagName.toLowerCase();

  logSessionEvent("click", {
    label,
    href,
    tag: clickable.tagName.toLowerCase(),
  });
}

export function SessionReport() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureInternalBypassFromUrl(searchParams.toString());
  }, [searchParams]);

  useEffect(() => {
    initSessionMeta();

    function onPageHide(event: PageTransitionEvent) {
      if (event.persisted) return;
      flushSessionReport();
    }

    document.addEventListener("click", logClick, true);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      document.removeEventListener("click", logClick, true);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  return null;
}
