"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

type MotionSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/** Wraps server-rendered page section content with scroll reveal */
export function MotionSection({ children, className, delay = 0 }: MotionSectionProps) {
  return (
    <Reveal delay={delay} className={cn(className)}>
      {children}
    </Reveal>
  );
}

type MotionBlockProps = {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
};

export function MotionBlock({
  children,
  className,
  direction = "up",
  delay = 0,
}: MotionBlockProps) {
  return (
    <Reveal direction={direction} delay={delay} blur={direction === "scale"} className={className}>
      {children}
    </Reveal>
  );
}
