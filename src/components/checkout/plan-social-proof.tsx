import type { RaiseBriefInsights } from "@/lib/plan/raise-brief";
import { cn } from "@/lib/utils";

type PlanSocialProofProps = {
  brief: RaiseBriefInsights;
  className?: string;
};

export function PlanSocialProof({ brief, className }: PlanSocialProofProps) {
  const { testimonial } = brief;

  return (
    <blockquote
      className={cn(
        "border-l-2 border-brand bg-surface-muted/60 px-4 py-4 sm:px-5",
        className,
      )}
    >
      <p className="text-[14px] leading-relaxed text-text-primary">&ldquo;{testimonial.quote}&rdquo;</p>
      <footer className="mt-3 text-[12px] text-text-secondary">
        <span className="font-medium text-text-primary">{testimonial.name}</span>
        {" · "}
        {testimonial.role}, {testimonial.company}
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
          {testimonial.stage} · {testimonial.sector}
          {testimonial.highlight ? ` · ${testimonial.highlight}` : ""}
        </span>
      </footer>
    </blockquote>
  );
}
