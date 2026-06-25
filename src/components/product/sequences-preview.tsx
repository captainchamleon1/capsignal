const steps = [
  { day: 0, label: "Initial outreach", status: "complete", count: 62 },
  { day: 3, label: "Follow-up #1", status: "complete", count: 58 },
  { day: 7, label: "Follow-up #2", status: "active", count: 38 },
  { day: 14, label: "Final touch", status: "scheduled", count: 0 },
];

export function SequencesPreview() {
  return (
    <div className="overflow-hidden bg-surface-dark">
      <div className="border-b border-surface-dark-border px-4 py-3">
        <span className="font-mono text-xs text-text-on-dark-muted">sequences / horizon-capital</span>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.label}
              className="flex items-center gap-4 rounded-lg border border-surface-dark-border bg-surface-dark-raised/50 px-4 py-3"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] ${
                  step.status === "complete"
                    ? "bg-emerald-400/20 text-emerald-400"
                    : step.status === "active"
                      ? "bg-sky-400/20 text-sky-400"
                      : "bg-white/5 text-text-on-dark-muted"
                }`}
              >
                {step.status === "complete" ? "✓" : step.day}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-text-on-dark">{step.label}</p>
                <p className="text-[11px] text-text-on-dark-muted">Day {step.day}</p>
              </div>
              {step.count > 0 && (
                <span className="font-mono text-xs tabular-nums text-text-on-dark-muted">
                  {step.count} sent
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-surface-dark-border p-3 text-[11px] leading-relaxed text-text-on-dark-muted">
          <p className="text-text-on-dark">Subject: Meridian — infra layer for data pipelines</p>
          <p className="mt-2 line-clamp-2">
            Hi Mark — noticed Horizon&apos;s follow-on in RelayDB last month. We&apos;re building
            the orchestration layer teams use before data hits the warehouse…
          </p>
        </div>
      </div>
    </div>
  );
}
