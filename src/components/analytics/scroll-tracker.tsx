"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackScrollDepth } from "@/lib/analytics";

const DEPTHS = [25, 50, 75, 100] as const;

export function ScrollTracker() {
  const pathname = usePathname();
  const reached = useRef<Set<number>>(new Set());

  useEffect(() => {
    reached.current = new Set();

    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      if (scrollHeight <= 0) return;

      const percent = Math.round((scrollTop / scrollHeight) * 100);

      for (const depth of DEPTHS) {
        if (percent >= depth && !reached.current.has(depth)) {
          reached.current.add(depth);
          trackScrollDepth(depth, pathname);
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
