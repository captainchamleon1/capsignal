"use client";

import { useEffect, useRef } from "react";
import { isPaidClickSession } from "@/lib/analytics/paid-click";

/** Scroll to the wizard and focus the first field for ad traffic on /start. */
export function StartFormFocus() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    if (typeof window === "undefined") return;

    const shouldFocus =
      window.location.hash === "#apply" ||
      window.location.hash === "#apply-form" ||
      isPaidClickSession();

    if (!shouldFocus) return;
    ran.current = true;

    const timer = window.setTimeout(() => {
      const anchor = document.getElementById("apply") ?? document.getElementById("apply-form");
      anchor?.scrollIntoView({ behavior: "smooth", block: "start" });

      window.setTimeout(() => {
        const nameInput = document.getElementById("wiz-name") as HTMLInputElement | null;
        const emailInput = document.getElementById("wiz-email") as HTMLInputElement | null;
        if (nameInput && !nameInput.value.trim()) {
          nameInput.focus({ preventScroll: true });
        } else if (emailInput && !emailInput.value.trim()) {
          emailInput.focus({ preventScroll: true });
        }
      }, 450);
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
