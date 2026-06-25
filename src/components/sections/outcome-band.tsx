"use client";

import { useEffect, useState } from "react";
import { outcomeScenarios } from "@/lib/content/home";
import { SectionLabel } from "@/components/ui/section-label";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/utils";

const MANUAL_RATE = 2.5;
const CAPSIGNAL_RATE = 11.4;

function RateBar({
  label,
  rate,
  variant,
  animate,
}: {
  label: string;
  rate: number;
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
          style={{ width: animate ? `${(rate / CAPSIGNAL_RATE) * 100}%` : "0%" }}
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
    <section className="py-(--spacing-section-sm)">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <SectionLabel index="—" title="Outcomes" />
            <h2 className="display-serif mt-5 text-balance text-2xl font-semibold text-text-primary md:text-3xl">
              Same investor list. A completely different raise.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-text-secondary">
              Most founders lose a month to manual outreach before they know if the list was
              wrong. CapSignal compresses launch to days—and puts replies in your inbox while
              you stay on product.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {outcomeScenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                className={cn(
                  "border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors",
                  activeId === s.id
                    ? "border-brand bg-brand-tint text-brand"
                    : "border-border bg-surface-elevated text-text-secondary hover:border-border-strong",
                )}
              >
                {s.label} · {s.investors} investors
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
                detail={`At ${MANUAL_RATE}% median reply rate`}
              />
              <Metric
                value={String(scenario.manualMeetings)}
                label="Likely first meetings"
                detail="Before you pivot the list or the pitch"
              />
            </div>

            <div className="mt-8">
              <RateBar
                label="Reply rate"
                rate={MANUAL_RATE}
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
              Ranked shortlist, inbox-native sequences, live funnel reporting.
            </p>

            <div className="mt-8 space-y-0">
              <Metric value="5–7 days" label="To campaign launch" detail="After shortlist approval" highlight />
              <Metric
                value={String(scenario.capsignalReplies)}
                label="Expected investor replies"
                detail={`At ${CAPSIGNAL_RATE}% median reply rate`}
                highlight
              />
              <Metric
                value={String(scenario.capsignalMeetings)}
                label="Likely first meetings"
                detail="Based on Meridian Labs benchmark"
                highlight
              />
            </div>

            <div className="mt-8">
              <RateBar
                label="Reply rate"
                rate={CAPSIGNAL_RATE}
                variant="capsignal"
                animate={barsReady}
              />
            </div>
          </div>
        </RevealStagger>

        <Reveal delay={120} className="mt-8 flex flex-col gap-6 border border-border bg-surface-elevated p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="max-w-xl text-[15px] leading-relaxed text-text-secondary">
            <span className="font-medium text-text-primary">Scale is $99.99/mo.</span> Manual costs
            you {scenario.manualHours} hours you could spend closing—CapSignal runs the outreach
            system while you take the meetings.
          </p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button variant="primary" href="/request-access">
              Request access
            </Button>
            <TextLink href="/pricing">View pricing</TextLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
