import { getAnalyticsSessionId } from "./session";

export function logServerMilestone(
  milestone: string,
  options?: {
    pagePath?: string;
    leadEmail?: string;
    leadName?: string;
    leadCompany?: string;
    params?: Record<string, unknown>;
  },
) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    sessionId: getAnalyticsSessionId(),
    milestone,
    ...options,
  });

  fetch("/api/analytics/milestone", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
