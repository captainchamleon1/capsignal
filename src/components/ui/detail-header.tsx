import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { TextLink } from "@/components/ui/text-link";

type Crumb = { label: string; href?: string };

type DetailHeaderProps = {
  back?: { label: string; href: string };
  breadcrumbs?: Crumb[];
  meta?: React.ReactNode;
  label?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  narrow?: boolean;
};

export function DetailHeader({
  back,
  breadcrumbs,
  meta,
  label,
  title,
  description,
  children,
  className,
  narrow,
}: DetailHeaderProps) {
  return (
    <section className={cn("border-b border-border bg-surface-elevated pt-14 pb-12 md:pt-20 md:pb-16", className)}>
      <Container narrow={narrow}>
        {back && (
          <TextLink href={back.href} className="text-text-tertiary hover:text-text-primary">
            ← {back.label}
          </TextLink>
        )}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className={back ? "mt-4" : undefined} />
        )}
        {label && (
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
            {label}
          </p>
        )}
        {meta && (
          <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-tertiary", (back || breadcrumbs || label) && "mt-4")}>
            {meta}
          </div>
        )}
        <h1
          className={cn(
            "display-serif max-w-3xl text-balance text-3xl font-semibold text-text-primary md:text-[2.75rem]",
            back || breadcrumbs || label || meta ? "mt-5" : "",
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-text-secondary md:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}

export function MetaSep() {
  return <span aria-hidden="true">·</span>;
}

export function MetaLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="link-hover text-text-secondary hover:text-text-primary">
      {children}
    </Link>
  );
}
