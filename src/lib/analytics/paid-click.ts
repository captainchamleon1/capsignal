const PAID_PARAMS = ["gclid", "gad_source", "gad_campaignid", "gbraid", "wbraid"] as const;

const PAID_CLICK_KEY = "capsignal_paid_click";
const PAID_QUERY_KEY = "capsignal_paid_query";

export function hasPaidClickInSearch(search: string): boolean {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return PAID_PARAMS.some((key) => params.has(key));
}

export function storePaidClickAttribution(search: string) {
  if (typeof window === "undefined" || !hasPaidClickInSearch(search)) return;
  sessionStorage.setItem(PAID_CLICK_KEY, "1");
  sessionStorage.setItem(PAID_QUERY_KEY, search.startsWith("?") ? search : `?${search}`);
}

export function isPaidClickSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(PAID_CLICK_KEY) === "1";
}

export function storedPaidClickQuery(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(PAID_QUERY_KEY) ?? "";
}

/** Preserve ad attribution when linking from homepage → /start. */
export function startApplyUrl(hash = "apply"): string {
  if (typeof window === "undefined") return `/start#${hash}`;
  const query = storedPaidClickQuery();
  return `/start${query}#${hash}`;
}

export function hasPaidClickInUrl(url: URL): boolean {
  return PAID_PARAMS.some((key) => url.searchParams.has(key));
}
