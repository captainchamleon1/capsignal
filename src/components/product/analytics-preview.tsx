const funnel = [
  { stage: "Sent", value: 186, pct: 100 },
  { stage: "Opened", value: 112, pct: 60 },
  { stage: "Replied", value: 24, pct: 13 },
  { stage: "Meeting", value: 41, pct: 22 },
];

const segments = [
  { name: "B2B SaaS", reply: "14.2%" },
  { name: "Seed stage", reply: "12.8%" },
  { name: "US-based", reply: "11.9%" },
  { name: "Enterprise", reply: "9.4%" },
];

export function AnalyticsPreview() {
  return (
    <div className="overflow-hidden bg-surface-dark">
      <div className="flex items-center justify-between border-b border-surface-dark-border px-4 py-3">
        <span className="font-mono text-xs text-text-on-dark-muted">analytics / week-3</span>
        <span className="font-mono text-xs text-emerald-400">↑ 2.1% vs last week</span>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-medium text-text-on-dark">Conversion funnel</p>
          <div className="space-y-2">
            {funnel.map((row) => (
              <div key={row.stage} className="flex items-center gap-3">
                <span className="w-16 text-[11px] text-text-on-dark-muted">{row.stage}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-dark-raised">
                  <div
                    className="h-full rounded-full bg-text-on-dark/80"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-8 font-mono text-[11px] tabular-nums text-text-on-dark">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium text-text-on-dark">Reply rate by segment</p>
          <div className="space-y-2">
            {segments.map((seg) => (
              <div
                key={seg.name}
                className="flex items-center justify-between rounded-lg border border-surface-dark-border px-3 py-2"
              >
                <span className="text-[11px] text-text-on-dark-muted">{seg.name}</span>
                <span className="font-mono text-xs tabular-nums text-text-on-dark">{seg.reply}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
