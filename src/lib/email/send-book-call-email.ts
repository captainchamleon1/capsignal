import {
  buildBookCallConfirmationEmail,
  buildBookCallNotificationEmail,
  type BookCallRequest,
} from "./book-call-email";
import { leadFromEmail, leadNotifyRecipients, leadReplyToEmail, sendResendEmail } from "./resend-send";

export async function sendBookCallEmails(req: BookCallRequest, apiKey: string) {
  const notify = buildBookCallNotificationEmail(req);
  const confirm = buildBookCallConfirmationEmail(req);

  const notifyRes = await sendResendEmail(apiKey, {
    from: leadFromEmail(),
    to: leadNotifyRecipients(),
    reply_to: req.email,
    subject: notify.subject,
    text: notify.text,
    html: notify.html,
  });

  if (!notifyRes.ok) return notifyRes;

  return sendResendEmail(apiKey, {
    from: leadFromEmail(),
    to: [req.email],
    reply_to: leadReplyToEmail(),
    subject: confirm.subject,
    text: confirm.text,
    html: confirm.html,
  });
}
