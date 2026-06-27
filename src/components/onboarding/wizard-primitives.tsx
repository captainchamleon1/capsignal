"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { onboardingMeta, onboardingSteps, unlockMilestones } from "@/lib/content/onboarding";

type WizardProgressProps = {
  step: number;
  className?: string;
};

export function WizardProgress({ step, className }: WizardProgressProps) {
  const pct = Math.round((step / onboardingMeta.stepsCount) * 100);

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
            Step {step} of {onboardingMeta.stepsCount}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-text-primary">
            {onboardingSteps[step - 1]?.label}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-lg font-medium tabular-nums text-brand">{pct}%</p>
          <p className="text-[11px] text-text-tertiary">{onboardingMeta.timeEstimate}</p>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden bg-surface-muted">
        <div
          className="h-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Mobile step pills */}
      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 lg:hidden [-webkit-overflow-scrolling:touch]">
        {onboardingSteps.map((s) => (
          <span
            key={s.key}
            className={cn(
              "shrink-0 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider",
              step === s.id
                ? "bg-brand text-white"
                : step > s.id
                  ? "bg-brand-tint text-brand"
                  : "bg-surface-muted text-text-tertiary",
            )}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

type WizardStepHeaderProps = {
  step: number;
};

export function WizardStepHeader({ step }: WizardStepHeaderProps) {
  const config = onboardingSteps[step - 1];
  if (!config) return null;

  return (
    <div className="border-b border-border pb-5 md:pb-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
        {config.label} · ~{config.eta}
      </p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight text-text-primary md:mt-3 md:text-2xl">
        {config.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{config.subtitle}</p>
      <p className="mt-3 border-l-2 border-brand/40 bg-brand-tint/50 py-2 pl-3 pr-3 text-xs leading-relaxed text-text-secondary md:mt-4 md:py-2.5 md:pr-4">
        <span className="font-medium text-text-primary">Why we ask: </span>
        {config.why}
      </p>
    </div>
  );
}

type SelectableCardProps = {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  compact?: boolean;
};

export function SelectableCard({
  selected,
  onClick,
  title,
  description,
  compact,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full border text-left transition-all duration-150 active:scale-[0.99]",
        compact ? "min-h-[44px] px-3 py-3" : "min-h-[52px] px-4 py-3.5",
        selected
          ? "border-brand bg-brand-tint shadow-[inset_0_0_0_1px_var(--brand)]"
          : "border-border bg-surface-elevated hover:border-border-strong hover:bg-surface-muted",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm leading-snug",
              selected ? "font-medium text-brand" : "font-medium text-text-primary",
            )}
          >
            {title}
          </p>
          {description && (
            <p className="mt-0.5 text-xs leading-snug text-text-tertiary">{description}</p>
          )}
        </div>
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors",
            selected ? "border-brand bg-brand text-white" : "border-border bg-surface-page",
          )}
        >
          {selected && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
      </div>
    </button>
  );
}

type MobileProfileStripProps = {
  step: number;
  data: {
    name?: string;
    company?: string;
    sector?: string;
    stage?: string;
  };
};

export function MobileProfileStrip({ step, data }: MobileProfileStripProps) {
  const chips = [
    data.name,
    data.company,
    data.sector,
    data.stage,
  ].filter(Boolean) as string[];

  if (chips.length === 0) return null;

  return (
    <div className="lg:hidden">
      <p className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
        Profile so far
      </p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
        {chips.map((chip) => (
          <span
            key={chip}
            className="shrink-0 border border-border bg-surface-muted px-2.5 py-1 text-xs text-text-secondary"
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-1">
        {unlockMilestones.slice(0, step).map((m) => (
          <div key={m.step} className="h-1 flex-1 bg-brand" aria-hidden="true" />
        ))}
        {unlockMilestones.slice(step).map((m) => (
          <div key={m.step} className="h-1 flex-1 bg-surface-muted" aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}

type ProfilePreviewPanelProps = {
  step: number;
  data: {
    name?: string;
    email?: string;
    company?: string;
    sector?: string;
    segment?: string;
    stage?: string;
    raise?: string;
    priorFunding?: string;
  };
};

export function ProfilePreviewPanel({ step, data }: ProfilePreviewPanelProps) {
  const rows = [
    data.name && { label: "Founder", value: data.name },
    data.company && { label: "Company", value: data.company },
    data.sector && { label: "Industry", value: data.sector },
    data.segment && { label: "Segment", value: data.segment },
    data.stage && { label: "Stage", value: data.stage },
    data.raise && { label: "Target raise", value: data.raise },
    data.priorFunding && { label: "Prior funding", value: data.priorFunding },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="hidden lg:block">
      <div className="sticky top-24 space-y-6">
        <div className="border border-border bg-surface-elevated p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
            Your raise profile
          </p>
          {rows.length === 0 ? (
            <p className="mt-4 text-sm text-text-tertiary">
              Fields populate here as you complete each step.
            </p>
          ) : (
            <dl className="mt-4 space-y-3">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between gap-4 border-t border-border pt-3 first:border-t-0 first:pt-0"
                >
                  <dt className="text-xs text-text-tertiary">{row.label}</dt>
                  <dd className="text-right text-xs font-medium text-text-primary">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="border border-border bg-surface-muted p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
            Unlocks as you go
          </p>
          <ul className="mt-4 space-y-2.5">
            {unlockMilestones.map((m) => (
              <li key={m.step} className="flex items-center gap-2.5 text-xs">
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center font-mono text-[10px]",
                    step >= m.step
                      ? "bg-brand text-white"
                      : "border border-border bg-surface-elevated text-text-tertiary",
                  )}
                >
                  {step > m.step ? <Check className="h-3 w-3" /> : m.step}
                </span>
                <span className={step >= m.step ? "text-text-primary" : "text-text-tertiary"}>
                  {m.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function WizardTrustFooter() {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-border pt-4 md:mt-6 md:gap-x-6 md:pt-5">
      {["No spam", "Source-attributed data", "Cancel anytime"].map((item) => (
        <span key={item} className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
          <Check className="h-3 w-3 text-brand" aria-hidden="true" />
          {item}
        </span>
      ))}
    </div>
  );
}

type WizardStickyActionsProps = {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  error?: string | null;
};

export function WizardStickyActions({
  step,
  onBack,
  onNext,
  nextLabel,
  error,
}: WizardStickyActionsProps) {
  return (
    <>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="wizard-sticky-actions flex gap-3">
        {step > 1 && (
          <Button type="button" variant="secondary" className="min-h-[48px] flex-1" onClick={onBack}>
            Back
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          className="min-h-[48px] flex-1 bg-brand border-brand hover:bg-brand/90"
          onClick={onNext}
        >
          {nextLabel}
        </Button>
      </div>
    </>
  );
}
