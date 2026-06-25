"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CountUpProps = {
  value: string;
  className?: string;
  duration?: number;
};

function parseStatValue(raw: string): {
  prefix: string;
  target: number;
  suffix: string;
  decimals: number;
} | null {
  const match = raw.match(/^([^0-9]*)([\d,.]+)(.*)$/);
  if (!match) return null;

  const [, prefix, numPart, suffix] = match;
  const normalized = numPart.replace(/,/g, "");
  const decimals = normalized.includes(".") ? (normalized.split(".")[1]?.length ?? 0) : 0;
  const target = Number(normalized);

  if (Number.isNaN(target)) return null;

  return { prefix, target, suffix, decimals };
}

export function CountUp({ value, className, duration = 1400 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const parsed = parseStatValue(value);
    if (!parsed) return;

    const { prefix, target, suffix, decimals } = parsed;
    const start = performance.now();

    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = target * eased;
      setDisplay(
        `${prefix}${current.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`,
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display}
    </span>
  );
}
