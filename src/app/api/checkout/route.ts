import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/lib/content/site";
import {
  checkoutConfigured,
  getStripe,
  planDetails,
  stripePriceId,
  TRIAL_DAYS,
} from "@/lib/stripe";

const schema = z.object({
  plan: z.enum(["capsignal", "scale", "launch", "full"]).optional(),
  stage: z.string().optional(),
  sector: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  company: z.string().optional(),
});

export async function POST(request: Request) {
  if (!checkoutConfigured()) {
    return NextResponse.json(
      { error: "Checkout is not configured yet. Contact hello@getcapsignal.com." },
      { status: 503 },
    );
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { stage, sector, email, name, company } = body.data;
  const plan = "capsignal" as const;
  const stripe = getStripe()!;
  const details = planDetails[plan];
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const priceId = stripePriceId();

  const metadata: Record<string, string> = { plan };
  if (stage) metadata.stage = stage;
  if (sector) metadata.sector = sector;
  if (name) metadata.name = name.slice(0, 200);
  if (company) metadata.company = company.slice(0, 200);
  if (email) metadata.email = email;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout${stage ? `?stage=${stage}` : ""}${sector ? `${stage ? "&" : "?"}sector=${sector}` : ""}`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    customer_email: email,
    client_reference_id: email,
    metadata,
    subscription_data: {
      trial_period_days: TRIAL_DAYS,
      metadata,
    },
    line_items: [
      priceId
        ? { price: priceId, quantity: 1 }
        : {
            price_data: {
              currency: "usd",
              unit_amount: details.amountCents,
              recurring: { interval: "month" },
              product_data: {
                name: details.name,
                description: details.description,
              },
            },
            quantity: 1,
          },
    ],
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not create checkout session" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
