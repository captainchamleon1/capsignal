import Link from "next/link";
import { siteConfig } from "@/lib/content/site";
import { Logo } from "@/components/brand/logo";
import { footerNav } from "@/lib/content/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-elevated">
      <Container wide>
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-6 lg:gap-10">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              {siteConfig.description}
            </p>
            <Button variant="primary" href="/request-access" className="mt-7">
              Request access
            </Button>
          </div>

          {Object.entries(footerNav).map(([category, links]) => (
            <div key={category}>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
                {category}
              </p>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-border py-6 md:flex-row md:items-center">
          <p className="font-mono text-[11px] text-text-tertiary">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="font-mono text-[11px] text-text-tertiary">{siteConfig.supportEmail}</p>
        </div>
      </Container>
    </footer>
  );
}
