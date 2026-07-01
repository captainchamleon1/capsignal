"use client";

import { useEffect, useState } from "react";
import { outcomeScenarios } from "@/lib/content/home";
import { SectionLabel } from "@/components/ui/section-label";
import { Container } from "@/components/ui/container";
import { StartApplyButton } from "@/components/ui/start-apply-button";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const MANUAL_RATE = 2.5;

function RateBar({
  label,
  rate,
  maxRate,
  variant,
  animate,
}: {
  label: string;
  rate: number;
  maxRate: number;
  variant: "manual" | "capsignal";
  animate: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-text-secondary">{label}</span>
        <span className="font-mono text-sm tabular-nums text-text-primary">{rate}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full bg-border">
        <div
          className={cn(
            "h-full transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
            variant === "capsignal" ? "bg-brand" : "bg-text-tertiary",
          )}
          style={{ width: animate ? `${(rate / maxRate) * 100}%` : "0%" }}
        />
      </div>
    </div>
  );
}

function Metric({
  value,
  label,
  detail,
  highlight,
}: {
  value: string;
  label: string;
  detail?: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn("border-t border-border pt-5", highlight && "border-brand/30")}>
      <p
        className={cn(
          "font-mono text-2xl font-medium tabular-nums tracking-tight md:text-[1.75rem]",
          highlight ? "text-brand" : "text-text-primary",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-text-primary">{label}</p>
      {detail && <p className="mt-1 text-xs leading-relaxed text-text-tertiary">{detail}</p>}
    </div>
  );
}

export function OutcomeBand() {
  const [activeId, setActiveId] = useState<(typeof outcomeScenarios)[number]["id"]>("typical");
  const [barsReady, setBarsReady] = useState(false);

  const scenario = outcomeScenarios.find((s) => s.id === activeId)!;
  const weeksOfFounderTime = (scenario.manualHours / 40).toFixed(1);

  useEffect(() => {
    setBarsReady(false);
    const timer = window.setTimeout(() => setBarsReady(true), 300);
    return () => window.clearTimeout(timer);
  }, [activeId]);

  return (
    <section className="overflow-x-clip py-(--spacing-section-sm)">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <SectionLabel index="—" title="Outcomes" />
            <h2 className="display-serif mt-5 text-balance text-2xl font-semibold text-text-primary md:text-3xl">
              Less founder time on list-building
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-text-secondary">
              Manual outreach costs hours you could spend on product and meetings. CapSignal
              automates list-building from source data — reply and meeting metrics come from your
              campaigns, not platform benchmarks.
            </p>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
            {outcomeScenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                className={cn(
                  "shrink-0 border px-3 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors min-h-[44px] sm:px-4 sm:text-[11px]",
                  activeId === s.id
                    ? "border-brand bg-brand-tint text-brand"
                    : "border-border bg-surface-elevated text-text-secondary hover:border-border-strong",
                )}
              >
                {s.label} · {s.investors}
              </button>
            ))}
          </div>
        </Reveal>

        <RevealStagger
          stagger={100}
          className="mt-10 grid gap-px border border-border bg-border lg:grid-cols-2"
          direction="up"
        >
          <div className="reveal-stagger-item bg-surface-elevated p-6 md:p-8 lg:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
              Manual outreach
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Spreadsheets, copy-paste, and follow-ups when you remember.
            </p>

            <div className="mt-8 space-y-0">
              <Metric
                value={`${scenario.manualHours}h`}
                label="Founder time on the list"
                detail={`~${weeksOfFounderTime} weeks of full-time work`}
              />
              <Metric
                value={String(scenario.manualReplies)}
                label="Expected investor replies"
                detail={`Illustrative at ${MANUAL_RATE}% reply rate`}
              />
              <Metric
                value={String(scenario.manualMeetings)}
                label="Likely first meetings"
                detail="Illustrative — varies by list quality and pitch"
              />
            </div>

            <div className="mt-8">
              <RateBar
                label="Illustrative reply rate"
                rate={MANUAL_RATE}
                maxRate={10}
                variant="manual"
                animate={barsReady}
              />
            </div>
          </div>

          <div className="reveal-stagger-item border-brand/20 bg-brand-tint p-6 md:p-8 lg:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
              With CapSignal
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Ranked matches from public data, inbox-native sequences, per-campaign analytics.
            </p>

            <div className="mt-8 space-y-0">
              <Metric value="Same business day" label="Typical setup time" detail="After subscribe" highlight />
              <Metric
                value="—"
                label="Reply rate"
                detail="Tracked from your campaign after launch"
                highlight
              />
              <Metric
                value="—"
                label="Meetings booked"
                detail="Recorded in your CRM from real outreach"
                highlight
              />
            </div>

            <p className="mt-8 text-xs leading-relaxed text-text-tertiary">
              We do not display median reply rates or meeting benchmarks until they are computed
              from verified customer campaigns.
            </p>
          </div>
        </RevealStagger>

        <Reveal delay={120} className="mt-8 flex flex-col gap-6 border border-border bg-surface-elevated p-5 pb-safe md:flex-row md:items-center md:justify-between md:p-8">
          <p className="max-w-xl text-[15px] leading-relaxed text-text-secondary">
            Manual costs you {scenario.manualHours} hours you could spend closing—CapSignal runs
            the outreach system while you take the meetings.
          </p>
          <StartApplyButton
            variant="primary"
            className="min-h-[48px] w-full shrink-0 bg-brand border-brand hover:bg-brand/90 md:w-auto"
          >
            Build your raise profile
          </StartApplyButton>
        </Reveal>
      </Container>
    </section>
  );
}
