const SKIP_STORAGE_KEY = "cs_skip_analytics";
const SKIP_COOKIE = "cs_skip_analytics=1";

export function enableInternalAnalyticsBypass() {
  if (typeof window === "undefined") return;
  localStorage.setItem(SKIP_STORAGE_KEY, "1");
  document.cookie = `${SKIP_COOKIE}; path=/; max-age=31536000; SameSite=Lax`;
}

export function captureInternalBypassFromUrl(search: string) {
  const key = process.env.NEXT_PUBLIC_INTERNAL_ANALYTICS_KEY;
  if (!key || typeof window === "undefined") return;

  const params = new URLSearchParams(search);
  if (params.get("cs_internal") !== key) return;

  enableInternalAnalyticsBypass();

  params.delete("cs_internal");
  const qs = params.toString();
  const next = window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
  window.history.replaceState({}, "", next);
}

export function shouldSkipSessionAnalytics(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(SKIP_STORAGE_KEY) === "1") return true;
  return document.cookie.includes(SKIP_COOKIE);
}
