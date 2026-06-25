import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

type PageSectionProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted" | "elevated" | "dark";
  size?: "default" | "sm";
  border?: "none" | "top" | "bottom" | "y";
  wide?: boolean;
  narrow?: boolean;
  id?: string;
};

const variantClasses = {
  default: "bg-surface-page",
  muted: "bg-surface-muted",
  elevated: "bg-surface-elevated",
  dark: "bg-surface-dark text-text-on-dark",
};

const sizeClasses = {
  default: "py-(--spacing-section)",
  sm: "py-(--spacing-section-sm)",
};

const borderClasses = {
  none: "",
  top: "border-t border-border",
  bottom: "border-b border-border",
  y: "hairline-y",
};

export function PageSection({
  children,
  className,
  variant = "default",
  size = "default",
  border = "none",
  wide,
  narrow,
  id,
}: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn(variantClasses[variant], sizeClasses[size], borderClasses[border], className)}
    >
      <Container wide={wide} narrow={narrow}>
        {children}
      </Container>
    </section>
  );
}
