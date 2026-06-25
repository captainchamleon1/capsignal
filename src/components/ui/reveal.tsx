"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "none";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  duration?: number;
  blur?: boolean;
  once?: boolean;
};

const hiddenTransforms: Record<RevealDirection, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-10",
  right: "-translate-x-10",
  scale: "scale-[0.96]",
  none: "",
};

export function useInView(threshold = 0.1, rootMargin = "0px 0px -6% 0px") {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 700,
  blur = false,
}: RevealProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform,filter] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform]",
        inView ? "translate-x-0 translate-y-0 scale-100 opacity-100 blur-0" : cn("opacity-0", hiddenTransforms[direction], blur && "blur-[6px]"),
        className,
      )}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

type RevealStaggerProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  direction?: RevealDirection;
};

export function RevealStagger({
  children,
  className,
  stagger = 90,
  direction = "up",
}: RevealStaggerProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={cn("reveal-stagger", inView && "reveal-stagger-visible", className)}
      style={{ "--stagger": `${stagger}ms` } as React.CSSProperties}
      data-direction={direction}
    >
      {children}
    </div>
  );
}

type DrawLineProps = {
  className?: string;
  direction?: "horizontal" | "vertical";
};

export function DrawLine({ className, direction = "horizontal" }: DrawLineProps) {
  const { ref, inView } = useInView(0.25);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "block origin-left bg-brand/40 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
        direction === "horizontal" ? "h-px w-full" : "h-full w-px origin-top",
        inView ? "scale-100" : direction === "horizontal" ? "scale-x-0" : "scale-y-0",
        className,
      )}
    />
  );
}