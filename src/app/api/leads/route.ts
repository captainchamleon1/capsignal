import { NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/leads/types";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type Lead = LeadPayload & { submittedAt: string };

function formatLeadText(lead: Lead) {
  const rows: [string, unknown][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Company", lead.company],
    ["Stage", lead.stage],
    ["Sector", lead.sector],
    ["Target raise", lead.raise],
    ["Message", lead.message],
    ["Source", lead.source],
    ["UTM source", lead.utm_source],
    ["UTM medium", lead.utm_medium],
    ["UTM campaign", lead.utm_campaign],
    ["UTM content", lead.utm_content],
    ["UTM term", lead.utm_term],
    ["Submitted", lead.submittedAt],
  ];
  return rows
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

async function sendViaResend(lead: Lead, apiKey: string) {
  const to = process.env.LEAD_NOTIFY_EMAIL ?? "christianmyersss@gmail.com";
  const from = process.env.LEAD_FROM_EMAIL ?? "CapSignal Leads <onboarding@resend.dev>";

  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject: `New lead: ${lead.name} — ${lead.company}`,
      text: formatLeadText(lead),
    }),
  });
}

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
      const res = await sendViaResend(lead, resendKey);
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

  return NextResponse.json({ ok: true });
}
