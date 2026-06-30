import type { WizardProgressData } from "@/lib/wizard/types";

export type EarlyLeadAlert = {
  name: string;
  email: string;
  step: number;
  data: WizardProgressData;
  source?: string;
  resumeUrl?: string;
};

export function buildEarlyLeadAlertEmail(lead: EarlyLeadAlert) {
  const subject = `Early lead: ${lead.name} (step ${lead.step}/6)`;

  const detailRows: [string, string][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Step", `${lead.step} of 6`],
    ["Role", lead.data.role],
    ["Company", lead.data.company],
    ["City", lead.data.city],
    ["Industry", lead.data.sector],
    ["Source", lead.source ?? ""],
  ].filter(([, v]) => v.trim() !== "") as [string, string][];

  const textLines = [
    "Someone entered their contact info and started the onboarding wizard.",
    "",
    ...detailRows.map(([k, v]) => `${k}: ${v}`),
    "",
    lead.resumeUrl ? `Resume link: ${lead.resumeUrl}` : null,
    "",
    "They have not finished the full profile yet. Founder drop-off email will go out if they leave without submitting.",
  ].filter(Boolean);

  const text = textLines.join("\n");

  const htmlRows = detailRows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666">${escapeHtml(k)}</td>` +
        `<td style="padding:6px 0">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#111;max-width:560px">
<h2 style="margin:0 0 8px">Early lead: step ${lead.step}/6</h2>
<p style="color:#555;margin:0 0 16px">Contact info captured. Full profile not submitted yet.</p>
<table style="border-collapse:collapse">${htmlRows}</table>
${lead.resumeUrl ? `<p style="margin-top:16px"><a href="${escapeHtml(lead.resumeUrl)}">Their saved session →</a></p>` : ""}
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
