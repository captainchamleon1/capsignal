import { headers } from "next/headers";
import { SiteShell } from "@/components/layout/site-shell";
import { LpShell } from "@/components/layout/lp-shell";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isLandingPage = pathname.startsWith("/start");
  const isProductApp =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  if (isProductApp) {
    return <>{children}</>;
  }

  if (isLandingPage) {
    return <LpShell>{children}</LpShell>;
  }

  return <SiteShell>{children}</SiteShell>;
}
