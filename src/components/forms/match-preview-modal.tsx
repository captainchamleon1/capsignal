"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { MatchPreview } from "@/lib/leads/match-preview";

type MatchPreviewModalProps = {
  open: boolean;
  preview: MatchPreview;
  company: string;
  sector: string;
  stage: string;
  loading: boolean;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function MatchPreviewModal({
  open,
  preview,
  company,
  sector,
  stage,
  loading,
  submitting,
  onClose,
  onConfirm,
}: MatchPreviewModalProps) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!open || loading) {
      setRevealed(0);
      return;
    }
    const timers = preview.topInvestors.map((_, i) =>
      window.setTimeout(() => setRevealed((n) => Math.max(n, i + 1)), 400 + i * 280),
    );
    return () => timers.forEach(clearTimeout);
  }, [open, loading, preview.topInvestors]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, submitting, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close preview"
        onClick={() => !submitting && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-preview-title"
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden border border-border bg-surface-elevated shadow-[0_32px_100px_-20px_rgba(0,0,0,0.35)] sm:max-h-[88vh]"
      >
        <div className="border-b border-border bg-surface-dark px-5 py-5 text-text-on-dark md:px-6">
          {loading ? (
            <div className="py-6 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-surface-dark-border border-t-brand-gold" />
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-text-on-dark-muted">
                Scoring investors
              </p>
              <p className="mt-2 text-sm text-text-on-dark-muted">
                Matching {company} against live deployment signals…
              </p>
            </div>
          ) : (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-gold">
                Shortlist preview
              </p>
              <h2 id="match-preview-title" className="mt-2 text-xl font-semibold leading-snug">
                {preview.totalMatches} investors match your {stage} {sector} raise
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-surface-dark-border pt-4">
                <div>
                  <p className="font-mono text-lg tabular-nums text-text-on-dark">{preview.projectedReplies}</p>
                  <p className="text-[11px] text-text-on-dark-muted">Est. replies</p>
                </div>
                <div>
                  <p className="font-mono text-lg tabular-nums text-text-on-dark">{preview.projectedMeetings}</p>
                  <p className="text-[11px] text-text-on-dark-muted">Est. meetings</p>
                </div>
                <div>
                  <p className="font-mono text-lg tabular-nums text-text-on-dark">{preview.launchDays}d</p>
                  <p className="text-[11px] text-text-on-dark-muted">To launch</p>
                </div>
              </div>
            </>
          )}
        </div>

        {!loading && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 md:px-6">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                Top matches · ranked by fit
              </p>
              <ul className="space-y-2">
                {preview.topInvestors.map((inv, i) => (
                  <li
                    key={inv.firm}
                    className={cn(
                      "border border-border p-3 transition-all duration-500",
                      i < revealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                      inv.blurred && "relative overflow-hidden",
                    )}
                  >
                    {inv.blurred && (
                      <div
                        className="pointer-events-none absolute inset-0 z-10 backdrop-blur-[3px]"
                        aria-hidden="true"
                      />
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <div className={cn(inv.blurred && "select-none blur-[2px]")}>
                        <p className="text-sm font-medium text-text-primary">{inv.firm}</p>
                        <p className="text-xs text-text-tertiary">{inv.partner}</p>
                      </div>
                      <span className="shrink-0 font-mono text-sm tabular-nums text-brand">{inv.score}</span>
                    </div>
                    <p className={cn("mt-2 text-xs leading-relaxed text-text-secondary", inv.blurred && "blur-[2px]")}>
                      {inv.reason}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-center text-xs text-text-tertiary">
                +{preview.totalMatches - 5} more in your full shortlist after onboarding
              </p>
            </div>

            <div className="border-t border-border bg-surface-muted px-5 py-4 md:px-6">
              <button
                type="button"
                onClick={onConfirm}
                disabled={submitting}
                className={cn(
                  "flex h-11 w-full items-center justify-center bg-text-primary text-sm font-medium text-text-on-dark transition-colors hover:bg-[var(--primary-hover)]",
                  submitting && "opacity-70",
                )}
              >
                {submitting ? "Submitting…" : "Request full shortlist — it's free to review"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="mt-2 w-full py-2 text-center text-xs text-text-tertiary hover:text-text-secondary"
              >
                Back to edit profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
