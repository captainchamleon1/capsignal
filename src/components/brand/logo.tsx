import Image from "next/image";
import { siteConfig } from "@/lib/content/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showMark?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg";
};

const sizeStyles = {
  sm: {
    box: "h-8 w-8",
    scale: "scale-[1.42]",
    text: "text-sm",
  },
  md: {
    box: "h-10 w-10",
    scale: "scale-[1.42]",
    text: "text-base",
  },
  lg: {
    box: "h-12 w-12",
    scale: "scale-[1.42]",
    text: "text-lg",
  },
} as const;

export function Logo({ className, showMark = true, href = "/", size = "md" }: LogoProps) {
  const styles = sizeStyles[size];

  return (
    <a href={href} className={cn("group inline-flex items-center gap-0.5", className)}>
      {showMark && (
        <span className={cn("relative shrink-0 overflow-hidden", styles.box)}>
          <Image
            src="/brand/logo-square.png"
            alt=""
            width={512}
            height={512}
            className={cn("h-full w-full object-contain origin-center", styles.scale)}
            priority
          />
        </span>
      )}
      <span
        className={cn(
          "font-mono font-medium tracking-tight text-text-primary",
          styles.text,
        )}
      >
        {siteConfig.name}
      </span>
    </a>
  );
}
