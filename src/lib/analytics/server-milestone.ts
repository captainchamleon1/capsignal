import { sessionSummaryFromEvents } from "@/lib/analytics/session-summary";
import type { SessionEvent } from "@/lib/analytics/session-log";
import { parseSessionEvents } from "@/lib/visitor-sessions/store";
import { db } from "@/lib/db";

export async function recordServerFunnelMilestone(options: {
  sessionId: string;
  milestone: string;
  pagePath?: string;
  leadEmail?: string;
  leadName?: string;
  leadCompany?: string;
  params?: Record<string, unknown>;
}) {
  const event: SessionEvent = {
    name: "funnel_milestone",
    ts: new Date().toISOString(),
    params: {
      milestone: options.milestone,
      server: true,
      page_path: options.pagePath,
      ...options.params,
    },
  };

  const existing = await db.visitorSession.findUnique({
    where: { sessionId: options.sessionId },
  });

  if (existing) {
    const events = parseSessionEvents(existing.events);
    events.push(event);
    const summary = sessionSummaryFromEvents(events);
    await db.visitorSession.update({
      where: { sessionId: options.sessionId },
      data: {
        summary,
        endedAt: new Date(),
        events: JSON.stringify(events),
        leadEmail: options.leadEmail?.toLowerCase() ?? existing.leadEmail,
        leadName: options.leadName ?? existing.leadName,
        leadCompany: options.leadCompany ?? existing.leadCompany,
      },
    });
    return;
  }

  const now = new Date();
  await db.visitorSession.create({
    data: {
      sessionId: options.sessionId,
      startedAt: now,
      endedAt: now,
      durationMs: 0,
      landingPath: options.pagePath ?? "/",
      summary: sessionSummaryFromEvents([event]),
      maxStep: 0,
      leadEmail: options.leadEmail?.toLowerCase(),
      leadName: options.leadName,
      leadCompany: options.leadCompany,
      events: JSON.stringify([event]),
      isGoogleAds: false,
    },
  });
}
