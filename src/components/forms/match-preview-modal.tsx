"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Lock, SearchCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInvestorCount } from "@/lib/match-display";
import type { MatchPreview } from "@/lib/leads/match-types";
import { MatchScanLoader } from "@/components/forms/match-scan-loader";
import { GuaranteeLine } from "@/components/ui/guarantee-line";
import { selfServePricing } from "@/lib/content/guarantee";

type ProfileSummary = {
  name: string;
  company: string;
  city?: string;
  sector: string;
  stage: string;
  raise: string;
};

type MatchPreviewModalProps = {
  open: boolean;
  preview: MatchPreview;
  company: string;
  city?: string;
  sector: string;
  stage: string;
  loading: boolean;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  showGuarantee?: boolean;
  profileSummary?: ProfileSummary;
};

export function MatchPreviewModal({
  open,
  preview,
  company,
  city,
  sector,
  stage,
  loading,
  submitting,
  onClose,
  onConfirm,
  confirmLabel = selfServePricing.cta,
  showGuarantee = true,
  profileSummary,
}: MatchPreviewModalProps) {
  const [revealed, setRevealed] = useState(0);
  const isEmpty = preview.topInvestors.length === 0;
  const poolSize = preview.estimatedMatches;
  const remainingMatches = Math.max(0, poolSize - preview.topInvestors.length);

  useEffect(() => {
    if (!open || loading || isEmpty) {
      setRevealed(0);
      return;
    }
    const timers = preview.topInvestors.map((_, i) =>
      window.setTimeout(() => setRevealed((n) => Math.max(n, i + 1)), 350 + i * 220),
    );
    return () => timers.forEach(clearTimeout);
  }, [open, loading, isEmpty, preview.topInvestors]);

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

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close preview"
        onClick={() => !submitting && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-preview-title"
        className="relative flex h-[min(92dvh,100%)] max-h-[92dvh] w-full max-w-2xl min-h-0 flex-col overflow-hidden border border-border bg-surface-elevated shadow-[0_40px_120px_-24px_rgba(0,0,0,0.45)] sm:h-auto sm:max-h-[min(88vh,900px)]"
      >
        <div className="shrink-0 border-b border-border bg-surface-dark px-4 py-5 text-text-on-dark sm:px-6 md:px-8 md:py-6">
          {profileSummary && !loading && (
            <div className="mb-5 flex flex-wrap gap-2">
              {[
                profileSummary.company,
                profileSummary.city,
                profileSummary.stage,
                profileSummary.sector,
                profileSummary.raise,
              ]
                .filter(Boolean)
                .map((chip) => (
                  <span
                    key={chip}
                    className="border border-surface-dark-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-text-on-dark-muted"
                  >
                    {chip}
                  </span>
                ))}
            </div>
          )}

          {loading ? (
            <MatchScanLoader company={company} city={city} sector={sector} stage={stage} />
          ) : isEmpty ? (
            <>
              {profileSummary && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {[
                    profileSummary.company,
                    profileSummary.city,
                    profileSummary.stage,
                    profileSummary.sector,
                    profileSummary.raise,
                  ]
                    .filter(Boolean)
                    .map((chip) => (
                      <span
                        key={chip}
                        className="border border-surface-dark-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-text-on-dark-muted"
                      >
                        {chip}
                      </span>
                    ))}
                </div>
              )}
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-gold">
                Profile received
              </p>
              <h2
                id="match-preview-title"
                className="display-serif mt-3 text-2xl font-semibold leading-tight text-text-on-dark sm:text-3xl"
              >
                Our team will finish your match set
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-on-dark-muted sm:text-[17px]">
                {preview.emptyMessage ??
                  "We could not auto-score every investor from current source data — a human review produces sharper matches for niche profiles."}
              </p>
            </>
          ) : (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-gold">
                Top matches · profile scored
              </p>
              <h2 id="match-preview-title" className="mt-2 text-xl font-semibold leading-snug md:text-2xl">
                Your top matches
              </h2>
              <p className="mt-3 text-sm text-text-on-dark-muted">
                {formatInvestorCount(poolSize)} investors in our database match your {stage}{" "}
                {sector} raise
                {city ? ` near ${city}` : ""}. Ranked by stage fit, sector overlap, check size, and
                deployment signals — contact details unlock after subscription.
              </p>
            </>
          )}
        </div>

        {!loading && !isEmpty && (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 md:px-8 md:py-5 [-webkit-overflow-scrolling:touch]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                  Top matches · ranked by fit
                </p>
                <p className="text-[11px] text-text-tertiary">
                  Ranked by fit · {formatInvestorCount(poolSize)} in your match pool
                </p>
              </div>
              <ul className="space-y-3">
                {preview.topInvestors.map((inv, i) => (
                  <li
                    key={`${inv.firm}-${i}`}
                    className={cn(
                      "border border-border transition-all duration-500",
                      i < revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                      inv.blurred && "relative overflow-hidden",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4 p-4">
                      <div className={cn("min-w-0 flex-1", inv.blurred && "select-none blur-[2px]")}>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-text-primary">{inv.firm}</p>
                          {i < 3 && (
                            <span className="bg-brand-tint px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-brand">
                              Top fit
                            </span>
                          )}
                        </div>
                        {inv.partner && (
                          <p className="mt-0.5 text-xs text-text-tertiary">{inv.partner}</p>
                        )}
                        {inv.fundSize && (
                          <p className="mt-2 text-xs text-text-secondary">
                            {inv.fundSize}
                            {inv.checkSize ? ` · ${inv.checkSize}` : ""}
                          </p>
                        )}
                        {inv.investments && inv.investments.length > 0 && (
                          <p className="mt-1 text-xs text-text-tertiary">
                            Portfolio: {inv.investments.slice(0, 3).join(", ")}
                          </p>
                        )}
                        <p className="mt-2 text-xs leading-relaxed text-text-secondary">{inv.reason}</p>
                      </div>
                      <div className="shrink-0 text-center">
                        <span className="font-mono text-2xl font-medium tabular-nums text-brand">
                          {inv.score}
                        </span>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
                          fit
                        </p>
                      </div>
                    </div>
                    {inv.blurred && (
                      <div className="border-t border-border bg-surface-muted px-4 py-2.5">
                        <p className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
                          <Lock className="h-3 w-3" />
                          Email, LinkedIn, and pitch path locked
                        </p>
                      </div>
                    )}
                    {inv.blurred && (
                      <div
                        className="pointer-events-none absolute inset-0 z-10 bg-surface-elevated/30 backdrop-blur-[2px]"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                ))}
              </ul>
              {remainingMatches > 0 && (
                <p className="mt-5 rounded border border-dashed border-border bg-surface-muted py-4 text-center text-xs text-text-secondary">
                  +{formatInvestorCount(remainingMatches)} more AI-matched investors — unlock
                  verified emails, LinkedIn paths, and outreach sequences
                </p>
              )}
            </div>

            <div className="shrink-0 border-t border-border bg-surface-muted px-4 py-4 pb-safe sm:px-6 md:px-8 md:py-5">
              <button
                type="button"
                onClick={onConfirm}
                disabled={submitting}
                className={cn(
                  "flex min-h-[48px] w-full items-center justify-center bg-brand text-sm font-medium text-white transition-colors hover:bg-brand/90",
                  submitting && "opacity-70",
                )}
              >
                {submitting ? "Saving profile…" : confirmLabel}
              </button>
              {showGuarantee && <GuaranteeLine className="mt-3" />}
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

        {!loading && isEmpty && (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6 md:px-8 md:py-8 [-webkit-overflow-scrolling:touch]">
              <div className="mx-auto max-w-lg text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center border border-border bg-brand-tint">
                  <SearchCheck className="h-8 w-8 text-brand" aria-hidden="true" />
                </div>
                <p className="mt-6 text-lg font-semibold text-text-primary">
                  AI matching in progress
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                  We&apos;re scoring 12,000+ investor records against your stage, sector, and
                  location — usually ready within one business day if auto-match needs a hand.
                </p>
                <ul className="mt-8 space-y-4 border border-border bg-surface-muted p-5 text-left sm:p-6">
                  {[
                    "Stage, sector, and check-size fit verified by hand",
                    city
                      ? `Regional investors near ${city} prioritized first`
                      : "Regional investors in your metro prioritized first",
                    "Outreach angles drafted from your business description",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-snug text-text-secondary">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="shrink-0 border-t border-border bg-surface-muted px-4 py-5 pb-safe sm:px-6 md:px-8 md:py-6">
              <button
                type="button"
                onClick={onConfirm}
                disabled={submitting}
                className={cn(
                  "flex min-h-[52px] w-full items-center justify-center bg-brand text-base font-medium text-white transition-colors hover:bg-brand/90",
                  submitting && "opacity-70",
                )}
              >
                {submitting ? "Saving…" : "Continue — see your full matches"}
              </button>
              {showGuarantee && <GuaranteeLine className="mt-4" />}
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="mt-3 w-full py-2 text-center text-sm text-text-tertiary hover:text-text-secondary"
              >
                Back to edit profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
