import { cn } from "@/lib/utils";
import { selfServePricing } from "@/lib/content/guarantee";

type GuaranteeLineProps = {
  className?: string;
  suffix?: string;
  onDark?: boolean;
};

/** Trial terms line shown near pricing CTAs. */
export function GuaranteeLine({ className, suffix, onDark }: GuaranteeLineProps) {
  return (
    <p
      className={cn(
        "text-center text-[11px] leading-relaxed",
        onDark ? "text-text-on-dark-muted" : "text-text-tertiary",
        className,
      )}
    >
      {selfServePricing.trialLabel} · Cancel anytime
      {suffix ? ` · ${suffix}` : ""}
    </p>
  );
}
