const funnelStages = ["Sent", "Opened", "Replied", "Meeting"];

export function AnalyticsPreview() {
  return (
    <div className="overflow-hidden bg-surface-dark">
      <div className="flex items-center justify-between border-b border-surface-dark-border px-4 py-3">
        <span className="font-mono text-xs text-text-on-dark-muted">campaign-analytics</span>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-medium text-text-on-dark">Conversion funnel</p>
          <div className="space-y-2">
            {funnelStages.map((stage) => (
              <div key={stage} className="flex items-center gap-3">
                <span className="w-16 text-[11px] text-text-on-dark-muted">{stage}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-dark-raised" />
                <span className="w-8 font-mono text-[10px] tabular-nums text-text-on-dark-muted">—</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium text-text-on-dark">Reply rate by segment</p>
          <p className="text-[11px] leading-relaxed text-text-on-dark-muted">
            Segment breakdowns populate from your campaign after outreach runs. We do not show
            benchmark reply rates without your data.
          </p>
        </div>
      </div>
    </div>
  );
}
