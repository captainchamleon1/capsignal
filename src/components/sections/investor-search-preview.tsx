"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GuaranteeLine } from "@/components/ui/guarantee-line";
import type { MatchPreviewInvestor } from "@/lib/leads/match-types";

const sectors = [
  { label: "B2B SaaS", value: "b2b_saas" },
  { label: "Fintech", value: "fintech" },
  { label: "Healthtech", value: "healthtech" },
  { label: "Climate", value: "climate" },
  { label: "Deep tech", value: "deep_tech" },
] as const;

const stages = [
  { label: "Pre-seed", value: "pre_seed" },
  { label: "Seed", value: "seed" },
  { label: "Series A", value: "series_a" },
  { label: "Series B", value: "series_b" },
] as const;

type ApiInvestor = {
  firm: string;
  partner: string | null;
  score: number;
  rationale: string;
  fundSize?: string;
  checkSize?: string;
  investments?: string[];
};

function buildStartUrl(stage: string, sector: string) {
  const params = new URLSearchParams({ stage, sector });
  return `/start?${params.toString()}#apply`;
}

function InvestorCard({ investor }: { investor: MatchPreviewInvestor }) {
  return (
    <article className="border border-border bg-surface-elevated p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{investor.firm}</h3>
          {investor.partner && (
            <p className="mt-0.5 text-xs text-text-tertiary">{investor.partner}</p>
          )}
        </div>
        <span className="shrink-0 font-mono text-sm tabular-nums text-brand">{investor.score}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
        {investor.fundSize && <span>{investor.fundSize}</span>}
        {investor.checkSize && <span>{investor.checkSize}</span>}
      </div>

      {investor.investments && investor.investments.length > 0 && (
        <p className="mt-2 text-xs text-text-secondary">
          <span className="text-text-tertiary">Portfolio: </span>
          {investor.investments.join(", ")}
        </p>
      )}

      <p className="mt-2 text-xs leading-relaxed text-text-tertiary">{investor.reason}</p>

      <div className="relative mt-4 overflow-hidden border border-border bg-surface-muted p-3">
        <div className="pointer-events-none absolute inset-0 z-10 bg-surface-muted/60 backdrop-blur-[2px]" aria-hidden="true" />
        <div className="relative z-0 space-y-2 select-none">
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="blur-[3px]">partner@fund.com</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="blur-[3px]">linkedin.com/in/partner</span>
          </div>
          <div className="flex h-8 items-center justify-center border border-dashed border-border bg-surface-elevated text-[11px] text-text-tertiary blur-[2px]">
            Submit pitch deck
          </div>
        </div>
      </div>
    </article>
  );
}

export function InvestorSearchPreview({ className }: { className?: string }) {
  const [sector, setSector] = useState("b2b_saas");
  const [stage, setStage] = useState("seed");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [investors, setInvestors] = useState<MatchPreviewInvestor[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [searchLabel, setSearchLabel] = useState("");

  const sectorLabel = sectors.find((s) => s.value === sector)?.label ?? sector;
  const stageLabel = stages.find((s) => s.value === stage)?.label ?? stage;
  const displayQuery = `${sectorLabel} ${stageLabel} Investor`;

  async function runSearch() {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, sector, limit: 45 }),
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setTotalMatches(data.totalMatches ?? 0);
      setSearchLabel(data.searchLabel ?? displayQuery.toLowerCase());
      setInvestors(
        (data.topInvestors as ApiInvestor[]).map((inv) => ({
          firm: inv.firm,
          partner: inv.partner,
          score: inv.score,
          reason: inv.rationale,
          fundSize: inv.fundSize,
          checkSize: inv.checkSize,
          investments: inv.investments,
          blurred: false,
        })),
      );
    } catch {
      setInvestors([]);
      setTotalMatches(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="border border-border bg-surface-dark px-5 py-5 text-text-on-dark md:px-6 md:py-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-gold">
          Try it free · Search our investor database
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center border border-surface-dark-border bg-surface-dark-raised px-4 py-3">
            <span className="text-sm text-text-on-dark">{displayQuery}</span>
          </div>
          <Button
            type="button"
            variant="primary"
            className="shrink-0 bg-brand border-brand hover:bg-brand/90"
            disabled={loading}
            onClick={runSearch}
          >
            {loading ? "Searching…" : "Search investors"}
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {sectors.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSector(s.value)}
              className={cn(
                "border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                sector === s.value
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-surface-dark-border text-text-on-dark-muted hover:border-text-on-dark-muted",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {stages.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStage(s.value)}
              className={cn(
                "border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                stage === s.value
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-surface-dark-border text-text-on-dark-muted hover:border-text-on-dark-muted",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {searched && (
        <div className="border border-t-0 border-border bg-surface-elevated">
          {loading ? (
            <div className="flex flex-col items-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
                Scoring {searchLabel || displayQuery.toLowerCase()}…
              </p>
            </div>
          ) : investors.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-text-secondary">
                No matches found for this profile. Try a different sector or stage.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {totalMatches} investors match your search
                  </p>
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    Names, fund sizes, and portfolio shown free · contact details locked
                  </p>
                </div>
                <Button
                  variant="primary"
                  href={buildStartUrl(stage, sector)}
                  className="shrink-0 bg-brand border-brand hover:bg-brand/90"
                >
                  Complete your raise profile to unlock contacts
                </Button>
              </div>

              <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                {investors.slice(0, 9).map((inv) => (
                  <InvestorCard key={inv.firm} investor={inv} />
                ))}
              </div>

              {totalMatches > 9 && (
                <div className="border-t border-border bg-surface-muted px-5 py-8 text-center md:px-6">
                  <p className="text-sm text-text-secondary">
                    +{totalMatches - 9} more matched investors with verified contact paths
                  </p>
                  <Button
                    variant="primary"
                    href={buildStartUrl(stage, sector)}
                    className="mt-4 bg-brand border-brand hover:bg-brand/90"
                  >
                    Complete your raise profile to unlock contacts
                  </Button>
                  <GuaranteeLine className="mt-3" />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!searched && (
        <div className="border border-t-0 border-border bg-surface-muted px-5 py-6 text-center md:px-6">
          <p className="text-sm text-text-secondary">
            Search 12,000+ investor firms — preview matches free, then complete your raise profile to unlock contacts.
          </p>
        </div>
      )}
    </div>
  );
}
