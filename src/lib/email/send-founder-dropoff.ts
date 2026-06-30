import type { DropOffLead } from "@/lib/analytics/dropoff";
import { buildFounderDropOffEmail, founderFromEmail } from "./founder-dropoff-email";
import { leadReplyToEmail, sendResendEmail } from "./resend-send";

export async function sendFounderDropOffEmail(lead: DropOffLead, apiKey: string) {
  const { subject, text, html } = buildFounderDropOffEmail(lead);

  return sendResendEmail(apiKey, {
    from: founderFromEmail(),
    to: [lead.email],
    reply_to: leadReplyToEmail(),
    subject,
    text,
    html,
  });
}
