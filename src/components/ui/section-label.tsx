import { cn } from "@/lib/utils";

type SectionLabelProps = {
  index: string;
  title: string;
  className?: string;
};

export function SectionLabel({ index, title, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3.5", className)}>
      <span className="font-mono text-[10px] tabular-nums tracking-[0.2em] text-text-tertiary">
        {index}
      </span>
      <span className="h-px w-8 bg-border" aria-hidden="true" />
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
        {title}
      </span>
    </div>
  );
}
