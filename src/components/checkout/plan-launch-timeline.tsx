import { planLaunchSteps } from "@/lib/plan/raise-brief";
import type { RaiseProfileDraft } from "@/lib/raise-profile";
import { cn } from "@/lib/utils";

type PlanLaunchTimelineProps = {
  profile: RaiseProfileDraft;
  className?: string;
};

export function PlanLaunchTimeline({ profile, className }: PlanLaunchTimelineProps) {
  const steps = planLaunchSteps(profile);

  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
          Your first two weeks
        </p>
        <h2 className="mt-2 text-lg font-semibold text-text-primary">
          What happens after you start
        </h2>
      </div>
      <ol className="grid gap-3 md:grid-cols-3">
        {steps.map((step, i) => (
          <li
            key={step.when}
            className="relative border border-border bg-surface-muted/50 p-4 pt-5"
          >
            <span className="absolute left-4 top-0 -translate-y-1/2 bg-surface-page px-1 font-mono text-[10px] tabular-nums text-brand">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
              {step.when}
            </p>
            <p className="mt-1 text-sm font-semibold text-text-primary">{step.title}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
