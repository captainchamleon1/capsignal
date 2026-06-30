import type { SessionReport } from "./session-log";

const PAID_CLICK_MARKERS = ["gclid=", "gad_source=", "gad_campaignid=", "gbraid=", "wbraid="];

function paramsLookPaid(params: Record<string, unknown> | undefined): boolean {
  if (!params) return false;
  const haystack = JSON.stringify(params);
  return PAID_CLICK_MARKERS.some((marker) => haystack.includes(marker));
}

export function isGoogleAdsSession(report: SessionReport): boolean {
  const utm = report.utm ?? {};
  if (
    utm.utm_source?.toLowerCase() === "google" &&
    utm.utm_medium?.toLowerCase() === "cpc"
  ) {
    return true;
  }

  return report.events.some((event) => paramsLookPaid(event.params));
}

export function shouldEmailSessionReport(report: SessionReport): boolean {
  if (process.env.VISITOR_REPORTS_ALL === "true") return true;
  return isGoogleAdsSession(report);
}
