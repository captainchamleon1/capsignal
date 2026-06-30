/**
 * Backfill admin panel data from Resend sent emails (leads, early leads, visitor sessions).
 * Usage: npm run admin:import-resend
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { isLikelyTestLead } from "../src/lib/admin";
import { db } from "../src/lib/db";
import { maxFunnelStep, sessionSummary } from "../src/lib/analytics/session-summary";
import type { SessionEvent } from "../src/lib/analytics/session-log";

const KEY = process.env.RESEND_API_KEY ?? process.env.Resend;
if (!KEY) {
  console.error("Set RESEND_API_KEY in .env.local");
  process.exit(1);
}

async function resend<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.resend.com${path}`, {
    headers: { Authorization: `Bearer ${KEY}`, "User-Agent": "capsignal-import/1" },
  });
  if (!res.ok) throw new Error(`${path} ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

type ResendEmailSummary = { id: string; subject: string; created_at: string };
type ResendList = { data: ResendEmailSummary[]; has_more: boolean };
type ResendDetail = { id: string; subject: string; text?: string; created_at: string; reply_to?: string[] };

function field(text: string, key: string): string | undefined {
  return text.match(new RegExp(`^${key}: (.+)$`, "m"))?.[1]?.trim();
}

function parseLeadText(text: string, replyTo?: string[]) {
  return {
    name: field(text, "Name") ?? "",
    email: (field(text, "Email") ?? replyTo?.[0] ?? "").toLowerCase(),
    company: field(text, "Company") ?? "",
    stage: field(text, "Stage"),
    sector: field(text, "Sector"),
    raise: field(text, "Target raise"),
    message: field(text, "Message"),
    source: field(text, "Source"),
    utmSource: field(text, "UTM source"),
    utmMedium: field(text, "UTM medium"),
    utmCampaign: field(text, "UTM campaign"),
    submittedAt: field(text, "Submitted"),
  };
}

function parseEarlyLeadText(text: string, replyTo?: string[]) {
  const stepMatch = field(text, "Step")?.match(/(\d+)/);
  return {
    name: field(text, "Name") ?? "",
    email: (field(text, "Email") ?? replyTo?.[0] ?? "").toLowerCase(),
    step: stepMatch ? Number(stepMatch[1]) : 1,
    company: field(text, "Company") ?? "",
    city: field(text, "City"),
    sector: field(text, "Industry"),
    role: field(text, "Role"),
    source: field(text, "Source"),
    resumeUrl: text.match(/^Resume link: (.+)$/m)?.[1]?.trim(),
  };
}

function parseDurationMs(raw: string | undefined): number {
  if (!raw) return 0;
  const minSec = raw.match(/(\d+)m\s*(\d+)s/);
  if (minSec) return (Number(minSec[1]) * 60 + Number(minSec[2])) * 1000;
  const minOnly = raw.match(/^(\d+)m$/);
  if (minOnly) return Number(minOnly[1]) * 60 * 1000;
  const sec = raw.match(/^(\d+)s$/);
  if (sec) return Number(sec[1]) * 1000;
  return 0;
}

function parseSessionText(text: string) {
  const sessionId = field(text, "Session") ?? crypto.randomUUID();
  const durationMs = parseDurationMs(field(text, "Duration"));
  const landingPath = field(text, "Landing") ?? "/";
  const referrer = field(text, "Referrer");
  const events: SessionEvent[] = [];

  for (const line of text.split("\n")) {
    const m = line.match(/^\d+\.\s+(\d+:\d+:\d+)\s+(\S+)(?:\s+\((.*)\))?/);
    if (!m) continue;
    const [, time, name, paramsRaw] = m;
    const params: Record<string, unknown> = {};
    if (paramsRaw) {
      for (const part of paramsRaw.split(", ")) {
        const eq = part.indexOf("=");
        if (eq === -1) continue;
        params[part.slice(0, eq)] = part.slice(eq + 1);
      }
    }
    events.push({ name, ts: new Date(`1970-01-01T${time}Z`).toISOString(), params });
  }

  let leadName: string | undefined;
  let leadEmail: string | undefined;
  let leadCompany: string | undefined;
  let maxStep = 0;

  for (const ev of events) {
    if (ev.name === "funnel_step_view") {
      const step = Number(ev.params?.step ?? 0);
      if (step > maxStep) maxStep = step;
    }
    const p = ev.params ?? {};
    if (p.lead_name) leadName = String(p.lead_name);
    if (p.lead_email) leadEmail = String(p.lead_email).toLowerCase();
    if (p.lead_company) leadCompany = String(p.lead_company);
    if (p.company && !leadCompany) leadCompany = String(p.company);
  }

  const isGoogleAds =
    text.includes("gclid=") ||
    text.includes("utm_source=google") ||
    text.toLowerCase().includes("google ads");

  const startedAt = new Date();
  startedAt.setTime(startedAt.getTime() - durationMs);

  const report = {
    sessionId,
    startedAt: startedAt.toISOString(),
    endedAt: new Date().toISOString(),
    durationMs,
    landingPath,
    referrer: referrer ?? "",
    utm: {},
    userAgent: field(text, "User agent") ?? "",
    events,
  };

  return {
    sessionId,
    startedAt,
    endedAt: new Date(),
    durationMs,
    landingPath,
    referrer,
    isGoogleAds,
    summary: sessionSummary(report),
    maxStep: Math.max(maxStep, maxFunnelStep(events)),
    leadName,
    leadEmail,
    leadCompany,
    events,
    userAgent: report.userAgent,
  };
}

async function fetchAllEmails(): Promise<ResendEmailSummary[]> {
  const all: ResendEmailSummary[] = [];
  let after: string | null = null;
  for (let page = 0; page < 50; page++) {
    const data: ResendList = await resend(
      `/emails?limit=100${after ? `&after=${after}` : ""}`,
    );
    all.push(...(data.data ?? []));
    if (!data.has_more || !data.data?.length) break;
    after = data.data[data.data.length - 1].id;
  }
  return all;
}

async function importLead(detail: ResendDetail, createdAt: Date) {
  const parsed = parseLeadText(detail.text ?? "", detail.reply_to);
  if (!parsed.email || !parsed.name) return "skip";

  const existing = await db.lead.findFirst({
    where: { email: parsed.email, company: parsed.company, name: parsed.name },
  });
  if (existing) return "exists";

  await db.lead.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      company: parsed.company || "Unknown",
      stage: parsed.stage,
      sector: parsed.sector,
      raise: parsed.raise,
      message: parsed.message,
      source: parsed.source ?? "resend-import",
      utmSource: parsed.utmSource,
      utmMedium: parsed.utmMedium,
      utmCampaign: parsed.utmCampaign,
      createdAt,
    },
  });
  return isLikelyTestLead(parsed.email, parsed.company) ? "test" : "lead";
}

async function importEarlyLead(detail: ResendDetail, createdAt: Date) {
  const parsed = parseEarlyLeadText(detail.text ?? "", detail.reply_to);
  if (!parsed.email) return "skip";

  const data = JSON.stringify({
    name: parsed.name,
    email: parsed.email,
    company: parsed.company,
    city: parsed.city ?? "",
    sector: parsed.sector ?? "",
    role: parsed.role ?? "",
    stage: "",
    raise: "",
    traction: "",
    timeline: "",
    segment: "",
  });

  await db.wizardProgress.upsert({
    where: { email: parsed.email },
    create: {
      email: parsed.email,
      step: parsed.step,
      data,
      source: parsed.source ?? "resend-import",
      earlyAlertSentAt: createdAt,
      createdAt,
      updatedAt: createdAt,
    },
    update: {
      step: parsed.step,
      data,
      updatedAt: createdAt,
    },
  });
  return isLikelyTestLead(parsed.email) ? "test-partial" : "partial";
}

async function importSession(detail: ResendDetail, createdAt: Date) {
  const parsed = parseSessionText(detail.text ?? "");
  if (!parsed.events.length) return "skip";

  await db.visitorSession.upsert({
    where: { sessionId: parsed.sessionId },
    create: {
      sessionId: parsed.sessionId,
      startedAt: parsed.startedAt,
      endedAt: createdAt,
      durationMs: parsed.durationMs,
      landingPath: parsed.landingPath,
      referrer: parsed.referrer,
      userAgent: parsed.userAgent,
      isGoogleAds: parsed.isGoogleAds,
      summary: parsed.summary,
      maxStep: parsed.maxStep,
      leadName: parsed.leadName,
      leadEmail: parsed.leadEmail,
      leadCompany: parsed.leadCompany,
      events: JSON.stringify(parsed.events),
      sessionEmailed: true,
      createdAt,
    },
    update: {
      endedAt: createdAt,
      durationMs: parsed.durationMs,
      summary: parsed.summary,
      maxStep: parsed.maxStep,
      leadName: parsed.leadName,
      leadEmail: parsed.leadEmail,
      leadCompany: parsed.leadCompany,
      events: JSON.stringify(parsed.events),
      sessionEmailed: true,
    },
  });
  return "session";
}

async function main() {
  console.log("Fetching sent emails from Resend…");
  const emails = await fetchAllEmails();
  console.log(`Found ${emails.length} sent emails`);

  const counts = { lead: 0, partial: 0, session: 0, exists: 0, skip: 0, test: 0 };

  for (const e of emails) {
    const subj = e.subject ?? "";
    const isLead = subj.startsWith("New lead:");
    const isEarly = subj.startsWith("Early lead:");
    const isSession = subj.includes("Visitor session");
    if (!isLead && !isEarly && !isSession) continue;

    const detail = await resend<ResendDetail>(`/emails/${e.id}`);
    const createdAt = new Date(detail.created_at);

    let result: string;
    if (isLead) result = await importLead(detail, createdAt);
    else if (isEarly) result = await importEarlyLead(detail, createdAt);
    else result = await importSession(detail, createdAt);

    if (result in counts) counts[result as keyof typeof counts]++;
    else if (result.startsWith("test")) counts.test++;
  }

  const [leads, partials, sessions] = await Promise.all([
    db.lead.count(),
    db.wizardProgress.count(),
    db.visitorSession.count(),
  ]);

  console.log("\nImport results:", counts);
  console.log(`Database now: ${leads} leads, ${partials} partials, ${sessions} visitor sessions`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
