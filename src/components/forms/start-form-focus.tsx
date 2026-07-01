"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll the wizard into view when visitors arrive via #apply links.
 * Step 1 is tap-only (stage + industry), so we never focus a text input —
 * on mobile that would pop the keyboard over the first screen.
 */
export function StartFormFocus() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    if (typeof window === "undefined") return;

    const shouldScroll =
      window.location.hash === "#apply" || window.location.hash === "#apply-form";

    if (!shouldScroll) return;
    ran.current = true;

    const timer = window.setTimeout(() => {
      const anchor = document.getElementById("apply") ?? document.getElementById("apply-form");
      anchor?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
