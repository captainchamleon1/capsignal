import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";

type SectionHeadingProps = {
  index?: string;
  label: string;
  title?: string;
  description?: string;
  className?: string;
  as?: "h2" | "h3";
};

export function SectionHeading({
  index = "—",
  label,
  title,
  description,
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <SectionLabel index={index} title={label} />
      {title && (
        <Tag
          className={cn(
            "display-serif mt-5 text-balance font-semibold text-text-primary",
            Tag === "h2" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
          )}
        >
          {title}
        </Tag>
      )}
      {description && (
        <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">{description}</p>
      )}
    </div>
  );
}
