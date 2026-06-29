import { NextResponse } from "next/server";
import { getStripe, TRIAL_DAYS } from "@/lib/stripe";

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
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });
    const subscription =
      typeof session.subscription === "object" && session.subscription !== null
        ? session.subscription
        : null;
    const trialing = subscription?.status === "trialing";
    const paid =
      trialing ||
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required" ||
      session.status === "complete";

    return NextResponse.json({
      ok: paid,
      trialing,
      trialDays: trialing ? TRIAL_DAYS : undefined,
      email: session.customer_details?.email ?? session.customer_email,
      subscriptionId: subscription?.id ?? session.subscription,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid session" }, { status: 404 });
  }
}
