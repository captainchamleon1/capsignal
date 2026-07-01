"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackFunnelMilestone } from "@/lib/analytics";
import { formatInvestorCount } from "@/lib/match-display";
import type { MatchPreview } from "@/lib/leads/match-types";
import { industryLabelToKey, stageToKey } from "@/lib/raise-profile";

const TEASER_FETCH_COUNT = 5;
const TEASER_VISIBLE_COUNT = 3;

type MatchTeaserProps = {
  /** Stage label, e.g. "Seed". */
  stage: string;
  /** Industry label, e.g. "Fintech". */
  sector: string;
};

type TeaserState =
  | { status: "loading" }
  | { status: "ready"; preview: MatchPreview }
  | { status: "unavailable" };

/**
 * Inline teaser of real scored matches shown right after stage + industry are
 * picked — before any contact info is requested. Top rows visible, the rest
 * locked behind saving the profile.
 */
export function MatchTeaser({ stage, sector }: MatchTeaserProps) {
  const [state, setState] = useState<TeaserState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    async function load() {
      try {
        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stage: stageToKey[stage] ?? "seed",
            sector: industryLabelToKey(sector),
            sectorLabel: sector,
            limit: TEASER_FETCH_COUNT,
          }),
        });
        if (cancelled) return;

        if (res.ok) {
          const api = await res.json();
          if (api.topInvestors?.length > 0) {
            setState({
              status: "ready",
              preview: {
                estimatedMatches: api.estimatedMatches ?? api.totalMatches ?? 0,
                databaseSize: api.databaseSize,
                topInvestors: api.topInvestors.map(
                  (
                    inv: {
                      firm: string;
                      partner: string | null;
                      score: number;
                      rationale: string;
                      fundSize?: string;
                      checkSize?: string;
                    },
                    i: number,
                  ) => ({
                    firm: inv.firm,
                    partner: inv.partner,
                    score: inv.score,
                    reason: inv.rationale,
                    fundSize: inv.fundSize,
                    checkSize: inv.checkSize,
                    blurred: i >= TEASER_VISIBLE_COUNT,
                  }),
                ),
              },
            });
            trackFunnelMilestone("teaser_matches_view", {
              stage,
              sector,
              matchCount: api.estimatedMatches ?? 0,
            });
            return;
          }
        }
        setState({ status: "unavailable" });
      } catch {
        if (!cancelled) setState({ status: "unavailable" });
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [stage, sector]);

  if (state.status === "loading") {
    return (
      <div className="space-y-2" aria-busy="true" aria-label="Scoring investor matches">
        <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
          Scoring investors for {stage} · {sector}…
        </p>
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse border border-border bg-surface-muted p-4">
            <div className="h-3.5 w-2/5 bg-border" />
            <div className="mt-2.5 h-3 w-4/5 bg-border/60" />
          </div>
        ))}
      </div>
    );
  }

  if (state.status === "unavailable") {
    return (
      <p className="border border-border bg-surface-muted p-4 text-sm text-text-secondary">
        We&apos;ll score investors against your {stage} {sector} raise as soon as you save your
        profile below.
      </p>
    );
  }

  const { preview } = state;
  const visible = preview.topInvestors.filter((inv) => !inv.blurred);
  const lockedCount = Math.max(
    0,
    preview.estimatedMatches - visible.length,
  );

  return (
    <div>
      <div className="border border-brand/25 bg-brand-tint/40 px-4 py-3">
        <p className="text-sm text-text-primary">
          <span className="font-semibold text-brand">
            {formatInvestorCount(preview.estimatedMatches)} investors
          </span>{" "}
          in our database match {stage} · {sector}. Here are your top {visible.length}:
        </p>
      </div>

      <ul className="mt-3 space-y-2.5">
        {visible.map((inv, i) => (
          <li key={`${inv.firm}-${i}`} className="border border-border bg-surface-elevated">
            <div className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-text-primary">{inv.firm}</p>
                  {i === 0 && (
                    <span className="bg-brand-tint px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-brand">
                      Top fit
                    </span>
                  )}
                </div>
                {inv.partner && <p className="mt-0.5 text-xs text-text-tertiary">{inv.partner}</p>}
                {inv.fundSize && (
                  <p className="mt-1.5 text-xs text-text-secondary">
                    {inv.fundSize}
                    {inv.checkSize ? ` · ${inv.checkSize}` : ""}
                  </p>
                )}
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-secondary">
                  {inv.reason}
                </p>
              </div>
              <div className="shrink-0 text-center">
                <span className="font-mono text-xl font-medium tabular-nums text-brand">
                  {inv.score}
                </span>
                <p className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
                  fit
                </p>
              </div>
            </div>
          </li>
        ))}

        {preview.topInvestors
          .filter((inv) => inv.blurred)
          .map((inv, i) => (
            <li
              key={`locked-${i}`}
              className="relative overflow-hidden border border-border bg-surface-elevated"
            >
              <div className={cn("p-4 select-none blur-[3px]")} aria-hidden="true">
                <p className="text-sm font-semibold text-text-primary">{inv.firm}</p>
                <p className="mt-1.5 text-xs text-text-secondary">{inv.reason}</p>
              </div>
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-elevated/40">
                <p className="flex items-center gap-1.5 bg-surface-elevated/95 px-3 py-1.5 text-[11px] font-medium text-text-secondary">
                  <Lock className="h-3 w-3" aria-hidden="true" />
                  Save your profile to reveal
                </p>
              </div>
            </li>
          ))}
      </ul>

      {lockedCount > 0 && (
        <p className="mt-3 border border-dashed border-border bg-surface-muted px-4 py-3 text-center text-xs text-text-secondary">
          +{formatInvestorCount(lockedCount)} more matched investors — save your profile below to
          unlock the full ranked list
        </p>
      )}
    </div>
  );
}
