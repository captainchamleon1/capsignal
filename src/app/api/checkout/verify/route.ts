import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "Missing session_id" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ ok: false, error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid" || session.status === "complete";

    return NextResponse.json({
      ok: paid,
      email: session.customer_details?.email ?? session.customer_email,
      subscriptionId: session.subscription,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid session" }, { status: 404 });
  }
}
