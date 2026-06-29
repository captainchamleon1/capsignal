const SESSION_KEY = "cs_analytics_session_id";

export function getAnalyticsSessionId(): string {
  if (typeof window === "undefined") return "server";

  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}
