"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-1 z-[60] h-0.5 w-full bg-brand/20"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-linear-to-r from-brand to-brand-gold transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})`, width: "100%" }}
      />
    </div>
  );
}
