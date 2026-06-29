import Image from "next/image";
import { siteConfig } from "@/lib/content/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showMark?: boolean;
  href?: string;
};

export function Logo({ className, showMark = true, href = "/" }: LogoProps) {
  return (
    <a href={href} className={cn("group flex items-center gap-2.5", className)}>
      {showMark && (
        <Image
          src="/brand/logo.png"
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 object-contain"
          priority
        />
      )}
      <span className="font-mono text-sm font-medium tracking-tight text-text-primary">
        {siteConfig.name}
      </span>
    </a>
  );
}
