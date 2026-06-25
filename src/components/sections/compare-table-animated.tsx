"use client";

import { comparisonRows } from "@/lib/content/home";
import { Reveal, RevealStagger } from "@/components/ui/reveal";

const highlights = comparisonRows.slice(0, 4);

const rowGrid =
  "grid grid-cols-[minmax(140px,200px)_1fr_1fr_1fr]";

export function CompareTableAnimated() {
  return (
    <div className="hidden overflow-hidden border border-border md:block">
      <div className={`${rowGrid} border-b border-border`}>
        <div className="px-5 py-3" />
        <div className="border-l border-border px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">Manual</span>
        </div>
        <div className="border-l border-border px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">CRM</span>
        </div>
        <div className="border-l border-border bg-surface-muted px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-primary">CapSignal</span>
        </div>
      </div>

      {highlights.map((row, i) => (
        <Reveal
          key={row.feature}
          delay={i * 90}
          direction="up"
          className={i < highlights.length - 1 ? "border-b border-border" : undefined}
        >
          <div className={rowGrid}>
            <div className="px-5 py-4">
              <span className="text-sm font-medium text-text-primary">{row.feature}</span>
            </div>
            <div className="border-l border-border px-5 py-4">
              <span className="text-sm text-text-tertiary">{row.manual}</span>
            </div>
            <div className="border-l border-border px-5 py-4">
              <span className="text-sm text-text-tertiary">{row.crm}</span>
            </div>
            <Reveal delay={50} direction="right" className="border-l border-border bg-surface-muted px-5 py-4">
              <span className="text-sm font-medium text-text-primary">{row.capsignal}</span>
            </Reveal>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function CompareMobileAnimated() {
  return (
    <RevealStagger className="divide-y divide-border border border-border md:hidden">
      {highlights.map((row) => (
        <div key={row.feature} className="reveal-stagger-item bg-surface-muted px-4 py-4">
          <p className="text-sm font-medium text-text-primary">{row.feature}</p>
          <p className="mt-2 text-sm font-medium text-text-primary">{row.capsignal}</p>
          <p className="mt-1 text-xs text-text-tertiary">
            vs. {row.manual} manual · {row.crm} CRM
          </p>
        </div>
      ))}
    </RevealStagger>
  );
}
