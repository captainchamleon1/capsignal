import { headers } from "next/headers";
import { SiteShell } from "@/components/layout/site-shell";
import { LpShell } from "@/components/layout/lp-shell";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isLandingPage = pathname.startsWith("/start");

  if (isLandingPage) {
    return <LpShell>{children}</LpShell>;
  }

  return <SiteShell>{children}</SiteShell>;
}
