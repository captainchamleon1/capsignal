import { NextResponse } from "next/server";
import Stripe from "stripe";
import { markUserSubscribed } from "@/lib/auth/subscription";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Stripe webhook signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};

    console.info("Stripe checkout completed", {
      sessionId: session.id,
      customerEmail: session.customer_details?.email ?? session.customer_email,
      subscriptionId: session.subscription,
      plan: meta.plan,
      company: meta.company,
      stage: meta.stage,
      sector: meta.sector,
    });

    const checkoutEmail = session.customer_details?.email ?? session.customer_email;
    if (checkoutEmail) {
      await markUserSubscribed(checkoutEmail, "active");
    }

    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "stripe_checkout_completed",
            email: session.customer_details?.email ?? session.customer_email,
            amountTotal: session.amount_total,
            currency: session.currency,
            subscriptionId: session.subscription,
            metadata: meta,
          }),
        });
      } catch (err) {
        console.error("Payment notification webhook failed:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
