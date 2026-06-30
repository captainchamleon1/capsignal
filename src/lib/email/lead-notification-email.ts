import type { LeadPayload } from "@/lib/leads/types";

export type LeadNotification = LeadPayload & {
  submittedAt?: string;
  wizardStep?: number;
};

function formatLeadRows(lead: LeadNotification): [string, string][] {
  return [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Company", lead.company],
    ["Stage", lead.stage ?? ""],
    ["Sector", lead.sector ?? ""],
    ["Target raise", lead.raise ?? ""],
    ["Message", lead.message ?? ""],
    ["Source", lead.source ?? ""],
    ["UTM source", lead.utm_source ?? ""],
    ["UTM medium", lead.utm_medium ?? ""],
    ["UTM campaign", lead.utm_campaign ?? ""],
    ["Submitted", lead.submittedAt ?? ""],
  ].filter(([, v]) => v.trim() !== "") as [string, string][];
}

export function buildLeadNotificationEmail(lead: LeadNotification) {
  const subject = `New lead: ${lead.name} at ${lead.company}`;
  const rows = formatLeadRows(lead);

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">${escapeHtml(k)}</td>` +
        `<td style="padding:6px 0">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#111;max-width:560px">
<h2 style="margin:0 0 12px">New lead</h2>
<table style="border-collapse:collapse">${htmlRows}</table>
<p style="margin-top:16px"><a href="mailto:${escapeHtml(lead.email)}">Reply to ${escapeHtml(lead.name)} →</a></p>
</body></html>`;

  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
