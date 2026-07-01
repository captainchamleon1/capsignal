import type { UtmParams } from "./utm";
import type { ConversionMilestone, FunnelName, OnboardingStepKey } from "./funnel";
import { getAnalyticsSessionId } from "./session";
import { logSessionEvent } from "./session-log";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
    lintrk?: (action: string, data?: Record<string, unknown>) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, unknown>;

function baseParams(): EventParams {
  return {
    session_id: getAnalyticsSessionId(),
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    page_url: typeof window !== "undefined" ? window.location.href : undefined,
  };
}

export function trackEvent(name: string, params?: EventParams) {
  if (typeof window === "undefined") return;

  const payload = { event: name, ...baseParams(), ...params };
  window.dataLayer?.push(payload);
  logSessionEvent(name, { ...params, ...baseParams() });
}

export function trackPageView(path: string) {
  trackEvent("page_view", { page_path: path });
}

export function trackScrollDepth(depth: 25 | 50 | 75 | 100, path: string) {
  trackEvent("scroll_depth", { scroll_depth: depth, page_path: path });
}

export function trackCtaClick(id: string, label?: string) {
  trackEvent("cta_click", { cta_id: id, cta_label: label });
}

export function trackFunnelStepView(
  funnel: FunnelName,
  step: number,
  stepKey: OnboardingStepKey,
) {
  trackEvent("funnel_step_view", {
    funnel,
    step,
    step_key: stepKey,
  });
}

export function trackFunnelStepComplete(
  funnel: FunnelName,
  step: number,
  stepKey: OnboardingStepKey,
  extra?: EventParams,
) {
  trackEvent("funnel_step_complete", {
    funnel,
    step,
    step_key: stepKey,
    ...extra,
  });
}

export function trackFunnelMilestone(milestone: ConversionMilestone, extra?: EventParams) {
  trackEvent("funnel_milestone", { milestone, ...extra });
}

/**
 * Fires when a visitor hands over a valid email mid-wizard (before the final
 * lead submit). Wire this event to a Google Ads conversion in GTM so bidding
 * has signal while full-lead volume is still low.
 */
export function trackEmailCaptured(params?: UtmParams & EventParams) {
  trackEvent("email_captured", params);
  trackFunnelMilestone("email_captured", params);

  if (window.fbq) {
    window.fbq("track", "CompleteRegistration", params);
  }
}

export function trackLeadConversion(params?: UtmParams & EventParams) {
  trackEvent("generate_lead", params);
  trackFunnelMilestone("match_preview_confirm", params);

  if (window.fbq) {
    window.fbq("track", "Lead", params);
  }

  const conversionId = process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_ID;
  if (window.lintrk && conversionId) {
    window.lintrk("track", { conversion_id: conversionId });
  }
}

export type SessionVisitPayload = {
  sessionId: string;
  path: string;
  referrer: string;
  utm: UtmParams;
  userAgent: string;
};

export { flushSessionReport, initSessionMeta, logSessionEvent } from "./session-log";
export type { SessionReport, SessionEvent } from "./session-log";
