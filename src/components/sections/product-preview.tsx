"use client";

import { useEffect, useState } from "react";
import { getDemoInvestorSample, type DemoSampleFirm } from "@/lib/data/demo-investors";
import { INVESTOR_DATABASE_SIZE } from "@/lib/match-display";

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-text-on-dark-muted bg-white/5">
      {label}
    </span>
  );
}

export function ProductPreview() {
  const [firms, setFirms] = useState<DemoSampleFirm[]>(getDemoInvestorSample(5));
  const [total, setTotal] = useState(INVESTOR_DATABASE_SIZE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/investor-sample")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.firms?.length) {
          setFirms(data.firms);
          setTotal(data.total > 0 ? data.total : INVESTOR_DATABASE_SIZE);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const displayTotal = total >= INVESTOR_DATABASE_SIZE ? `${total.toLocaleString()}+` : total.toLocaleString();

  return (
    <div className="overflow-hidden rounded-none border-0 bg-surface-dark">
      <div className="flex items-center justify-between border-b border-surface-dark-border px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-on-dark-muted">investor-database</span>
          <span className="hidden h-4 w-px bg-surface-dark-border sm:block" />
          <span className="hidden text-xs text-text-on-dark-muted sm:inline">Public source data</span>
        </div>
        <div className="font-mono text-xs tabular-nums text-text-on-dark-muted">
          {loading ? "—" : `${displayTotal} firms`}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="hidden w-44 shrink-0 border-r border-surface-dark-border p-3 md:block">
          <p className="mb-3 px-2 font-mono text-[10px] uppercase tracking-wider text-text-on-dark-muted">
            Views
          </p>
          {["Overview", "Investors", "Campaigns", "Data room"].map((item, i) => (
            <div
              key={item}
              className={`rounded-md px-2 py-1.5 text-xs ${
                i === 1
                  ? "bg-surface-dark-raised font-medium text-text-on-dark"
                  : "text-text-on-dark-muted"
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1 p-3 lg:p-4">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-xs text-text-on-dark-muted">
              Loading investor records…
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-surface-dark-border">
              <table className="w-full min-w-[480px] text-left text-xs">
                <thead>
                  <tr className="border-b border-surface-dark-border bg-surface-dark-raised/50">
                    <th className="px-3 py-2 font-medium text-text-on-dark-muted">Firm</th>
                    <th className="px-3 py-2 font-medium text-text-on-dark-muted">Data quality</th>
                    <th className="px-3 py-2 font-medium text-text-on-dark-muted">Sector (source)</th>
                    <th className="px-3 py-2 font-medium text-text-on-dark-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {firms.map((row) => (
                    <tr key={row.name} className="border-b border-surface-dark-border/60 last:border-0">
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-text-on-dark">{row.name}</p>
                        {row.partner && (
                          <p className="text-[11px] text-text-on-dark-muted">{row.partner}</p>
                        )}
                      </td>
                      <td className="px-3 py-2.5 font-mono tabular-nums text-text-on-dark">
                        {row.dataQuality}%
                      </td>
                      <td className="px-3 py-2.5 text-text-on-dark-muted">{row.sectorLabel}</td>
                      <td className="px-3 py-2.5">
                        <StatusBadge label="Source-attributed" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="w-full border-t border-surface-dark-border p-3 lg:w-56 lg:border-t-0 lg:border-l lg:p-4">
          <p className="mb-3 text-xs font-medium text-text-on-dark">Data sources</p>
          <ul className="space-y-3 text-[11px] leading-snug text-text-on-dark-muted">
            <li>SEC IAPD Form ADV (nightly)</li>
            <li>PE/VC Atlas (CC BY 4.0)</li>
            <li>Startup investor dataset (MIT)</li>
          </ul>
          <p className="mt-4 text-[10px] leading-relaxed text-text-on-dark-muted">
            Campaign activity and reply metrics appear after you run outreach — not shown here.
          </p>
        </div>
      </div>
    </div>
  );
}
