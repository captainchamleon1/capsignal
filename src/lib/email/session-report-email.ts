import type { SessionReport } from "@/lib/analytics/session-log";

function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
}

function formatEventLine(event: SessionReport["events"][number], index: number): string {
  const time = new Date(event.ts).toLocaleTimeString("en-US", { hour12: false });
  const detail = event.params
    ? Object.entries(event.params)
        .filter(([, v]) => v != null && v !== "")
        .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`)
        .join(", ")
    : "";
  return `${String(index + 1).padStart(2, "0")}. ${time}  ${event.name}${detail ? `  (${detail})` : ""}`;
}

function sessionSummary(report: SessionReport): string {
  const milestones = report.events
    .filter((e) => e.name === "funnel_milestone" || e.name === "generate_lead")
    .map((e) => String(e.params?.milestone ?? e.name));

  const maxStep = report.events
    .filter((e) => e.name === "funnel_step_view")
    .reduce((max, e) => Math.max(max, Number(e.params?.step) || 0), 0);

  if (milestones.includes("trial_start")) return "Started trial";
  if (milestones.includes("checkout_success")) return "Completed checkout";
  if (milestones.includes("checkout_start")) return "Started checkout";
  if (milestones.includes("checkout_view")) return "Viewed checkout";
  if (milestones.includes("plan_view")) return "Viewed plan";
  if (milestones.includes("match_preview_open")) return "Saw investor matches";
  if (milestones.includes("generate_lead")) return "Submitted lead";
  if (maxStep >= 1) return `Onboarding step ${maxStep}/6`;
  return "Browsing only";
}

export function buildSessionReportEmail(report: SessionReport) {
  const summary = sessionSummary(report);
  const utmLines = Object.entries(report.utm)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);

  const text = [
    `Visitor session: ${summary}`,
    "",
    `Session: ${report.sessionId}`,
    `Duration: ${formatDuration(report.durationMs)}`,
    `Landing: ${report.landingPath}`,
    report.referrer ? `Referrer: ${report.referrer}` : null,
    utmLines.length > 0 ? `UTM:\n${utmLines.map((l) => `  ${l}`).join("\n")}` : null,
    "",
    `Events (${report.events.length}):`,
    ...report.events.map((e, i) => formatEventLine(e, i)),
    "",
    `User agent: ${report.userAgent}`,
  ]
    .filter(Boolean)
    .join("\n");

  const eventRows = report.events
    .map(
      (e, i) =>
        `<tr><td style="padding:4px 8px;color:#666;white-space:nowrap">${i + 1}</td>` +
        `<td style="padding:4px 8px;white-space:nowrap">${new Date(e.ts).toLocaleTimeString("en-US", { hour12: false })}</td>` +
        `<td style="padding:4px 8px"><strong>${escapeHtml(e.name)}</strong></td>` +
        `<td style="padding:4px 8px;color:#444;font-size:13px">${escapeHtml(formatParams(e.params))}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#111;max-width:640px">
<h2 style="margin:0 0 4px">Visitor session: ${escapeHtml(summary)}</h2>
<p style="margin:0 0 16px;color:#666">${report.events.length} events · ${formatDuration(report.durationMs)} · landed ${escapeHtml(report.landingPath)}</p>
<table style="border-collapse:collapse;width:100%;margin-bottom:16px">
<tr><td style="padding:4px 0;color:#666">Session</td><td style="padding:4px 0"><code>${escapeHtml(report.sessionId)}</code></td></tr>
${report.referrer ? `<tr><td style="padding:4px 0;color:#666">Referrer</td><td style="padding:4px 0">${escapeHtml(report.referrer)}</td></tr>` : ""}
${utmLines.length > 0 ? `<tr><td style="padding:4px 0;color:#666;vertical-align:top">UTM</td><td style="padding:4px 0">${utmLines.map(escapeHtml).join("<br>")}</td></tr>` : ""}
</table>
<table style="border-collapse:collapse;width:100%;font-size:14px">
<thead><tr style="background:#f4f4f5;text-align:left">
<th style="padding:6px 8px">#</th><th style="padding:6px 8px">Time</th><th style="padding:6px 8px">Event</th><th style="padding:6px 8px">Details</th>
</tr></thead>
<tbody>${eventRows}</tbody>
</table>
<p style="margin-top:16px;font-size:12px;color:#888">${escapeHtml(report.userAgent)}</p>
</body></html>`;

  return {
    subject: `Visitor session: ${summary} (${report.landingPath})`,
    text,
    html,
  };
}

function formatParams(params?: Record<string, unknown>): string {
  if (!params) return "";
  return Object.entries(params)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`)
    .join(", ");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendSessionReportEmail(report: SessionReport, apiKey: string) {
  const to =
    process.env.VISITOR_NOTIFY_EMAIL ??
    process.env.LEAD_NOTIFY_EMAIL ??
    "hello@getcapsignal.com";
  const from =
    process.env.VISITOR_FROM_EMAIL ??
    process.env.LEAD_FROM_EMAIL ??
    "CapSignal Analytics <onboarding@resend.dev>";

  const { subject, text, html } = buildSessionReportEmail(report);

  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text, html }),
  });
}
