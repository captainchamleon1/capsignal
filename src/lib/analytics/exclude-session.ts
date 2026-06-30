import type { SessionReport } from "./session-log";

const DEFAULT_EXCLUDED_UA = "SearchBot,bot,spider,crawler,HeadlessChrome";

export function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return request.headers.get("x-real-ip") ?? undefined;
}

function excludedUaPatterns(): string[] {
  const raw = process.env.VISITOR_EXCLUDE_UA ?? DEFAULT_EXCLUDED_UA;
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function excludedIps(): string[] {
  const raw = process.env.VISITOR_EXCLUDE_IPS ?? "";
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function shouldExcludeSessionReport(
  report: SessionReport,
  request: Request,
): boolean {
  const cookie = request.headers.get("cookie") ?? "";
  if (cookie.includes("cs_skip_analytics=1")) return true;

  const ip = getClientIp(request);
  if (ip && excludedIps().includes(ip)) return true;

  const ua = report.userAgent ?? "";
  if (excludedUaPatterns().some((pattern) => ua.toLowerCase().includes(pattern.toLowerCase()))) {
    return true;
  }

  return false;
}
