"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { buildScoringPhases, MATCH_SCAN_MIN_MS } from "@/lib/content/onboarding";
import { INVESTOR_DATABASE_SIZE } from "@/lib/match-display";

const TICKER_FIRMS = [
  "Point Nine Capital",
  "First Round Capital",
  "Index Ventures",
  "Bessemer Venture Partners",
  "Accel Partners",
  "Initialized Capital",
  "Craft Ventures",
  "Unusual Ventures",
  "Boldstart Ventures",
  "Felicis Ventures",
  "Homebrew",
  "Haystack",
  "Sequoia Capital",
  "a16z",
  "Greylock Partners",
  "Lightspeed Venture Partners",
  "Founders Fund",
  "General Catalyst",
  "NEA",
  "Khosla Ventures",
];

type MatchScanLoaderProps = {
  company: string;
  city?: string;
  sector?: string;
  stage?: string;
};

export function MatchScanLoader({ company, city, sector, stage }: MatchScanLoaderProps) {
  const phases = buildScoringPhases(city);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanned, setScanned] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const phaseTimer = window.setInterval(() => {
      setPhaseIndex((i) => Math.min(i + 1, phases.length - 1));
    }, 1650);
    return () => clearInterval(phaseTimer);
  }, [phases.length]);

  useEffect(() => {
    const start = Date.now();
    const duration = MATCH_SCAN_MIN_MS;
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      setScanned(Math.min(INVESTOR_DATABASE_SIZE, Math.round((pct / 100) * INVESTOR_DATABASE_SIZE)));
      if (pct >= 100) clearInterval(tick);
    }, 120);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const ticker = window.setInterval(() => {
      setTickerIndex((i) => (i + 1) % TICKER_FIRMS.length);
    }, 680);
    return () => clearInterval(ticker);
  }, []);

  const profileBits = [company, city, stage, sector].filter(Boolean);

  return (
    <div className="py-8 text-center sm:py-10">
      <div className="relative mx-auto h-16 w-16">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-surface-dark-border border-t-brand-gold [animation-duration:1.4s]" />
        <Sparkles className="absolute inset-0 m-auto h-7 w-7 text-brand-gold" aria-hidden="true" />
      </div>

      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-brand-gold">
        Scanning investor database
      </p>
      <p className="mt-4 text-lg font-semibold text-text-on-dark sm:text-xl">
        Building your ranked shortlist
      </p>

      {profileBits.length > 0 && (
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-on-dark-muted">
          Matching{" "}
          <span className="font-medium text-text-on-dark">{profileBits.join(" · ")}</span>
        </p>
      )}

      <div className="mx-auto mt-8 max-w-sm">
        <div className="h-2 overflow-hidden bg-surface-dark-raised">
          <div
            className="h-full bg-linear-to-r from-brand to-brand-gold transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[11px] tabular-nums text-text-on-dark-muted">
          <span>{scanned.toLocaleString()} scanned</span>
          <span>{INVESTOR_DATABASE_SIZE.toLocaleString()}+ records</span>
        </div>
      </div>

      <p className="mx-auto mt-6 min-h-[3rem] max-w-md px-4 text-[15px] leading-relaxed text-text-on-dark-muted transition-opacity duration-500">
        {phases[phaseIndex]}
      </p>

      <div className="mx-auto mt-6 max-w-md overflow-hidden border border-surface-dark-border bg-surface-dark-raised/50 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-text-on-dark-muted">Live scan</p>
        <p className="mt-1.5 truncate text-sm text-text-on-dark">
          {TICKER_FIRMS[tickerIndex]}
          <span className="ml-2 text-text-on-dark-muted">· thesis · check size · geo</span>
        </p>
      </div>
    </div>
  );
}
