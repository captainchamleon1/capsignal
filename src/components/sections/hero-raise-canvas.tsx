"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { heroPipeline } from "@/lib/content/hero";

const phaseIds = heroPipeline.phases.map((p) => p.id);

export function HeroRaiseCanvas() {
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePhase((i) => (i + 1) % phaseIds.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Registration marks — editorial / print feel */}
      <span
        className="pointer-events-none absolute -left-1 -top-1 h-3 w-3 border-l border-t border-text-tertiary/40"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -right-1 -top-1 h-3 w-3 border-r border-t border-text-tertiary/40"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-text-tertiary/40"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-text-tertiary/40"
        aria-hidden="true"
      />

      <div className="overflow-hidden border border-surface-dark-border bg-surface-dark shadow-[0_24px_80px_-32px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between gap-2 border-b border-surface-dark-border px-4 py-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-gold">
              {heroPipeline.label}
            </p>
            <p className="mt-0.5 font-mono text-[9px] text-text-on-dark-muted">{heroPipeline.status}</p>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-text-on-dark-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            Signal live
          </span>
        </div>

        <div className="grid border-b border-surface-dark-border sm:grid-cols-4">
          {heroPipeline.phases.map((phase, i) => (
            <button
              key={phase.id}
              type="button"
              onClick={() => setActivePhase(i)}
              className={cn(
                "border-surface-dark-border px-3 py-3 text-left transition-colors sm:border-r last:sm:border-r-0",
                activePhase === i
                  ? "bg-brand/15"
                  : "bg-transparent hover:bg-white/[0.03]",
              )}
            >
              <p
                className={cn(
                  "font-mono text-[9px] tabular-nums",
                  activePhase === i ? "text-brand-gold" : "text-text-on-dark-muted",
                )}
              >
                {phase.step}
              </p>
              <p className="mt-0.5 text-xs font-medium text-text-on-dark">{phase.title}</p>
              <p className="mt-0.5 text-[9px] text-text-on-dark-muted">{phase.caption}</p>
            </button>
          ))}
        </div>

        <div className="min-h-[240px] p-4">
          {activePhase === 0 && (
            <div key={activePhase} className="space-y-2">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-wider text-text-on-dark-muted">
                Ranked matches · rationale on file
              </p>
              {heroPipeline.matches.map((row) => (
                <div
                  key={row.firm}
                  className="flex items-center gap-3 border border-surface-dark-border bg-surface-dark-raised/50 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-text-on-dark">{row.firm}</p>
                    <p className="truncate text-[10px] text-text-on-dark-muted">{row.partner}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[9px] text-brand-gold">{row.tag}</span>
                  <span className="shrink-0 font-mono text-sm tabular-nums text-brand-gold">
                    {row.score}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activePhase === 1 && (
            <div key={activePhase} className="space-y-2">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-wider text-text-on-dark-muted">
                Sequence · sent from founder@yourco.com
              </p>
              {heroPipeline.sequence.map((step) => (
                <div
                  key={step.day}
                  className="flex items-center gap-3 border border-surface-dark-border px-3 py-2"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-white/5 font-mono text-[10px] text-brand-gold">
                    {step.day}
                  </span>
                  <p className="text-xs text-text-on-dark">{step.label}</p>
                </div>
              ))}
            </div>
          )}

          {activePhase === 2 && (
            <div key={activePhase} className="">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-wider text-text-on-dark-muted">
                Investor pipeline
              </p>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {heroPipeline.pipeline.map((col) => (
                  <div
                    key={col.stage}
                    className={cn(
                      "border px-2 py-2.5 text-center",
                      col.active
                        ? "border-brand-gold/40 bg-brand-gold/10"
                        : "border-surface-dark-border bg-surface-dark-raised/30",
                    )}
                  >
                    <p className="font-mono text-lg tabular-nums text-text-on-dark">{col.count}</p>
                    <p className="mt-0.5 text-[8px] uppercase tracking-wide text-text-on-dark-muted">
                      {col.stage}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-text-on-dark-muted">
                Every reply, note, and next step — built for raises, not sales CRMs.
              </p>
            </div>
          )}

          {activePhase === 3 && (
            <div key={activePhase} className="">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-wider text-text-on-dark-muted">
                Diligence & close
              </p>
              <div className="border border-surface-dark-border bg-surface-dark-raised/40 px-3 py-3">
                <p className="text-xs font-medium text-text-on-dark">{heroPipeline.close.doc}</p>
                <p className="mt-1 text-[10px] text-text-on-dark-muted">
                  {heroPipeline.close.views} views · {heroPipeline.close.investors} investors
                </p>
              </div>
              <p className="mt-3 flex items-center gap-2 text-[11px] text-brand-gold">
                <span className="h-px flex-1 bg-brand-gold/30" aria-hidden="true" />
                {heroPipeline.close.note}
                <span className="h-px flex-1 bg-brand-gold/30" aria-hidden="true" />
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-surface-dark-border px-4 py-2.5">
          <p className="text-center font-mono text-[9px] uppercase tracking-[0.16em] text-text-on-dark-muted">
            VC funds · angels · verified contacts · your domain
          </p>
        </div>
      </div>
    </div>
  );
}
