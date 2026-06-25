import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  size?: "default" | "sm";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-text-primary text-text-on-dark border border-text-primary hover:bg-[var(--primary-hover)]",
  secondary:
    "bg-transparent text-text-primary border border-border hover:border-border-strong hover:bg-surface-muted",
  ghost:
    "text-text-secondary hover:text-text-primary border border-transparent bg-transparent hover:bg-surface-muted",
};

export function Button({
  children,
  variant = "primary",
  href,
  className,
  size = "default",
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-medium transition-colors duration-150 ease-out",
    size === "default" ? "h-10 px-4 text-sm" : "h-9 px-3.5 text-sm",
    variants[variant],
    disabled && "pointer-events-none opacity-60",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
