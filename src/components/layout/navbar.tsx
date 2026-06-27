"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/content/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Logo } from "@/components/brand/logo";

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string; description?: string }[];
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100">
        <div className="w-64 border border-border bg-surface-elevated p-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2.5 transition-colors hover:bg-surface-muted"
            >
              <span className="text-sm font-medium text-text-primary">{item.label}</span>
              {item.description && (
                <span className="mt-0.5 block text-xs text-text-tertiary">{item.description}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b pt-safe transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-border bg-surface-elevated/95 backdrop-blur-md"
          : "border-transparent bg-surface-page/80 backdrop-blur-sm",
      )}
    >
      <Container>
        <nav className="relative flex h-14 min-h-[56px] items-center justify-between sm:h-16">
          <Logo />

          <div className="hidden items-center gap-7 lg:flex">
            {mainNav.map((group) =>
              group.items ? (
                <NavDropdown key={group.label} label={group.label} items={[...group.items]} />
              ) : (
                <Link
                  key={group.label}
                  href={group.href!}
                  className={cn(
                    "text-sm transition-colors hover:text-text-primary",
                    pathname === group.href ? "font-medium text-text-primary" : "text-text-secondary",
                  )}
                >
                  {group.label}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" href="/login" className="hidden min-h-[44px] sm:inline-flex">
              Sign in
            </Button>
            <Button
              variant="primary"
              href="/start#apply"
              className="inline-flex min-h-[44px] shrink-0 px-3 text-sm bg-brand border-brand hover:bg-brand/90 sm:px-4"
            >
              <span className="sm:hidden">Start</span>
              <span className="hidden sm:inline">Get started</span>
            </Button>
            <MobileNav />
          </div>
        </nav>
      </Container>
    </header>
  );
}
