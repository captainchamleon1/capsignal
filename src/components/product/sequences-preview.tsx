const steps = [
  { day: 0, label: "Initial outreach", status: "scheduled" as const },
  { day: 3, label: "Follow-up #1", status: "scheduled" as const },
  { day: 7, label: "Follow-up #2", status: "scheduled" as const },
  { day: 14, label: "Final touch", status: "scheduled" as const },
];

export function SequencesPreview() {
  return (
    <div className="overflow-hidden bg-surface-dark">
      <div className="border-b border-surface-dark-border px-4 py-3">
        <span className="font-mono text-xs text-text-on-dark-muted">sequences / example-cadence</span>
      </div>
      <div className="p-4">
        <p className="mb-4 text-[11px] text-text-on-dark-muted">
          Sequence steps appear when you launch a campaign. Metrics are tracked from your outreach.
        </p>
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.label}
              className="flex items-center gap-4 rounded-lg border border-surface-dark-border bg-surface-dark-raised/50 px-4 py-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 font-mono text-[10px] text-text-on-dark-muted">
                {step.day}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-text-on-dark">{step.label}</p>
                <p className="text-[10px] text-text-on-dark-muted">Not started</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
