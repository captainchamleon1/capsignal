import { NextResponse } from "next/server";
import { z } from "zod";
import { detectDropOffLead } from "@/lib/analytics/dropoff";
import { shouldExcludeSessionReport } from "@/lib/analytics/exclude-session";
import { shouldEmailSessionReport } from "@/lib/analytics/google-ads-session";
import type { SessionReport } from "@/lib/analytics/session-log";
import { sendFounderDropOffEmail } from "@/lib/email/send-founder-dropoff";
import { sendSessionReportEmail } from "@/lib/email/session-report-email";
import { getWizardProgressByEmail, markDropoffEmailSent, upsertWizardProgress } from "@/lib/wizard/progress-store";
import { persistVisitorSession } from "@/lib/visitor-sessions/store";

const wizardSnapshotSchema = z
  .object({
    step: z.number(),
    name: z.string(),
    email: z.string(),
    company: z.string().optional(),
    city: z.string().optional(),
    sector: z.string().optional(),
    segment: z.string().optional(),
    stage: z.string().optional(),
    raise: z.string().optional(),
    traction: z.string().optional(),
    timeline: z.string().optional(),
    resumeToken: z.string().optional(),
    updatedAt: z.string(),
  })
  .optional();

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
  wizardSnapshot: wizardSnapshotSchema,
});

function isLikelyTestEmail(email: string) {
  const lower = email.toLowerCase();
  return (
    lower.endsWith("@example.com") ||
    lower.endsWith("@test.com") ||
    lower === "a@a.com" ||
    lower === "hello@getcapsignal.com"
  );
}

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const report = body.data as SessionReport & {
    wizardSnapshot?: z.infer<typeof wizardSnapshotSchema>;
  };

  if (shouldExcludeSessionReport(report, request)) {
    console.info(
      "Visitor session report skipped (internal/bot):",
      JSON.stringify({ sessionId: report.sessionId, landingPath: report.landingPath }),
    );
    return NextResponse.json({ ok: true, emailed: false, dropoffEmailed: false, excluded: true });
  }

  const resendKey = process.env.RESEND_API_KEY ?? process.env.Resend;

  console.info(
    "Visitor session report:",
    JSON.stringify({
      sessionId: report.sessionId,
      landingPath: report.landingPath,
      durationMs: report.durationMs,
      eventCount: report.events.length,
      hasWizardSnapshot: Boolean(report.wizardSnapshot?.email),
    }),
  );

  let sessionEmailed = false;
  let dropoffEmailed = false;

  if (resendKey) {
    if (shouldEmailSessionReport(report)) {
      try {
        const res = await sendSessionReportEmail(report, resendKey);
        if (res.ok) {
          sessionEmailed = true;
        } else {
          console.error("Session report email failed:", res.status, await res.text());
        }
      } catch (err) {
        console.error("Session report email error:", err);
      }
    } else {
      console.info(
        "Visitor session report skipped (not Google Ads):",
        JSON.stringify({ sessionId: report.sessionId, landingPath: report.landingPath }),
      );
    }

    const dropOff = detectDropOffLead(report, report.wizardSnapshot ?? null);
    if (dropOff && !isLikelyTestEmail(dropOff.email)) {
      try {
        const existing = await getWizardProgressByEmail(dropOff.email);
        const resumeToken = dropOff.resumeToken ?? existing?.resumeToken;
        const alreadySent = Boolean(existing?.dropoffEmailSentAt);

        if (!alreadySent) {
          const res = await sendFounderDropOffEmail(
            { ...dropOff, resumeToken: resumeToken ?? undefined },
            resendKey,
          );
          if (res.ok) {
            dropoffEmailed = true;
            if (!existing && report.wizardSnapshot) {
              const snap = report.wizardSnapshot;
              await upsertWizardProgress({
                step: snap.step,
                data: {
                  name: snap.name,
                  email: snap.email,
                  fundraisingNeeds: [],
                  role: "",
                  company: snap.company ?? "",
                  city: snap.city ?? "",
                  website: "",
                  sector: snap.sector ?? "",
                  segment: snap.segment ?? "",
                  businessDescription: "",
                  priorFunding: "",
                  hadExit: "",
                  stage: snap.stage ?? "",
                  raise: snap.raise ?? "",
                  traction: snap.traction ?? "",
                  timeline: snap.timeline ?? "",
                  priorOutreach: "",
                },
                source: "session-dropoff",
              });
            }
            await markDropoffEmailSent(dropOff.email);
          } else {
            console.error("Founder drop-off email failed:", res.status, await res.text());
          }
        }
      } catch (err) {
        console.error("Founder drop-off email error:", err);
      }
    }
  } else {
    console.info("Session report events:", JSON.stringify(report.events));
  }

  try {
    await persistVisitorSession({
      report,
      wizardSnapshot: report.wizardSnapshot ?? null,
      sessionEmailed,
      dropoffEmailed,
    });
  } catch (err) {
    console.error("Visitor session persist error:", err);
  }

  return NextResponse.json({
    ok: true,
    emailed: sessionEmailed,
    dropoffEmailed,
    googleAds: shouldEmailSessionReport(report),
  });
}
