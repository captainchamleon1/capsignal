import { getAnalyticsSessionId } from "./session";
import { getStoredUtm, type UtmParams } from "./utm";

const LOG_KEY = "cs_session_log";
const META_KEY = "cs_session_meta";
const SENT_KEY = "cs_session_report_sent";

export type SessionEvent = {
  name: string;
  ts: string;
  params?: Record<string, unknown>;
};

export type SessionMeta = {
  sessionId: string;
  startedAt: string;
  landingPath: string;
  referrer: string;
  utm: UtmParams;
  userAgent: string;
};

export type SessionReport = SessionMeta & {
  endedAt: string;
  durationMs: number;
  events: SessionEvent[];
};

function readEvents(): SessionEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as SessionEvent[]) : [];
  } catch {
    return [];
  }
}

function writeEvents(events: SessionEvent[]) {
  sessionStorage.setItem(LOG_KEY, JSON.stringify(events));
}

export function initSessionMeta() {
  if (typeof window === "undefined" || sessionStorage.getItem(META_KEY)) return;

  sessionStorage.setItem(
    META_KEY,
    JSON.stringify({
      sessionId: getAnalyticsSessionId(),
      startedAt: new Date().toISOString(),
      landingPath: window.location.pathname,
      referrer: document.referrer || "",
      utm: getStoredUtm(),
      userAgent: navigator.userAgent,
    } satisfies SessionMeta),
  );

  const events = readEvents();
  if (events.length === 0) {
    events.push({
      name: "session_start",
      ts: new Date().toISOString(),
      params: { landing_path: window.location.pathname },
    });
    writeEvents(events);
  }
}

export function logSessionEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  initSessionMeta();

  const events = readEvents();
  events.push({
    name,
    ts: new Date().toISOString(),
    params: params && Object.keys(params).length > 0 ? params : undefined,
  });
  writeEvents(events);
}

export function buildSessionReport(): SessionReport | null {
  if (typeof window === "undefined") return null;

  const rawMeta = sessionStorage.getItem(META_KEY);
  if (!rawMeta) return null;

  let meta: SessionMeta;
  try {
    meta = JSON.parse(rawMeta) as SessionMeta;
  } catch {
    return null;
  }

  const endedAt = new Date();
  const startedAt = new Date(meta.startedAt);

  return {
    ...meta,
    endedAt: endedAt.toISOString(),
    durationMs: Math.max(0, endedAt.getTime() - startedAt.getTime()),
    events: readEvents(),
  };
}

export function markSessionReportSent() {
  sessionStorage.setItem(SENT_KEY, "1");
}

export function wasSessionReportSent() {
  return sessionStorage.getItem(SENT_KEY) === "1";
}

export function flushSessionReport() {
  if (wasSessionReportSent()) return;

  const report = buildSessionReport();
  if (!report) return;

  markSessionReportSent();

  const body = JSON.stringify(report);
  const blob = new Blob([body], { type: "application/json" });

  if (navigator.sendBeacon?.("/api/analytics/session", blob)) return;

  fetch("/api/analytics/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
