import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";

type PageHeaderProps = {
  index?: string;
  label?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  narrow?: boolean;
};

export function PageHeader({
  index = "—",
  label,
  title,
  description,
  children,
  className,
  narrow,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "border-b border-border bg-surface-elevated pt-14 pb-12 md:pt-20 md:pb-16",
        className,
      )}
    >
      <Container narrow={narrow}>
        <div className="max-w-3xl">
          {label && <SectionLabel index={index} title={label} />}
          <h1
            className={cn(
              "display-serif text-balance font-semibold text-text-primary",
              label ? "mt-6 text-[2.65rem] md:text-[3.25rem]" : "text-3xl md:text-[2.75rem]",
            )}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-text-secondary md:text-lg">
              {description}
            </p>
          )}
          {children && <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
