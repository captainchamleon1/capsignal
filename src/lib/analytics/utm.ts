export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

const STORAGE_KEY = "capsignal_utm";

export function parseUtmFromSearch(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const utm: UtmParams = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

export function storeUtm(params: UtmParams) {
  if (typeof window === "undefined" || Object.keys(params).length === 0) return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}
