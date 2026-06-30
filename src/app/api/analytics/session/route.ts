import { NextResponse } from "next/server";
import { z } from "zod";
import { shouldExcludeSessionReport } from "@/lib/analytics/exclude-session";
import { shouldEmailSessionReport } from "@/lib/analytics/google-ads-session";
import type { SessionReport } from "@/lib/analytics/session-log";
import { sendSessionReportEmail } from "@/lib/email/session-report-email";

const eventSchema = z.object({
  name: z.string(),
  ts: z.string(),
  params: z.record(z.string(), z.unknown()).optional(),
});

const schema = z.object({
  sessionId: z.string().min(1),
  startedAt: z.string(),
  endedAt: z.string(),
  durationMs: z.number().nonnegative(),
  landingPath: z.string(),
  referrer: z.string().optional(),
  utm: z.record(z.string(), z.string()).optional(),
  userAgent: z.string().optional(),
  events: z.array(eventSchema),
});

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const report = body.data as SessionReport;

  if (shouldExcludeSessionReport(report, request)) {
    console.info(
      "Visitor session report skipped (internal/bot):",
      JSON.stringify({ sessionId: report.sessionId, landingPath: report.landingPath }),
    );
    return NextResponse.json({ ok: true, emailed: false, excluded: true });
  }

  if (!shouldEmailSessionReport(report)) {
    console.info(
      "Visitor session report skipped (not Google Ads):",
      JSON.stringify({ sessionId: report.sessionId, landingPath: report.landingPath }),
    );
    return NextResponse.json({ ok: true, emailed: false, googleAds: false });
  }

  const resendKey = process.env.RESEND_API_KEY ?? process.env.Resend;

  console.info(
    "Visitor session report:",
    JSON.stringify({
      sessionId: report.sessionId,
      landingPath: report.landingPath,
      durationMs: report.durationMs,
      eventCount: report.events.length,
    }),
  );

  if (!resendKey) {
    console.info("Session report events:", JSON.stringify(report.events));
    return NextResponse.json({ ok: true, emailed: false });
  }

  try {
    const res = await sendSessionReportEmail(report, resendKey);
    if (!res.ok) {
      console.error("Session report email failed:", res.status, await res.text());
      return NextResponse.json({ ok: false, emailed: false }, { status: 502 });
    }
  } catch (err) {
    console.error("Session report email error:", err);
    return NextResponse.json({ ok: false, emailed: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true, emailed: true });
}
