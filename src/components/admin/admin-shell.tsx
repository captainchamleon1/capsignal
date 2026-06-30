"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, LayoutDashboard, LogOut, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Logo } from "@/components/brand/logo";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/visitors", label: "Visitors", icon: Activity },
];

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.push("/login?next=/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-surface-page">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-surface-elevated lg:flex">
        <div className="border-b border-border px-5 py-4">
          <Logo href="/admin" />
          <p className="mt-3 text-xs font-medium text-brand">Admin</p>
          <p className="truncate text-xs text-text-tertiary">{userName}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-surface-muted font-medium text-text-primary"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                )}
              >
                <Icon size={16} strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
          >
            <LogOut size={16} strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-surface-elevated px-4 lg:px-8">
          <div className="lg:hidden">
            <Logo href="/admin" />
          </div>
          <p className="hidden text-sm text-text-tertiary lg:block">Leads & visitor analytics</p>
          <Link href="/" className="text-xs text-text-tertiary hover:text-text-secondary">
            Marketing site →
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
