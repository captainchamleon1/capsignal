"use client";

import { CountUp } from "@/components/ui/count-up";
import { RevealStagger } from "@/components/ui/reveal";

type StatItem = {
  value: string;
  label: string;
  detail?: string;
};

type AnimatedStatGridProps = {
  items: readonly StatItem[];
  columns?: 2 | 3 | 4;
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "md:grid-cols-4",
};

export function AnimatedStatGrid({ items, columns = 4 }: AnimatedStatGridProps) {
  return (
    <RevealStagger
      stagger={100}
      className={`grid grid-cols-2 gap-px border border-border bg-border ${columnClasses[columns]}`}
    >
      {items.map((item) => (
        <div key={item.label} className="reveal-stagger-item bg-surface-elevated px-5 py-5 md:px-6 md:py-6">
          <dt className="font-mono text-xl font-medium tracking-tight text-text-primary md:text-2xl">
            <CountUp value={item.value} />
          </dt>
          <dd className="mt-1.5 text-sm font-medium text-text-primary">{item.label}</dd>
          {item.detail && (
            <dd className="mt-2 text-xs leading-relaxed text-text-secondary">{item.detail}</dd>
          )}
        </div>
      ))}
    </RevealStagger>
  );
}
