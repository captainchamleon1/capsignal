"use client";

import { cn } from "@/lib/utils";
import { raiseMovement } from "@/lib/content/raise-movement";
import { Button } from "@/components/ui/button";
import { useBookCallOptional } from "./book-call-context";

type BookCallButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children?: React.ReactNode;
};

export function BookCallButton({
  variant = "secondary",
  className,
  children = raiseMovement.bookCall.cta,
}: BookCallButtonProps) {
  const ctx = useBookCallOptional();

  if (!ctx) {
    return (
      <Button variant={variant} href="/book-a-call" className={className}>
        {children}
      </Button>
    );
  }

  return (
    <Button variant={variant} className={className} onClick={ctx.openBookCall}>
      {children}
    </Button>
  );
}

export function BookCallTextLink({ className }: { className?: string }) {
  const ctx = useBookCallOptional();

  if (!ctx) {
    return (
      <a href="/book-a-call" className={cn("text-sm text-text-secondary underline-offset-4 hover:text-text-primary hover:underline", className)}>
        {raiseMovement.bookCall.cta}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={ctx.openBookCall}
      className={cn("text-sm text-text-secondary underline-offset-4 hover:text-text-primary hover:underline", className)}
    >
      {raiseMovement.bookCall.cta}
    </button>
  );
}
