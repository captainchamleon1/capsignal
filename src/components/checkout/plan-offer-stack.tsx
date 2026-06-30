import {
  Target,
  Sparkles,
  Users,
  FolderLock,
  Presentation,
  Headphones,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { planOfferProof } from "@/lib/content/plan-offer";
import { buildPersonalizedPillars } from "@/lib/plan/raise-brief";
import type { RaiseProfileDraft } from "@/lib/raise-profile";

const pillarIcons = {
  matching: Target,
  outreach: Sparkles,
  crm: Users,
  dataroom: FolderLock,
  deck: Presentation,
  support: Headphones,
} as const;

type PlanOfferStackProps = {
  profile: RaiseProfileDraft;
  className?: string;
  compact?: boolean;
};

export function PlanOfferStack({ profile, className, compact }: PlanOfferStackProps) {
  const pillars = buildPersonalizedPillars(profile);

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
          Everything included
        </p>
        <h2 className="mt-2 text-lg font-semibold text-text-primary md:text-xl">
          Included in your subscription
        </h2>
      </div>

      <ul className="space-y-3">
        {pillars.map((pillar) => {
          const Icon = pillarIcons[pillar.id];
          return (
            <li
              key={pillar.id}
              className="flex gap-3 border border-border bg-surface-muted/60 p-3.5 sm:p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-brand-tint text-brand">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <p className="text-sm font-semibold text-text-primary">{pillar.title}</p>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-brand">
                    {pillar.highlight}
                  </span>
                </div>
                {!compact && (
                  <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
                    {pillar.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <ul className="space-y-2 border-t border-border pt-4">
        {planOfferProof.map((line) => (
          <li key={line} className="flex items-start gap-2 text-[13px] text-text-secondary">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
