import Link from "next/link";
import { cn } from "@/lib/utils";

type TextLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function TextLink({ href, children, className }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "link-hover text-sm text-text-secondary hover:text-text-primary",
        className,
      )}
    >
      {children}
    </Link>
  );
}
