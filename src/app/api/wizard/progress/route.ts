import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEarlyLeadAlertEmail } from "@/lib/email/send-lead-emails";
import {
  getWizardProgressByToken,
  markEarlyAlertSent,
  parseWizardData,
  upsertWizardProgress,
  wizardProgressToSnapshot,
} from "@/lib/wizard/progress-store";
import type { WizardProgressData } from "@/lib/wizard/types";

const dataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.string().optional().default(""),
  company: z.string().optional().default(""),
  city: z.string().optional().default(""),
  website: z.string().optional().default(""),
  sector: z.string().optional().default(""),
  segment: z.string().optional().default(""),
  businessDescription: z.string().optional().default(""),
  priorFunding: z.string().optional().default(""),
  hadExit: z.string().optional().default(""),
  stage: z.string().optional().default(""),
  raise: z.string().optional().default(""),
  traction: z.string().optional().default(""),
  timeline: z.string().optional().default(""),
  priorOutreach: z.string().optional().default(""),
});

const postSchema = z.object({
  step: z.number().int().min(1).max(6),
  data: dataSchema,
  source: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  triggerEarlyAlert: z.boolean().optional(),
});

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://getcapsignal.com";
}

function isLikelyTestEmail(email: string) {
  const lower = email.toLowerCase();
  return (
    lower.endsWith("@example.com") ||
    lower.endsWith("@test.com") ||
    lower === "a@a.com" ||
    lower === "hello@getcapsignal.com"
  );
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("resume");
  if (!token) {
    return NextResponse.json({ error: "Missing resume token" }, { status: 400 });
  }

  try {
    const record = await getWizardProgressByToken(token);
    if (!record || record.submittedAt) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const snapshot = wizardProgressToSnapshot(record);
    if (!snapshot) {
      return NextResponse.json({ error: "Invalid session data" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      resumeToken: snapshot.resumeToken,
      step: snapshot.step,
      data: snapshot.data,
    });
  } catch (err) {
    console.error("Wizard progress GET error:", err);
    return NextResponse.json({ error: "Failed to load session" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = postSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const payload = body.data;
  const wizardData = payload.data as WizardProgressData;

  if (isLikelyTestEmail(wizardData.email)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const record = await upsertWizardProgress({
      step: payload.step,
      data: wizardData,
      source: payload.source,
      utm_source: payload.utm_source,
      utm_medium: payload.utm_medium,
      utm_campaign: payload.utm_campaign,
      utm_term: payload.utm_term,
      utm_content: payload.utm_content,
    });

    let earlyAlertSent = false;
    const resendKey = process.env.RESEND_API_KEY ?? process.env.Resend;

    if (payload.triggerEarlyAlert && !record.earlyAlertSentAt && resendKey) {
      const resumeUrl = `${siteUrl()}/start?resume=${encodeURIComponent(record.resumeToken)}`;
      const res = await sendEarlyLeadAlertEmail(
        {
          name: wizardData.name.trim(),
          email: wizardData.email.trim().toLowerCase(),
          step: payload.step,
          data: wizardData,
          source: payload.source,
          resumeUrl,
        },
        resendKey,
      );

      if (res.ok) {
        await markEarlyAlertSent(wizardData.email);
        earlyAlertSent = true;
      } else {
        console.error("Early lead alert failed:", res.status, await res.text());
      }
    }

    return NextResponse.json({
      ok: true,
      resumeToken: record.resumeToken,
      step: record.step,
      data: parseWizardData(record.data),
      earlyAlertSent,
    });
  } catch (err) {
    console.error("Wizard progress POST error:", err);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}
