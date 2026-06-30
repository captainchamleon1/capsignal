import { NextResponse } from "next/server";
import { z } from "zod";
import { findBookCallSlot } from "@/lib/book-call/slots";
import { sendBookCallEmails } from "@/lib/email/send-book-call-email";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  company: z.string().max(200).optional(),
  slotId: z.string().min(1).max(120),
  notes: z.string().max(2000).optional(),
  pagePath: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const slot = findBookCallSlot(body.data.slotId);
  if (!slot) {
    return NextResponse.json({ error: "Please pick a valid time slot" }, { status: 400 });
  }

  const payload = {
    name: body.data.name.trim(),
    email: body.data.email.trim().toLowerCase(),
    company: body.data.company?.trim(),
    slotLabel: slot.label,
    notes: body.data.notes?.trim(),
    pagePath: body.data.pagePath,
    submittedAt: new Date().toISOString(),
  };

  const resendKey = process.env.RESEND_API_KEY ?? process.env.Resend;
  const failMsg = "Could not submit — email hello@getcapsignal.com and we'll find a time.";

  if (resendKey) {
    try {
      const res = await sendBookCallEmails(payload, resendKey);
      if (!res.ok) {
        console.error("Book call email failed:", res.status, await res.text());
        return NextResponse.json({ error: failMsg }, { status: 502 });
      }
    } catch (err) {
      console.error("Book call email error:", err);
      return NextResponse.json({ error: failMsg }, { status: 502 });
    }
  } else {
    console.info("Book call request (no Resend):", JSON.stringify(payload));
  }

  return NextResponse.json({ ok: true });
}
