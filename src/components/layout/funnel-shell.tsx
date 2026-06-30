import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/lib/content/site";

type FunnelShellProps = {
  children: React.ReactNode;
};

/** Minimal chrome for plan + checkout — no site footer, CTA banner, or nav clutter. */
export function FunnelShell({ children }: FunnelShellProps) {
  return (
    <div className="min-w-0 max-w-full overflow-x-clip">
      <header className="sticky top-0 z-50 border-b border-border bg-surface-page/95 pt-safe backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-(--width-wide) min-w-0 items-center justify-between gap-3 px-4 sm:px-6 md:px-10">
          <Logo />
          <Link
            href="/start#apply"
            className="text-sm text-text-tertiary transition-colors hover:text-text-primary"
          >
            Edit profile
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex max-w-(--width-wide) flex-wrap items-center justify-between gap-3 px-6 text-xs text-text-tertiary md:px-10">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="link-hover">
              Privacy
            </Link>
            <Link href="/terms" className="link-hover">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
