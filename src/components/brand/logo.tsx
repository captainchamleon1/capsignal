import { siteConfig } from "@/lib/content/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showMark?: boolean;
};

export function Logo({ className, showMark = true }: LogoProps) {
  return (
    <a href="/" className={cn("group flex items-center gap-2.5", className)}>
      {showMark && (
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center bg-brand"
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1.5 7.5L4 3.5L7 10.5L10 5.5L12.5 7.5"
              stroke="white"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      <span className="font-mono text-sm font-medium tracking-tight text-text-primary">
        {siteConfig.name}
      </span>
    </a>
  );
}
