import {
  Mail,
  Sparkles,
  Clock,
  Check,
  FileEdit,
  Reply,
  ShieldCheck,
  PauseCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { previewSequence } from "@/lib/content/product-previews";
import {
  PreviewShell,
  PreviewStatPill,
  PreviewFilterChip,
} from "@/components/product/preview-shell";

const statusConfig = {
  sent: { label: "Sent", icon: Check, className: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
  scheduled: { label: "Scheduled", icon: Clock, className: "text-brand-gold border-brand-gold/30 bg-brand-gold/10" },
  draft: { label: "Draft", icon: FileEdit, className: "text-text-on-dark-muted border-white/10 bg-white/[0.03]" },
} as const;

const recipientStatus = {
  replied: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  opened: "text-brand-gold bg-brand-gold/10 border-brand-gold/30",
  queued: "text-text-on-dark-muted bg-white/[0.03] border-white/10",
} as const;

export function SequencesPreview() {
  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <PreviewFilterChip label={previewSequence.campaign} active />
      <PreviewFilterChip label="SPF/DKIM active" active />
      <PreviewFilterChip label="Pause on reply" active />
    </div>
  );

  const statusBar = (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-1.5">
        {previewSequence.batchStats.map((s) => (
          <PreviewStatPill key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
      <span className="hidden font-mono text-[8px] text-text-on-dark-muted sm:inline">
        {previewSequence.settings.throttle}
      </span>
    </div>
  );

  return (
    <PreviewShell
      module="Outreach sequences"
      path="sequences / seed-batch-01 / point-nine-capital"
      badge="yourco.com"
      toolbar={toolbar}
      statusBar={statusBar}
      minHeight="min-h-[480px] md:min-h-[540px]"
    >
      <div className="grid h-full lg:grid-cols-[200px_1fr_1.15fr]">
        {/* Recipients + deliverability */}
        <div className="border-b border-white/[0.06] p-3 lg:border-b-0 lg:border-r">
          <p className="mb-2 font-mono text-[8px] uppercase tracking-wider text-text-on-dark-muted">
            Batch queue
          </p>
          <ul className="space-y-1.5">
            {previewSequence.recipients.map((r) => (
              <li
                key={r.firm}
                className={cn(
                  "border px-2 py-2",
                  r.status === "replied"
                    ? "border-brand/30 bg-brand/10"
                    : "border-white/[0.06] bg-white/[0.02]",
                )}
              >
                <p className="truncate text-[10px] font-medium text-text-on-dark">{r.firm}</p>
                <p className="truncate text-[9px] text-text-on-dark-muted">{r.partner}</p>
                <span
                  className={cn(
                    "mt-1 inline-block border px-1 py-px font-mono text-[7px] uppercase",
                    recipientStatus[r.status],
                  )}
                >
                  {r.status}
                </span>
              </li>
            ))}
          </ul>

          <p className="mb-2 mt-4 font-mono text-[8px] uppercase tracking-wider text-text-on-dark-muted">
            Deliverability
          </p>
          <ul className="space-y-1">
            {previewSequence.deliverability.map((d) => (
              <li key={d.label} className="flex items-center gap-2 text-[10px]">
                <ShieldCheck
                  className={cn("h-3 w-3", d.ok ? "text-emerald-400" : "text-text-on-dark-muted")}
                  aria-hidden="true"
                />
                <span className="text-text-on-dark-muted">{d.label}</span>
                {"detail" in d && d.detail ? (
                  <span className="ml-auto font-mono text-[9px] text-text-on-dark">{d.detail}</span>
                ) : (
                  <Check className="ml-auto h-3 w-3 text-emerald-400" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>

          <div className="mt-3 border border-white/[0.06] p-2">
            <p className="font-mono text-[7px] uppercase text-text-on-dark-muted">Send window</p>
            <p className="mt-1 text-[9px] leading-snug text-text-on-dark-muted">
              {previewSequence.settings.sendWindow}
            </p>
            {previewSequence.settings.pauseOnReply ? (
              <p className="mt-2 flex items-center gap-1 text-[9px] text-brand-gold">
                <PauseCircle className="h-3 w-3" aria-hidden="true" />
                Auto-pause on reply
              </p>
            ) : null}
          </div>
        </div>

        {/* Timeline */}
        <div className="border-b border-white/[0.06] p-3 lg:border-b-0 lg:border-r">
          <p className="mb-3 font-mono text-[8px] uppercase tracking-wider text-text-on-dark-muted">
            Cadence · 4 touchpoints
          </p>
          <ol className="relative">
            <div
              className="absolute bottom-2 left-[11px] top-2 w-px bg-gradient-to-b from-brand via-brand-gold/40 to-white/10"
              aria-hidden="true"
            />
            {previewSequence.steps.map((step) => {
              const cfg = statusConfig[step.status];
              const Icon = cfg.icon;
              return (
                <li key={step.day} className="relative flex gap-2.5 pb-3 last:pb-0">
                  <span
                    className={cn(
                      "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[8px]",
                      step.status === "sent"
                        ? "border-brand bg-brand text-white"
                        : "border-white/15 bg-surface-dark text-text-on-dark-muted",
                    )}
                  >
                    {step.day}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-[11px] font-medium text-text-on-dark">{step.label}</p>
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 border px-1 py-px font-mono text-[7px] uppercase",
                          cfg.className,
                        )}
                      >
                        <Icon className="h-2 w-2" aria-hidden="true" />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-[9px] text-text-on-dark-muted">{step.sentAt}</p>
                    {(step.opens > 0 || step.replies > 0) && (
                      <p className="mt-1 text-[9px] text-text-on-dark-muted">
                        {step.opens > 0 ? `${step.opens} opens` : null}
                        {step.opens > 0 && step.replies > 0 ? " · " : null}
                        {step.replies > 0 ? `${step.replies} reply` : null}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Email + reply */}
        <div className="flex flex-col p-3">
          <div className="mb-2 flex items-center gap-2 border border-brand-gold/25 bg-brand-gold/10 px-2.5 py-2">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand-gold" aria-hidden="true" />
            <p className="text-[9px] leading-snug text-text-on-dark-muted">
              Thesis hook references Typeform + Front portfolio overlap · personalized per investor
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col border border-white/[0.08] bg-white/[0.03]">
            <div className="space-y-1 border-b border-white/[0.06] px-3 py-2.5">
              <div className="flex items-center gap-2 text-[10px] text-text-on-dark-muted">
                <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>{previewSequence.from}</span>
              </div>
              <p className="text-[10px] text-text-on-dark-muted">To: {previewSequence.to}</p>
              <p className="text-[11px] font-medium leading-snug text-text-on-dark">
                {previewSequence.subject}
              </p>
            </div>
            <div className="flex-1 space-y-2 px-3 py-2.5">
              {previewSequence.bodyParagraphs.map((p) => (
                <p key={p.slice(0, 24)} className="text-[10px] leading-relaxed text-text-on-dark-muted">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-2 border border-emerald-400/25 bg-emerald-400/5 p-2.5">
            <div className="flex items-center gap-2">
              <Reply className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              <p className="font-mono text-[8px] uppercase text-emerald-400">Reply detected</p>
              <span className="ml-auto font-mono text-[8px] text-text-on-dark-muted">
                {previewSequence.replySnippet.time}
              </span>
            </div>
            <p className="mt-1 text-[10px] font-medium text-text-on-dark">
              {previewSequence.replySnippet.from}
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-text-on-dark-muted">
              &ldquo;{previewSequence.replySnippet.preview}&rdquo;
            </p>
            <p className="mt-2 font-mono text-[8px] text-emerald-400/80">
              Sequence paused · CRM updated · follow-up cancelled
            </p>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}
