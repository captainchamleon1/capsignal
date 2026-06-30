export async function sendResendEmail(
  apiKey: string,
  payload: {
    from: string;
    to: string[];
    subject: string;
    text: string;
    html?: string;
    reply_to?: string | string[];
  },
) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function leadFromEmail(): string {
  return process.env.LEAD_FROM_EMAIL ?? "CapSignal <hello@getcapsignal.com>";
}

export function leadReplyToEmail(): string {
  return process.env.LEAD_REPLY_TO_EMAIL ?? "hello@getcapsignal.com";
}

export function leadNotifyRecipients(): string[] {
  const raw =
    process.env.LEAD_NOTIFY_EMAIL ??
    "hello@getcapsignal.com,christianfm801@gmail.com";
  return [...new Set(raw.split(",").map((part) => part.trim()).filter(Boolean))];
}
