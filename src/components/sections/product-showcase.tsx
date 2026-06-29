"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/components/ui/reveal";
import { ProductPreview } from "@/components/sections/product-preview";
import { SequencesPreview } from "@/components/product/sequences-preview";
import { AnalyticsPreview } from "@/components/product/analytics-preview";

const views = [
  { id: "investors", label: "Investors", caption: "Ranked shortlist with live match scores" },
  { id: "sequences", label: "Sequences", caption: "Per-investor cadence from your domain" },
  { id: "analytics", label: "CRM", caption: "Track interested investors and share diligence" },
] as const;

type ViewId = (typeof views)[number]["id"];

const previews: Record<ViewId, ComponentType> = {
  investors: ProductPreview,
  sequences: SequencesPreview,
  analytics: AnalyticsPreview,
};

type ProductShowcaseProps = {
  className?: string;
};

export function ProductShowcase({ className }: ProductShowcaseProps) {
  const [active, setActive] = useState<ViewId>("investors");
  const [transitioning, setTransitioning] = useState(false);

  const select = useCallback((id: ViewId) => {
    if (id === active) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setActive(id);
      setTransitioning(false);
    }, 150);
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const idx = views.findIndex((v) => v.id === active);
      if (e.key === "ArrowRight") select(views[(idx + 1) % views.length].id);
      if (e.key === "ArrowLeft") select(views[(idx - 1 + views.length) % views.length].id);
      if (e.key === "1") select("investors");
      if (e.key === "2") select("sequences");
      if (e.key === "3") select("analytics");
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, select]);

  const current = views.find((v) => v.id === active)!;
  const Preview = previews[active];
  const { ref, inView } = useInView(0.15);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden bg-surface-elevated transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
        inView ? "translate-y-0" : "translate-y-4",
        className,
      )}
      role="tablist"
      aria-label="Product views"
    >
      <div className="flex min-w-0 items-center justify-between gap-2 border-b border-border px-3 py-3 sm:px-4 md:px-6">
        <div className="flex min-w-0 flex-1 gap-0 overflow-x-auto [-webkit-overflow-scrolling:touch]">
          {views.map((view, i) => (
            <button
              key={view.id}
              type="button"
              role="tab"
              aria-selected={active === view.id}
              onClick={() => select(view.id)}
              className={cn(
                "relative shrink-0 px-2.5 py-1.5 text-[12px] transition-colors sm:px-3 sm:text-[13px] md:px-4",
                active === view.id
                  ? "font-medium text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              <span className="mr-1.5 hidden font-mono text-[10px] text-text-tertiary md:inline">
                {i + 1}
              </span>
              {view.label}
              {active === view.id && (
                <span className="absolute inset-x-3 -bottom-[13px] h-px bg-text-primary md:inset-x-4" />
              )}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 pl-2">
          <span
            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            aria-hidden="true"
          />
          <span className="hidden font-mono text-[10px] text-text-tertiary sm:inline">
            investor-database
          </span>
        </div>
      </div>

      <div
        className={cn(
          "transition-opacity duration-150 ease-out",
          transitioning ? "opacity-0" : "opacity-100",
        )}
        role="tabpanel"
      >
        <Preview />
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 md:px-6">
        <p className="font-mono text-[11px] text-text-tertiary">{current.caption}</p>
        <p className="hidden font-mono text-[10px] text-text-tertiary md:block">
          ← → to switch
        </p>
      </div>
    </div>
  );
}
