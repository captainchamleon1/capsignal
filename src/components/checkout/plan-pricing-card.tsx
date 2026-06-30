import { selfServePricing } from "@/lib/content/guarantee";
import { capsignalPlan } from "@/lib/content/pricing";
import { planOffer } from "@/lib/content/plan-offer";
import { GuaranteeLine } from "@/components/ui/guarantee-line";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PlanPricingCardProps = {
  checkoutHref?: string;
  onCheckout?: () => void;
  loading?: boolean;
  className?: string;
  suffix?: string;
  ctaLabel?: string;
  company?: string;
};

export function PlanPricingCard({
  checkoutHref,
  onCheckout,
  loading,
  className,
  suffix,
  ctaLabel,
  company,
}: PlanPricingCardProps) {
  const buttonLabel = ctaLabel ?? selfServePricing.cta;

  return (
    <div
      className={cn(
        "border border-border bg-surface-elevated p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      {company ? (
        <p className="mb-4 text-center text-sm text-text-secondary">
          {company} · {selfServePricing.trialLabel}
        </p>
      ) : null}

      <div className="grid gap-3 border-b border-border pb-4 sm:grid-cols-2">
        <div className="rounded border border-dashed border-border bg-surface-muted/80 px-3 py-2.5">
          <p className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
            {planOffer.vsAdvisor.label}
          </p>
          <p className="mt-1 text-sm font-medium text-text-secondary line-through decoration-text-tertiary/60">
            {planOffer.vsAdvisor.price}
          </p>
          <p className="mt-0.5 text-[11px] text-text-tertiary">{planOffer.vsAdvisor.note}</p>
        </div>
        <div className="rounded border border-brand/30 bg-brand-tint px-3 py-2.5">
          <p className="font-mono text-[9px] uppercase tracking-wider text-brand">
            {planOffer.vsCapSignal.label}
          </p>
          <p className="mt-1 text-sm font-semibold text-text-primary">{planOffer.vsCapSignal.price}</p>
          <p className="mt-0.5 text-[11px] text-text-secondary">{planOffer.vsCapSignal.note}</p>
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
          {selfServePricing.trialLabel}
        </p>
        <div className="mt-2 flex items-baseline justify-center gap-2">
          <span className="font-mono text-4xl font-medium tabular-nums text-text-primary">$0</span>
          <span className="text-sm text-text-tertiary">today</span>
        </div>
        <p className="mt-2 text-sm text-text-secondary">
          then {capsignalPlan.price}/mo · {planOffer.ctaSubline}
        </p>
      </div>

      {checkoutHref ? (
        <Button
          variant="primary"
          href={checkoutHref}
          className="mt-5 h-12 w-full bg-brand border-brand text-base hover:bg-brand/90"
        >
          {buttonLabel}
        </Button>
      ) : (
        <Button
          type="button"
          variant="primary"
          className="mt-5 min-h-[52px] w-full bg-brand border-brand text-base hover:bg-brand/90"
          disabled={loading}
          onClick={onCheckout}
        >
          {loading ? "Redirecting to Stripe…" : buttonLabel}
        </Button>
      )}

      <GuaranteeLine className="mt-4" suffix={suffix} />
    </div>
  );
}
