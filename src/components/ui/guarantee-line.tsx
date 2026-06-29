import { cn } from "@/lib/utils";
import { guarantee } from "@/lib/content/guarantee";

type GuaranteeLineProps = {
  className?: string;
  suffix?: string;
  /** Use muted styling on dark backgrounds */
  onDark?: boolean;
};

export function GuaranteeLine({ className, suffix, onDark }: GuaranteeLineProps) {
  return (
    <p
      className={cn(
        "text-center text-xs font-semibold leading-snug sm:text-[13px]",
        onDark ? "text-text-on-dark" : "text-text-primary",
        className,
      )}
    >
      {guarantee.short}
      {suffix ? (
        <span className={cn("font-normal", onDark ? "text-text-on-dark-muted" : "text-text-tertiary")}>
          {" "}
          · {suffix}
        </span>
      ) : null}
    </p>
  );
}
