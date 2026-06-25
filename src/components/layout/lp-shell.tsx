import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/lib/content/site";

export function LpShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-surface-page/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-(--width-wide) items-center justify-between px-6 md:px-10">
          <Logo />
          <a
            href="#apply"
            className="inline-flex h-9 items-center bg-text-primary px-4 text-sm font-medium text-text-on-dark transition-colors hover:bg-[var(--primary-hover)]"
          >
            See my matches
          </a>
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
