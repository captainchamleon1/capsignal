/**
 * One-time script: send follow-up emails to leads already captured via Resend notifications.
 * Usage: node scripts/send-lead-follow-ups.mjs [--dry-run]
 */

import fs from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

loadEnvLocal();

const API_KEY = process.env.RESEND_API_KEY;
const DRY_RUN = process.argv.includes("--dry-run");
const FROM = process.env.LEAD_FROM_EMAIL ?? "CapSignal <hello@getcapsignal.com>";
const REPLY_TO = process.env.LEAD_REPLY_TO_EMAIL ?? "hello@getcapsignal.com";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getcapsignal.com";

if (!API_KEY) {
  console.error("Missing RESEND_API_KEY in .env.local");
  process.exit(1);
}

async function resend(path, init) {
  const res = await fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "User-Agent": "curl/8.0",
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`${path} ${res.status}: ${body}`);
  return body ? JSON.parse(body) : null;
}

function parseLeadText(text, replyTo) {
  const get = (key) => {
    const m = text.match(new RegExp(`^${key}: (.+)$`, "m"));
    return m?.[1]?.trim();
  };
  return {
    name: get("Name") ?? "",
    email: (get("Email") ?? replyTo?.[0] ?? "").toLowerCase(),
    company: get("Company") ?? "",
    stage: get("Stage"),
    sector: get("Sector"),
    raise: get("Target raise"),
    message: get("Message"),
    source: get("Source"),
  };
}

function isTestLead(lead) {
  const hay = `${lead.name} ${lead.company} ${lead.email}`.toLowerCase();
  if (/claude|qa test|qa co|please ignore|\(ignore\)/.test(hay)) return true;
  if (/^a a$/i.test(lead.name.trim()) && lead.company.trim().toLowerCase() === "a") return true;
  if (lead.name.toLowerCase() === "aa" && lead.company.toLowerCase() === "a") return true;
  if (lead.name.toLowerCase() === "cap sign") return true;
  if (lead.email.includes("christian") && /myers|christianfm801/.test(hay)) return true;
  return false;
}

function firstName(name) {
  return name.trim().split(/\s+/)[0] || "there";
}

function buildEmail(lead) {
  const greeting = firstName(lead.name);
  const planUrl = `${SITE}/start/plan`;
  const roundParts = [lead.stage, lead.sector].filter(Boolean).join(" · ");
  const roundLine = roundParts
    ? ` Based on ${lead.company}'s ${roundParts} profile${lead.raise ? ` (${lead.raise})` : ""}, your matches are ready.`
    : ` Your investor matches for ${lead.company} are ready.`;

  const subject = `Your matched investors for ${lead.company}`;
  const text = [
    `Hi ${greeting},`,
    "",
    `Thanks for building your raise profile with CapSignal.${roundLine}`,
    "",
    "Unlock your matches and start outreach:",
    planUrl,
    "",
    "CapSignal gives you scored investor matches, intro-ready outreach, and a pipeline to run your round without cold-blasting hundreds of firms.",
    "",
    "Questions? Reply to this email. We read every message.",
    "",
    "The CapSignal team",
    "hello@getcapsignal.com",
  ].join("\n");

  return { subject, text };
}

async function listLeadNotifications() {
  const emails = [];
  let after = null;
  for (let i = 0; i < 20; i++) {
    const path = after ? `/emails?limit=100&after=${after}` : "/emails?limit=100";
    const data = await resend(path);
    const batch = data.data ?? [];
    emails.push(...batch.filter((e) => e.subject?.startsWith("New lead:")));
    if (!data.has_more || batch.length === 0) break;
    after = batch[batch.length - 1].id;
  }
  return emails;
}

async function main() {
  const notifications = await listLeadNotifications();
  const byEmail = new Map();

  for (const note of notifications) {
    const detail = await resend(`/emails/${note.id}`);
    const lead = parseLeadText(detail.text ?? "", detail.reply_to);
    if (!lead.email || !lead.name || !lead.company) continue;
    if (isTestLead(lead)) continue;
    byEmail.set(lead.email, lead);
  }

  const leads = [...byEmail.values()];
  console.log(`Found ${leads.length} real leads to email${DRY_RUN ? " (dry run)" : ""}:`);
  for (const lead of leads) console.log(`  - ${lead.name} <${lead.email}> at ${lead.company}`);

  if (DRY_RUN) return;

  for (const lead of leads) {
    const { subject, text } = buildEmail(lead);
    try {
      await resend("/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: [lead.email],
          reply_to: REPLY_TO,
          subject,
          text,
        }),
      });
      console.log(`Sent → ${lead.email}`);
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      console.error(`Failed → ${lead.email}:`, err.message);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
