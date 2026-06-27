import { pricingTiers } from "@/lib/content/pricing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PricingCardsProps = {
  compact?: boolean;
};

export function PricingCards({ compact }: PricingCardsProps) {
  const tier = pricingTiers[0];

  return (
    <article className="flex flex-col border border-border bg-surface-elevated p-6 md:p-8">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-text-primary">{tier.name}</h3>
        <span className="font-mono text-[10px] uppercase tracking-wider text-brand">
          All features included
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-mono text-3xl font-medium tabular-nums tracking-tight text-text-primary">
          {tier.price}
        </span>
        <span className="text-sm text-text-tertiary">{tier.period}</span>
      </div>
      {!compact && (
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">{tier.description}</p>
      )}
      <ul
        className={cn(
          "flex-1 space-y-2.5",
          compact ? "mt-5" : "mt-6 border-t border-border pt-6",
        )}
      >
        {tier.features.map((feature) => (
          <li key={feature} className="text-[13px] leading-snug text-text-secondary">
            {feature}
          </li>
        ))}
      </ul>
      <Button
        variant="primary"
        href="/start#apply"
        className="mt-8 w-full bg-brand border-brand hover:bg-brand/90"
      >
        Build your raise profile
      </Button>
      <p className="mt-2 text-center text-[11px] text-text-tertiary">
        Complete your profile first · see matches before checkout
      </p>
    </article>
  );
}
