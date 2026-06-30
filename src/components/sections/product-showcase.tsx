"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/components/ui/reveal";
import { ProductPreview } from "@/components/sections/product-preview";
import { SequencesPreview } from "@/components/product/sequences-preview";
import { AnalyticsPreview } from "@/components/product/analytics-preview";

const views = [
  { id: "investors", label: "Matching", caption: "Ranked shortlist with live match scores" },
  { id: "sequences", label: "Outreach", caption: "Thesis-aware sequences from your domain" },
  { id: "analytics", label: "CRM", caption: "Pipeline, funnel, and data room through close" },
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
    }, 180);
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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => {
        const idx = views.findIndex((v) => v.id === current);
        return views[(idx + 1) % views.length].id;
      });
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = views.find((v) => v.id === active)!;
  const Preview = previews[active];
  const { ref, inView } = useInView(0.15);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden border border-border bg-surface-page shadow-[0_32px_100px_-48px_rgba(0,0,0,0.45)] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-90",
        className,
      )}
      role="tablist"
      aria-label="Product views"
    >
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border bg-surface-elevated px-3 py-3 sm:px-5 md:px-6">
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto [-webkit-overflow-scrolling:touch]">
          {views.map((view, i) => (
            <button
              key={view.id}
              type="button"
              role="tab"
              aria-selected={active === view.id}
              onClick={() => select(view.id)}
              className={cn(
                "relative shrink-0 px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors sm:px-4",
                active === view.id
                  ? "bg-surface-dark text-text-on-dark"
                  : "text-text-tertiary hover:bg-surface-muted hover:text-text-secondary",
              )}
            >
              <span className="mr-2 text-[9px] text-text-tertiary">{String(i + 1).padStart(2, "0")}</span>
              {view.label}
            </button>
          ))}
        </div>

        <span className="hidden shrink-0 items-center gap-2 sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-30" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
            Product preview
          </span>
        </span>
      </div>

      <div
        className={cn(
          "transition-all duration-200 ease-out",
          transitioning ? "scale-[0.995] opacity-0" : "scale-100 opacity-100",
        )}
        role="tabpanel"
      >
        <Preview />
      </div>

      <div className="flex items-center justify-between border-t border-border bg-surface-elevated px-4 py-3 md:px-6">
        <p className="font-mono text-[11px] text-text-secondary">{current.caption}</p>
        <p className="hidden font-mono text-[10px] text-text-tertiary md:block">← → to switch</p>
      </div>
    </div>
  );
}
