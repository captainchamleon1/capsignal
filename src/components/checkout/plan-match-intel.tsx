"use client";

import { Lock, Mail, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RaiseBriefInsights } from "@/lib/plan/raise-brief";
import type { RaiseProfileDraft } from "@/lib/raise-profile";
import { formatInvestorCount } from "@/lib/match-display";

type PlanMatchIntelProps = {
  profile: RaiseProfileDraft;
  brief: RaiseBriefInsights;
  className?: string;
};

export function PlanMatchIntel({ profile, brief, className }: PlanMatchIntelProps) {
  const stats = [
    {
      label: "VC funds",
      value: formatInvestorCount(brief.vcFunds),
      detail: `Deploying at ${profile.stage} in ${profile.sector}`,
    },
    {
      label: "Angels & operators",
      value: formatInvestorCount(brief.angels),
      detail: "Individual checks · operator angels",
    },
    ...(brief.metroMatches > 0
      ? [
          {
            label: `${profile.city} area`,
            value: formatInvestorCount(brief.metroMatches),
            detail: "Regional matches ranked first",
          },
        ]
      : []),
    {
      label: "High-fit (85+)",
      value: formatInvestorCount(brief.highFitMatches),
      detail: "Stage + thesis aligned",
    },
    {
      label: "Warm intro paths",
      value: formatInvestorCount(brief.warmIntroPaths),
      detail: "Portfolio overlap found",
    },
    {
      label: "Recently active",
      value: formatInvestorCount(brief.activeDeployers),
      detail: "Deployed in the last 90 days",
    },
  ];

  return (
    <section className={cn("space-y-5", className)}>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
          Investor breakdown
        </p>
        <h2 className="mt-2 text-lg font-semibold text-text-primary md:text-xl">
          VC funds and angels for {profile.company}
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
          {formatInvestorCount(brief.poolSize)} records passed initial filters from 12,000+
          source-attributed firms — split by fund type below.
        </p>
      </div>

      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-muted/80 px-4 py-4">
            <p className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
              {stat.label}
            </p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-text-primary">{stat.value}</p>
            <p className="mt-1 text-[11px] text-text-secondary">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="border border-border bg-surface-dark">
        <div className="border-b border-surface-dark-border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-brand-gold">
            Top VC matches · contacts unlock on trial
          </p>
        </div>
        <ul className="divide-y divide-surface-dark-border">
          {brief.spotlightInvestors.map((inv) => (
            <li key={inv.firm} className="relative px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-on-dark">{inv.firm}</p>
                  {inv.partner ? (
                    <p className="text-[11px] text-text-on-dark-muted">{inv.partner}</p>
                  ) : null}
                  <p className="mt-2 text-[12px] leading-relaxed text-text-on-dark-muted">
                    {inv.reason}
                  </p>
                  {inv.checkSize ? (
                    <p className="mt-1.5 font-mono text-[10px] text-brand-gold">{inv.checkSize}</p>
                  ) : null}
                </div>
                <span className="shrink-0 font-mono text-lg tabular-nums text-brand-gold">
                  {inv.score}
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-2 border-t border-surface-dark-border/80 pt-3 sm:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <Mail className="h-3 w-3 shrink-0 text-text-on-dark-muted" aria-hidden="true" />
                  <span
                    className={cn(
                      "text-[10px]",
                      inv.blurred
                        ? "select-none blur-[3px] text-text-on-dark"
                        : "text-text-on-dark-muted",
                    )}
                  >
                    {inv.blurred ? "████████████" : "partner@fund.com"}
                  </span>
                  {inv.blurred ? (
                    <Lock className="ml-auto h-3 w-3 text-text-on-dark-muted" aria-hidden="true" />
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <Link2 className="h-3 w-3 shrink-0 text-text-on-dark-muted" aria-hidden="true" />
                  <span className="select-none blur-[3px] text-[10px] text-text-on-dark">
                    ████████
                  </span>
                  <Lock className="ml-auto h-3 w-3 text-text-on-dark-muted" aria-hidden="true" />
                </div>
              </div>
              {inv.blurred ? (
                <div
                  className="pointer-events-none absolute inset-0 bg-surface-dark/15"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          ))}
        </ul>
        <p className="border-t border-surface-dark-border px-4 py-3 text-center text-[11px] text-text-on-dark-muted">
          +{formatInvestorCount(brief.angels)} angels and{" "}
          {formatInvestorCount(Math.max(0, brief.verifiedContacts - brief.spotlightInvestors.length))}{" "}
          more VC targets on the full shortlist
        </p>
      </div>
    </section>
  );
}
