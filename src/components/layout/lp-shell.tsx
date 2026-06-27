import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/lib/content/site";
import { onboardingMeta } from "@/lib/content/onboarding";

export function LpShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-surface-page/95 pt-safe backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-(--width-wide) items-center justify-between gap-3 px-4 sm:px-6 md:px-10">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[10px] uppercase tracking-wider text-text-tertiary sm:inline">
              {onboardingMeta.timeEstimate} · {onboardingMeta.stepsCount} steps
            </span>
            <a
              href="#apply"
              className="inline-flex h-10 min-h-[44px] shrink-0 items-center bg-brand px-3 text-sm font-medium text-white transition-colors hover:bg-brand/90 sm:px-4"
            >
              Continue
            </a>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-(--width-wide) flex-wrap items-center justify-between gap-4 px-6 text-sm text-text-tertiary md:px-10">
          <span>© {new Date().getFullYear()} {siteConfig.name}</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="link-hover">
              Privacy
            </Link>
            <Link href="/terms" className="link-hover">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
