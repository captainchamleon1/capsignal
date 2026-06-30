import { cn } from "@/lib/utils";

type PreviewShellProps = {
  module: string;
  path: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  toolbar?: React.ReactNode;
  statusBar?: React.ReactNode;
};

export function PreviewShell({
  module,
  path,
  badge,
  children,
  className,
  minHeight = "min-h-[420px] md:min-h-[480px]",
  toolbar,
  statusBar,
}: PreviewShellProps) {
  return (
    <div className={cn("relative overflow-hidden bg-surface-dark", minHeight, className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 10% -10%, rgba(21, 102, 71, 0.22), transparent 55%),
            radial-gradient(ellipse 60% 50% at 100% 100%, rgba(196, 154, 60, 0.08), transparent 50%),
            linear-gradient(180deg, #0a0a0a 0%, #0d0f0e 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative flex h-full min-h-[inherit] flex-col">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5 backdrop-blur-sm">
          <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/90" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
              {module}
            </p>
            <p className="truncate font-mono text-[9px] text-text-on-dark-muted">{path}</p>
          </div>
          {badge ? (
            <span className="shrink-0 border border-brand-gold/30 bg-brand-gold/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-brand-gold">
              {badge}
            </span>
          ) : null}
        </div>

        {toolbar ? (
          <div className="border-b border-white/[0.06] bg-white/[0.02] px-3 py-2 md:px-4">
            {toolbar}
          </div>
        ) : null}

        <div className="relative min-h-0 flex-1 overflow-auto">{children}</div>

        {statusBar ? (
          <div className="border-t border-white/[0.06] bg-black/20 px-3 py-2 md:px-4">
            {statusBar}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ScoreBar({ score, className }: { score: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-brand-gold"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="font-mono text-xs tabular-nums text-brand-gold">{score}</span>
    </div>
  );
}

export function PreviewStatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/[0.08] bg-white/[0.03] px-2 py-1.5">
      <p className="font-mono text-[8px] uppercase tracking-wider text-text-on-dark-muted">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-sm tabular-nums text-text-on-dark">{value}</p>
    </div>
  );
}

export function BreakdownGrid({
  breakdown,
}: {
  breakdown: { deployment: number; thesis: number; check: number; geo: number };
}) {
  const rows = [
    { key: "Deployment", value: breakdown.deployment },
    { key: "Thesis", value: breakdown.thesis },
    { key: "Check size", value: breakdown.check },
    { key: "Geo", value: breakdown.geo },
  ];
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {rows.map((row) => (
        <div key={row.key} className="bg-white/[0.03] px-2 py-1.5">
          <p className="font-mono text-[7px] uppercase tracking-wider text-text-on-dark-muted">
            {row.key}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full bg-brand/80" style={{ width: `${row.value}%` }} />
            </div>
            <span className="font-mono text-[9px] tabular-nums text-text-on-dark">{row.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PreviewFilterChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className={cn(
        "shrink-0 border px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider",
        active
          ? "border-brand/40 bg-brand/15 text-brand-gold"
          : "border-white/[0.08] text-text-on-dark-muted",
      )}
    >
      {label}
    </span>
  );
}
