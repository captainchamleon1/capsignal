"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";

export function RoiCalculator() {
  const [investors, setInvestors] = useState(250);
  const [founderRate, setFounderRate] = useState(50);
  const [manualReplyRate, setManualReplyRate] = useState(2.5);

  const capsignalReplyRate = 11.4;
  const manualHours = Math.round(investors * 0.75);
  const capsignalHours = 12;
  const manualReplies = Math.round(investors * (manualReplyRate / 100));
  const capsignalReplies = Math.round(investors * (capsignalReplyRate / 100));
  const hoursSaved = manualHours - capsignalHours;
  const founderCost = founderRate * manualHours;
  const capsignalCost = 99.99;
  const netSavings = founderCost - capsignalCost;

  return (
    <section className="border-t border-border bg-surface-muted py-(--spacing-section)">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-3xl">
              What manual outreach actually costs
            </h2>
            <p className="mt-3 text-base text-text-secondary">
              Adjust the inputs to compare founder time and reply volume against
              a CapSignal Scale campaign.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label htmlFor="investors" className="text-sm font-medium text-text-primary">
                  Investors to contact: {investors}
                </label>
                <input
                  id="investors"
                  type="range"
                  min={100}
                  max={500}
                  step={10}
                  value={investors}
                  onChange={(e) => setInvestors(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="rate" className="text-sm font-medium text-text-primary">
                  Founder hourly value: ${founderRate}/hr
                </label>
                <input
                  id="rate"
                  type="range"
                  min={25}
                  max={150}
                  step={5}
                  value={founderRate}
                  onChange={(e) => setFounderRate(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="reply" className="text-sm font-medium text-text-primary">
                  Manual reply rate: {manualReplyRate}%
                </label>
                <input
                  id="reply"
                  type="range"
                  min={1}
                  max={8}
                  step={0.5}
                  value={manualReplyRate}
                  onChange={(e) => setManualReplyRate(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-elevated p-6 md:p-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Manual</p>
                <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{manualHours}h</p>
                <p className="text-sm text-text-secondary">Founder time</p>
                <p className="mt-4 font-mono text-xl tabular-nums text-text-primary">{manualReplies}</p>
                <p className="text-sm text-text-secondary">Expected replies</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">CapSignal</p>
                <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{capsignalHours}h</p>
                <p className="text-sm text-text-secondary">Your time (review + meetings)</p>
                <p className="mt-4 font-mono text-xl tabular-nums text-text-primary">{capsignalReplies}</p>
                <p className="text-sm text-text-secondary">Expected replies</p>
              </div>
            </div>
            <div className="mt-8 border-t border-border pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Hours saved</span>
                <span className="font-mono font-medium tabular-nums text-text-primary">{hoursSaved}h</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-text-secondary">Net vs. founder time (Scale plan)</span>
                <span className={`font-mono font-medium tabular-nums ${netSavings > 0 ? "text-text-primary" : "text-text-tertiary"}`}>
                  {netSavings > 0 ? `$${netSavings.toLocaleString()} saved` : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
