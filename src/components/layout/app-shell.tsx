import { headers } from "next/headers";
import { SiteShell } from "@/components/layout/site-shell";
import { LpShell } from "@/components/layout/lp-shell";
import { FunnelShell } from "@/components/layout/funnel-shell";

function isFunnelClose(pathname: string) {
  return (
    pathname === "/start/plan" ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/preview/plan") ||
    pathname.startsWith("/preview/checkout")
  );
}

export async function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isLandingPage = pathname.startsWith("/start") && !isFunnelClose(pathname);
  const isProductApp =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding");

  if (isProductApp) {
    return <>{children}</>;
  }

  if (isFunnelClose(pathname)) {
    return <FunnelShell>{children}</FunnelShell>;
  }

  if (isLandingPage) {
    return <LpShell>{children}</LpShell>;
  }

  return <SiteShell>{children}</SiteShell>;
}
