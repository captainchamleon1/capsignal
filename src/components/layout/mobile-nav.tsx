"use client";

import { useState } from "react";
import Link from "next/link";
import { mainNav } from "@/lib/content/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center border border-border md:hidden"
        aria-expanded={open}
        aria-label="Toggle menu"
      >
        <span className="flex flex-col gap-1">
          <span className={cn("h-0.5 w-4 bg-text-primary transition-transform", open && "translate-y-1.5 rotate-45")} />
          <span className={cn("h-0.5 w-4 bg-text-primary transition-opacity", open && "opacity-0")} />
          <span className={cn("h-0.5 w-4 bg-text-primary transition-transform", open && "-translate-y-1.5 -rotate-45")} />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-16 border-b border-border bg-surface-elevated p-5 md:hidden">
          <nav className="space-y-1">
            {mainNav.map((group) =>
              group.items ? (
                <div key={group.label} className="pb-2">
                  <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
                    {group.label}
                  </p>
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block px-2 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={group.label}
                  href={group.href!}
                  onClick={() => setOpen(false)}
                  className="block px-2 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-muted"
                >
                  {group.label}
                </Link>
              ),
            )}
          </nav>
          <div className="mt-4 border-t border-border pt-4">
            <Button variant="primary" href="/request-access" className="w-full">
              Request access
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
