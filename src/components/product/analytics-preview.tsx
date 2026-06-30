import {
  Eye,
  FileText,
  ArrowUpRight,
  MessageSquare,
  Calendar,
  TrendingUp,
  StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { previewCrm } from "@/lib/content/product-previews";
import { PreviewShell, PreviewStatPill, PreviewFilterChip } from "@/components/product/preview-shell";

const activityIcon = {
  view: Eye,
  reply: MessageSquare,
  meeting: Calendar,
  open: TrendingUp,
  network: ArrowUpRight,
} as const;

export function AnalyticsPreview() {
  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <PreviewFilterChip label="Seed raise · Q3" active />
      <PreviewFilterChip label="Week 2" active />
      <PreviewFilterChip label="All segments" />
    </div>
  );

  const statusBar = (
    <div className="flex flex-wrap gap-1.5">
      {previewCrm.metrics.map((m) => (
        <div key={m.label} className="border border-white/[0.08] bg-white/[0.03] px-2 py-1.5">
          <p className="font-mono text-[7px] uppercase tracking-wider text-text-on-dark-muted">
            {m.label}
          </p>
          <p className="font-mono text-sm tabular-nums text-text-on-dark">{m.value}</p>
          <p className="font-mono text-[7px] text-brand-gold">{m.delta}</p>
        </div>
      ))}
    </div>
  );

  return (
    <PreviewShell
      module="Investor CRM"
      path="pipeline / seed-raise-q3 / week-2"
      badge="Live"
      toolbar={toolbar}
      statusBar={statusBar}
      minHeight="min-h-[520px] md:min-h-[580px]"
    >
      <div className="space-y-4 p-3 md:p-4">
        {/* Kanban */}
        <div>
          <p className="mb-2 font-mono text-[8px] uppercase tracking-wider text-text-on-dark-muted">
            Pipeline board
          </p>
          <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
            {previewCrm.pipeline.map((col) => (
              <div
                key={col.stage}
                className={cn(
                  "min-h-[120px] border p-2",
                  col.tone === "active" && "border-brand-gold/30 bg-brand-gold/5",
                  col.tone === "gold" && "border-brand/30 bg-brand/10",
                  col.tone === "muted" && "border-white/[0.06] bg-white/[0.02]",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <p className="text-[8px] uppercase tracking-wide text-text-on-dark-muted">
                    {col.stage}
                  </p>
                  <p className="font-mono text-sm tabular-nums text-text-on-dark">{col.count}</p>
                </div>
                <ul className="mt-2 space-y-1">
                  {col.cards.map((card) => (
                    <li
                      key={card.firm}
                      className="border border-white/[0.06] bg-black/20 px-1.5 py-1.5"
                    >
                      <p className="truncate text-[10px] font-medium text-text-on-dark">
                        {card.firm}
                      </p>
                      <p className="truncate text-[9px] text-text-on-dark-muted">{card.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {/* Funnel */}
            <div className="border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="mb-2 font-mono text-[8px] uppercase tracking-wider text-text-on-dark-muted">
                Conversion funnel
              </p>
              <div className="space-y-2">
                {previewCrm.funnel.map((row) => (
                  <div key={row.stage} className="flex items-center gap-2">
                    <span className="w-16 shrink-0 text-[9px] text-text-on-dark-muted">
                      {row.stage}
                    </span>
                    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand/80 to-brand-gold/70"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right font-mono text-[9px] tabular-nums text-text-on-dark">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Segments */}
            <div className="border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="mb-2 font-mono text-[8px] uppercase tracking-wider text-text-on-dark-muted">
                Reply rate by segment
              </p>
              <table className="w-full text-left text-[10px]">
                <thead>
                  <tr className="border-b border-white/[0.06] text-text-on-dark-muted">
                    <th className="pb-1.5 font-normal">Segment</th>
                    <th className="pb-1.5 font-normal">Sent</th>
                    <th className="pb-1.5 font-normal">Replied</th>
                    <th className="pb-1.5 text-right font-normal">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {previewCrm.segments.map((row) => (
                    <tr key={row.segment} className="border-b border-white/[0.04] last:border-0">
                      <td className="py-1.5 text-text-on-dark">{row.segment}</td>
                      <td className="py-1.5 font-mono tabular-nums text-text-on-dark-muted">
                        {row.sent}
                      </td>
                      <td className="py-1.5 font-mono tabular-nums text-text-on-dark-muted">
                        {row.replied}
                      </td>
                      <td className="py-1.5 text-right font-mono tabular-nums text-brand-gold">
                        {row.rate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            {/* Deal focus */}
            <div className="border border-brand/30 bg-brand/10 p-3">
              <p className="font-mono text-[8px] uppercase tracking-wider text-brand-gold">
                Deal focus
              </p>
              <p className="mt-1 text-sm font-medium text-text-on-dark">
                {previewCrm.dealFocus.firm}
              </p>
              <p className="text-[10px] text-text-on-dark-muted">{previewCrm.dealFocus.partner}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {previewCrm.dealFocus.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-brand-gold/30 px-1 py-px font-mono text-[7px] uppercase text-brand-gold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-text-on-dark-muted">
                Stage: <span className="text-text-on-dark">{previewCrm.dealFocus.stage}</span>
              </p>
              <p className="mt-1 flex items-start gap-1.5 text-[10px] text-text-on-dark-muted">
                <StickyNote className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                {previewCrm.dealFocus.notes}
              </p>
              <p className="mt-2 font-mono text-[9px] text-brand-gold">
                Next: {previewCrm.dealFocus.nextStep}
              </p>
            </div>

            {/* Data room */}
            <div className="border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[8px] uppercase tracking-wider text-text-on-dark-muted">
                  Data room
                </p>
                <span className="font-mono text-[7px] text-text-on-dark-muted">
                  {previewCrm.dataRoom.permissions}
                </span>
              </div>
              <ul className="mt-2 space-y-1.5">
                {previewCrm.dataRoom.files.map((file) => (
                  <li key={file.name} className="flex items-start gap-2 border border-white/[0.04] p-2">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-medium text-text-on-dark">{file.name}</p>
                      <p className="text-[9px] text-text-on-dark-muted">
                        {file.views} views · {file.investors} investors
                        {file.slides > 0 ? ` · ${file.slides} slides` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activity */}
            <div className="border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="mb-2 font-mono text-[8px] uppercase tracking-wider text-text-on-dark-muted">
                Activity feed
              </p>
              <ul className="space-y-2">
                {previewCrm.activity.map((item) => {
                  const Icon = activityIcon[item.type];
                  return (
                    <li key={`${item.firm}-${item.time}`} className="flex gap-2">
                      <Icon className="mt-0.5 h-3 w-3 shrink-0 text-text-on-dark-muted" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-medium text-text-on-dark">
                          {item.firm}
                        </p>
                        <p className="text-[9px] text-text-on-dark-muted">{item.event}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[8px] text-text-on-dark-muted">
                        {item.time}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}
