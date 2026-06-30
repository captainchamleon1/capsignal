export type BookCallRequest = {
  name: string;
  email: string;
  company?: string;
  slotLabel: string;
  notes?: string;
  pagePath?: string;
  submittedAt: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildBookCallNotificationEmail(req: BookCallRequest) {
  const subject = `Book a call: ${req.name}${req.company ? ` · ${req.company}` : ""} · ${req.slotLabel}`;

  const rows: [string, string][] = [
    ["Name", req.name],
    ["Email", req.email],
    ["Company", req.company ?? ""],
    ["Requested time", req.slotLabel],
    ["Notes", req.notes ?? ""],
    ["Page", req.pagePath ?? ""],
    ["Submitted", req.submittedAt],
  ].filter(([, v]) => v.trim() !== "") as [string, string][];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">${escapeHtml(k)}</td>` +
        `<td style="padding:6px 0">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#111;max-width:560px">
<h2 style="margin:0 0 12px">New call booking request</h2>
<table style="border-collapse:collapse">${htmlRows}</table>
<p style="margin-top:16px"><a href="mailto:${escapeHtml(req.email)}">Reply to confirm → ${escapeHtml(req.name)}</a></p>
</body></html>`;

  return { subject, text, html };
}

export function buildBookCallConfirmationEmail(req: BookCallRequest) {
  const subject = `CapSignal call request — ${req.slotLabel}`;

  const text = [
    `Hi ${req.name},`,
    "",
    "Thanks for booking time with CapSignal. We received your request for:",
    "",
    req.slotLabel,
    "",
    "We'll confirm by email shortly. If you need to reschedule, just reply to this message.",
    "",
    req.notes?.trim() ? `Your note: ${req.notes.trim()}` : "",
    "",
    "— CapSignal",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#111;max-width:560px;line-height:1.6">
<p>Hi ${escapeHtml(req.name)},</p>
<p>Thanks for booking time with CapSignal. We received your request for:</p>
<p style="font-weight:600">${escapeHtml(req.slotLabel)}</p>
<p>We'll confirm by email shortly. If you need to reschedule, reply to this message.</p>
${req.notes?.trim() ? `<p style="color:#555"><em>Your note:</em> ${escapeHtml(req.notes.trim())}</p>` : ""}
<p>— CapSignal</p>
</body></html>`;

  return { subject, text, html };
}
