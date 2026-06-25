import type { UtmParams } from "./utm";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
    lintrk?: (action: string, data?: Record<string, unknown>) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event: name, ...params });
}

export function trackPageView(path: string) {
  trackEvent("page_view", { page_path: path });
}

export function trackLeadConversion(params?: UtmParams & Record<string, unknown>) {
  trackEvent("generate_lead", params);

  if (window.fbq) {
    window.fbq("track", "Lead", params);
  }

  const conversionId = process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_ID;
  if (window.lintrk && conversionId) {
    window.lintrk("track", { conversion_id: conversionId });
  }
}
