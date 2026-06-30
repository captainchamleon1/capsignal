import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasPaidClickInUrl } from "@/lib/analytics/paid-click";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Warm paid traffic on the homepage first (converts better than cold /start landings).
  if (pathname === "/start" && hasPaidClickInUrl(request.nextUrl)) {
    const referer = request.headers.get("referer") ?? "";
    const fromSameSite =
      referer.includes("getcapsignal.com") ||
      referer.includes("localhost") ||
      referer.includes("127.0.0.1");
    const hasResume = request.nextUrl.searchParams.has("resume");

    if (!fromSameSite && !hasResume) {
      const home = new URL("/", request.url);
      request.nextUrl.searchParams.forEach((value, key) => {
        home.searchParams.set(key, value);
      });
      home.searchParams.set("cta", "apply");
      return NextResponse.redirect(home);
    }
  }

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/api/campaigns") ||
    pathname.startsWith("/api/data-room") ||
    pathname.startsWith("/api/investors") ||
    pathname.startsWith("/api/onboarding") ||
    pathname.startsWith("/api/data/ingest");

  if (isProtected) {
    const sessionCookie =
      request.cookies.get("better-auth.session_token") ??
      request.cookies.get("__Secure-better-auth.session_token");
    if (!sessionCookie) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    const sessionCookie =
      request.cookies.get("better-auth.session_token") ??
      request.cookies.get("__Secure-better-auth.session_token");
    if (sessionCookie) {
      const next = request.nextUrl.searchParams.get("next");
      if (next?.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (next && next !== "/dashboard") {
        return NextResponse.redirect(new URL(next, request.url));
      }
      return NextResponse.redirect(new URL("/auth/continue", request.url));
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
