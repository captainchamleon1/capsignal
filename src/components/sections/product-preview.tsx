"use client";

import { useEffect, useState } from "react";
import {
  Target,
  LayoutGrid,
  Megaphone,
  FolderLock,
  Mail,
  Link2,
  Check,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type DemoSampleFirm } from "@/lib/data/demo-investors";
import {
  previewInvestors,
  previewMatchingMeta,
  type PreviewInvestor,
} from "@/lib/content/product-previews";
import { INVESTOR_DATABASE_SIZE } from "@/lib/match-display";
import {
  PreviewShell,
  ScoreBar,
  PreviewStatPill,
  BreakdownGrid,
  PreviewFilterChip,
} from "@/components/product/preview-shell";

const nav = [
  { label: "Overview", icon: LayoutGrid, active: false },
  { label: "Investors", icon: Target, active: true },
  { label: "Campaigns", icon: Megaphone, active: false },
  { label: "Data room", icon: FolderLock, active: false },
];

export function ProductPreview() {
  const [firms, setFirms] = useState<PreviewInvestor[]>(previewInvestors);
  const [selected, setSelected] = useState(0);
  const [total, setTotal] = useState(INVESTOR_DATABASE_SIZE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/investor-sample")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.firms?.length) {
          setTotal(data.total > 0 ? data.total : INVESTOR_DATABASE_SIZE);
          const mapped = (data.firms as DemoSampleFirm[]).slice(0, 4).map((row, i) => {
            const base = previewInvestors[i] ?? previewInvestors[0];
            return {
              ...base,
              firm: row.name,
              partner: row.partner ?? base.partner,
              score: row.dataQuality,
              sector: row.sectorLabel,
            };
          });
          if (mapped.length >= 3) setFirms(mapped);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const displayTotal =
    total >= INVESTOR_DATABASE_SIZE ? `${total.toLocaleString()}+` : total.toLocaleString();
  const focus = firms[selected] ?? firms[0];

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[8px] uppercase tracking-wider text-text-on-dark-muted">
        {previewMatchingMeta.raise}
      </span>
      {previewMatchingMeta.filters.map((f, i) => (
        <PreviewFilterChip key={f} label={f} active={i < 3} />
      ))}
    </div>
  );

  const statusBar = (
    <div className="flex flex-wrap gap-1.5">
      {previewMatchingMeta.stats.map((s) => (
        <PreviewStatPill key={s.label} label={s.label} value={s.value} />
      ))}
    </div>
  );

  return (
    <PreviewShell
      module="Investor matching"
      path={`investor-database · ${loading ? "—" : displayTotal} firms · refreshed daily`}
      badge="Live signal"
      toolbar={toolbar}
      statusBar={statusBar}
      minHeight="min-h-[480px] md:min-h-[540px]"
    >
      <div className="flex h-full flex-col xl:flex-row">
        <aside className="hidden w-40 shrink-0 border-r border-white/[0.06] p-3 lg:block">
          <p className="mb-2 px-1 font-mono text-[8px] uppercase tracking-[0.16em] text-text-on-dark-muted">
            Workspace
          </p>
          <nav className="space-y-0.5">
            {nav.map(({ label, icon: Icon, active }) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-[11px]",
                  active ? "bg-white/[0.06] font-medium text-text-on-dark" : "text-text-on-dark-muted",
                )}
              >
                <Icon className="h-3 w-3 shrink-0 opacity-70" aria-hidden="true" />
                {label}
              </div>
            ))}
          </nav>
          <p className="mb-2 mt-5 px-1 font-mono text-[8px] uppercase tracking-wider text-text-on-dark-muted">
            Signal layers
          </p>
          <ul className="space-y-2">
            {previewMatchingMeta.signalLayers.map((layer) => (
              <li key={layer.label} className="border-l border-brand/40 pl-2">
                <p className="text-[10px] font-medium text-text-on-dark">{layer.label}</p>
                <p className="text-[9px] leading-snug text-text-on-dark-muted">{layer.detail}</p>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1 border-b border-white/[0.06] p-3 md:p-4 xl:border-b-0 xl:border-r">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[9px] uppercase tracking-wider text-text-on-dark-muted">
              Ranked shortlist · click for detail
            </p>
            <div className="flex gap-1">
              <PreviewFilterChip label="All" active />
              <PreviewFilterChip label="VC" />
              <PreviewFilterChip label="Angels" />
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-brand-gold" />
            </div>
          ) : (
            <ul className="space-y-1.5">
              {firms.map((row, i) => (
                <li key={row.firm}>
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    className={cn(
                      "group w-full border p-2.5 text-left transition-colors",
                      selected === i
                        ? "border-brand/40 bg-brand/[0.1]"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-brand-gold/20",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          "mt-0.5 shrink-0 border px-1 py-0.5 font-mono text-[7px] uppercase",
                          row.type === "VC"
                            ? "border-brand-gold/30 text-brand-gold"
                            : "border-white/15 text-text-on-dark-muted",
                        )}
                      >
                        {row.type}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-xs font-medium text-text-on-dark">{row.firm}</p>
                          <span className="font-mono text-[7px] uppercase text-brand-gold/80">
                            {row.signal}
                          </span>
                        </div>
                        <p className="truncate text-[10px] text-text-on-dark-muted">{row.partner}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {row.portfolio.slice(0, 2).map((co) => (
                            <span
                              key={co}
                              className="border border-white/[0.06] px-1 py-px font-mono text-[7px] text-text-on-dark-muted"
                            >
                              {co}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="font-mono text-sm tabular-nums text-brand-gold">{row.score}</span>
                    </div>
                    <ScoreBar score={row.score} className="mt-2" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {focus ? (
          <aside className="w-full shrink-0 p-3 md:p-4 xl:w-72">
            <p className="font-mono text-[8px] uppercase tracking-wider text-brand-gold">
              Investor detail
            </p>
            <p className="mt-1 text-sm font-medium text-text-on-dark">{focus.firm}</p>
            <p className="text-[11px] text-text-on-dark-muted">{focus.partner}</p>

            <p className="mt-3 text-[11px] leading-relaxed text-text-on-dark-muted">{focus.rationale}</p>

            <div className="mt-3">
              <p className="mb-1.5 font-mono text-[8px] uppercase tracking-wider text-text-on-dark-muted">
                Score breakdown
              </p>
              <BreakdownGrid breakdown={focus.breakdown} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="border border-white/[0.06] p-2">
                <p className="text-text-on-dark-muted">Check size</p>
                <p className="mt-0.5 font-mono text-text-on-dark">{focus.check}</p>
              </div>
              <div className="border border-white/[0.06] p-2">
                <p className="text-text-on-dark-muted">Last deploy</p>
                <p className="mt-0.5 font-mono text-text-on-dark">{focus.lastDeploy}</p>
              </div>
            </div>

            {focus.warmPath ? (
              <div className="mt-3 flex items-start gap-2 border border-brand-gold/20 bg-brand-gold/5 p-2">
                <Users className="mt-0.5 h-3 w-3 shrink-0 text-brand-gold" aria-hidden="true" />
                <div>
                  <p className="font-mono text-[8px] uppercase text-brand-gold">Warm path</p>
                  <p className="mt-0.5 text-[10px] text-text-on-dark-muted">{focus.warmPath}</p>
                </div>
              </div>
            ) : null}

            <div className="mt-3 space-y-1.5 border-t border-white/[0.06] pt-3">
              <div className="flex items-center gap-2 text-[10px]">
                <Mail className="h-3 w-3 text-text-on-dark-muted" aria-hidden="true" />
                <span className="text-text-on-dark-muted">partner@fund.com</span>
                {focus.emailVerified ? (
                  <Check className="ml-auto h-3 w-3 text-emerald-400" aria-hidden="true" />
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <Link2 className="h-3 w-3 text-text-on-dark-muted" aria-hidden="true" />
                <span className="select-none blur-[2px] text-text-on-dark-muted">linkedin.com/in/…</span>
                <span className="ml-auto font-mono text-[8px] text-brand-gold">Verified</span>
              </div>
            </div>

            <p className="mt-3 font-mono text-[8px] leading-relaxed text-text-on-dark-muted/80">
              Sources: SEC IAPD · PE/VC Atlas · MIT dataset
            </p>
          </aside>
        ) : null}
      </div>
    </PreviewShell>
  );
}
