const investors = [
  { firm: "Horizon Capital", partner: "M. Reeves", score: 94, status: "Replied", tag: "B2B SaaS" },
  { firm: "Northwind Ventures", partner: "E. Vasquez", score: 91, status: "Meeting", tag: "Seed" },
  { firm: "Basecamp Fund", partner: "A. Park", score: 87, status: "Opened", tag: "Enterprise" },
  { firm: "Summit Partners", partner: "R. Chen", score: 84, status: "Sent", tag: "Growth" },
  { firm: "Lattice Ventures", partner: "K. Morgan", score: 79, status: "Queued", tag: "Seed" },
];

const activity = [
  { time: "09:14", event: "Reply from Horizon Capital", type: "reply" },
  { time: "08:42", event: "Meeting booked — Northwind", type: "meeting" },
  { time: "Yesterday", event: "Sequence step 2 sent (38 investors)", type: "send" },
  { time: "Yesterday", event: "Basecamp Fund opened email", type: "open" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Replied: "text-text-on-dark bg-surface-dark-raised",
    Meeting: "text-text-on-dark bg-surface-dark-raised",
    Opened: "text-text-on-dark-muted bg-white/5",
    Sent: "text-text-on-dark-muted bg-white/5",
    Queued: "text-text-on-dark-muted bg-white/5",
  };

  return (
    <span className={`px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${styles[status] ?? styles.Queued}`}>
      {status}
    </span>
  );
}

export function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-none border-0 bg-surface-dark">
      <div className="flex items-center justify-between border-b border-surface-dark-border px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-on-dark-muted">meridian-seed-q2</span>
          <span className="hidden h-4 w-px bg-surface-dark-border sm:block" />
          <span className="hidden text-xs text-text-on-dark-muted sm:inline">Investors</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs tabular-nums text-text-on-dark-muted">
          <span>186 sent</span>
          <span className="text-text-on-dark">24 replies</span>
          <span className="text-text-on-dark">11.4%</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="hidden w-44 shrink-0 border-r border-surface-dark-border p-3 md:block">
          <p className="mb-3 px-2 font-mono text-[10px] uppercase tracking-wider text-text-on-dark-muted">
            Campaign
          </p>
          {["Overview", "Investors", "Sequences", "Analytics"].map((item, i) => (
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
          <div className="overflow-x-auto rounded-lg border border-surface-dark-border">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead>
                <tr className="border-b border-surface-dark-border bg-surface-dark-raised/50">
                  <th className="px-3 py-2 font-medium text-text-on-dark-muted">Firm</th>
                  <th className="px-3 py-2 font-medium text-text-on-dark-muted">Score</th>
                  <th className="px-3 py-2 font-medium text-text-on-dark-muted">Focus</th>
                  <th className="px-3 py-2 font-medium text-text-on-dark-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {investors.map((row) => (
                  <tr key={row.firm} className="border-b border-surface-dark-border/60 last:border-0">
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-text-on-dark">{row.firm}</p>
                      <p className="text-[11px] text-text-on-dark-muted">{row.partner}</p>
                    </td>
                    <td className="px-3 py-2.5 font-mono tabular-nums text-text-on-dark">{row.score}</td>
                    <td className="px-3 py-2.5 text-text-on-dark-muted">{row.tag}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full border-t border-surface-dark-border p-3 lg:w-56 lg:border-t-0 lg:border-l lg:p-4">
          <p className="mb-3 text-xs font-medium text-text-on-dark">Recent activity</p>
          <ul className="space-y-3">
            {activity.map((item) => (
              <li key={item.event} className="text-[11px] leading-snug">
                <span className="font-mono tabular-nums text-text-on-dark-muted">{item.time}</span>
                <p className="mt-0.5 text-text-on-dark-muted">{item.event}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-surface-dark-border bg-surface-dark-raised p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-on-dark-muted">
              This week
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-text-on-dark">41</p>
            <p className="text-[11px] text-text-on-dark-muted">Meetings booked</p>
          </div>
        </div>
      </div>
    </div>
  );
}
