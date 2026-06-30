import { isGoogleAdsSession } from "@/lib/analytics/google-ads-session";
import { maxFunnelStep, sessionSummary } from "@/lib/analytics/session-summary";
import type { SessionReport } from "@/lib/analytics/session-log";
import type { SessionWizardSnapshot } from "@/lib/analytics/wizard-snapshot";
import { db } from "@/lib/db";

type PersistOptions = {
  report: SessionReport;
  wizardSnapshot?: SessionWizardSnapshot | null;
  sessionEmailed?: boolean;
  dropoffEmailed?: boolean;
};

export async function persistVisitorSession(options: PersistOptions) {
  const { report, wizardSnapshot, sessionEmailed, dropoffEmailed } = options;
  const utm = report.utm ?? {};
  const summary = sessionSummary(report);
  const step = Math.max(maxFunnelStep(report.events), wizardSnapshot?.step ?? 0);

  return db.visitorSession.upsert({
    where: { sessionId: report.sessionId },
    create: {
      sessionId: report.sessionId,
      startedAt: new Date(report.startedAt),
      endedAt: new Date(report.endedAt),
      durationMs: report.durationMs,
      landingPath: report.landingPath,
      referrer: report.referrer,
      userAgent: report.userAgent,
      utmSource: utm.utm_source,
      utmMedium: utm.utm_medium,
      utmCampaign: utm.utm_campaign,
      utmTerm: utm.utm_term,
      utmContent: utm.utm_content,
      isGoogleAds: isGoogleAdsSession(report),
      summary,
      maxStep: step,
      leadName: wizardSnapshot?.name,
      leadEmail: wizardSnapshot?.email?.toLowerCase(),
      leadCompany: wizardSnapshot?.company,
      events: JSON.stringify(report.events),
      wizardSnapshot: wizardSnapshot ? JSON.stringify(wizardSnapshot) : null,
      sessionEmailed: sessionEmailed ?? false,
      dropoffEmailed: dropoffEmailed ?? false,
    },
    update: {
      endedAt: new Date(report.endedAt),
      durationMs: report.durationMs,
      summary,
      maxStep: step,
      leadName: wizardSnapshot?.name,
      leadEmail: wizardSnapshot?.email?.toLowerCase(),
      leadCompany: wizardSnapshot?.company,
      events: JSON.stringify(report.events),
      wizardSnapshot: wizardSnapshot ? JSON.stringify(wizardSnapshot) : null,
      sessionEmailed: sessionEmailed ?? false,
      dropoffEmailed: dropoffEmailed ?? false,
    },
  });
}

export function parseSessionEvents(raw: string) {
  try {
    return JSON.parse(raw) as SessionReport["events"];
  } catch {
    return [];
  }
}
