import { NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/leads/types";
import { recordServerFunnelMilestone } from "@/lib/analytics/server-milestone";
import { db } from "@/lib/db";
import { sendLeadNotificationEmail } from "@/lib/email/send-lead-emails";
import { markWizardSubmitted } from "@/lib/wizard/progress-store";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type Lead = LeadPayload & { submittedAt: string };

export async function POST(request: Request) {
  let body: LeadPayload;

  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, company } = body;

  if (!name?.trim() || !email?.trim() || !company?.trim()) {
    return NextResponse.json({ error: "Name, email, and company are required" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const lead: Lead = {
    ...body,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    company: company.trim(),
    submittedAt: new Date().toISOString(),
  };

  const resendKey = process.env.RESEND_API_KEY ?? process.env.Resend;
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  const failMsg = "Failed to submit. Please email hello@getcapsignal.com";

  if (resendKey) {
    try {
      const res = await sendLeadNotificationEmail(lead, resendKey);
      if (!res.ok) {
        console.error("Resend failed:", res.status, await res.text());
        return NextResponse.json({ error: failMsg }, { status: 502 });
      }
    } catch (err) {
      console.error("Resend error:", err);
      return NextResponse.json({ error: failMsg }, { status: 502 });
    }
  } else if (webhookUrl) {
    try {
      const webhookRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!webhookRes.ok) {
        console.error("Lead webhook failed:", webhookRes.status, await webhookRes.text());
        return NextResponse.json({ error: failMsg }, { status: 502 });
      }
    } catch (err) {
      console.error("Lead webhook error:", err);
      return NextResponse.json({ error: failMsg }, { status: 502 });
    }
  } else {
    console.info("New lead (no delivery configured):", JSON.stringify(lead));
  }

  try {
    await db.lead.create({
      data: {
        name: lead.name,
        email: lead.email,
        company: lead.company,
        stage: lead.stage,
        sector: lead.sector,
        raise: lead.raise,
        message: lead.message,
        source: lead.source,
        utmSource: lead.utm_source,
        utmMedium: lead.utm_medium,
        utmCampaign: lead.utm_campaign,
        utmTerm: lead.utm_term,
        utmContent: lead.utm_content,
      },
    });
  } catch (err) {
    console.error("Lead persist error:", err);
  }

  try {
    await markWizardSubmitted(lead.email);
  } catch (err) {
    console.error("Wizard progress mark submitted error:", err);
  }

  if (body.sessionId) {
    try {
      await recordServerFunnelMilestone({
        sessionId: body.sessionId,
        milestone: "generate_lead",
        pagePath: "/start",
        leadEmail: lead.email,
        leadName: lead.name,
        leadCompany: lead.company,
        params: {
          source: lead.source,
          lead_stage: lead.stage,
          lead_sector: lead.sector,
        },
      });
    } catch (err) {
      console.error("Lead funnel milestone error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
