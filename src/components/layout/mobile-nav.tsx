"use client";

import { useState } from "react";
import Link from "next/link";
import { mainNav } from "@/lib/content/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookCallButton } from "@/components/book-call/book-call-button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 min-h-[44px] w-11 items-center justify-center border border-border lg:hidden"
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
        <div className="absolute left-0 right-0 top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-border bg-surface-elevated p-4 pb-safe sm:top-16 lg:hidden">
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
                      className="block min-h-[44px] px-2 py-3 text-sm text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
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
                  className="block min-h-[44px] px-2 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-muted"
                >
                  {group.label}
                </Link>
              ),
            )}
          </nav>
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            <Button variant="ghost" href="/login" className="min-h-[48px] w-full">
              Sign in
            </Button>
            <BookCallButton variant="secondary" className="min-h-[48px] w-full" />
            <Button variant="primary" href="/start#apply" className="min-h-[48px] w-full bg-brand border-brand hover:bg-brand/90">
              Get started
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
