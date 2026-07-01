/**
 * One-time Stripe setup: creates CapSignal product + $99.99/mo price.
 * Usage: STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/stripe-bootstrap.ts
 */
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("Missing STRIPE_SECRET_KEY. Run:");
  console.error("  STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/stripe-bootstrap.ts");
  process.exit(1);
}

const stripe = new Stripe(key);

async function main() {
  const existing = await stripe.products.search({
    query: 'name:"CapSignal"',
    limit: 1,
  });

  let product = existing.data[0];
  if (product) {
    console.log("Product already exists:", product.id);
  } else {
    product = await stripe.products.create({
      name: "CapSignal",
      description:
        "Verified investor contacts, AI-ranked matches, outreach sequences, and raise support",
    });
    console.log("Created product:", product.id);
  }

  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 });
  const match = prices.data.find(
    (p) => p.unit_amount === 9999 && p.currency === "usd" && p.recurring?.interval === "month",
  );

  const price =
    match ??
    (await stripe.prices.create({
      product: product.id,
      unit_amount: 9999,
      currency: "usd",
      recurring: { interval: "month" },
    }));

  console.log("\nAdd to Vercel (Production env):\n");
  console.log(`STRIPE_SECRET_KEY=(your secret key)`);
  console.log(`STRIPE_PRICE_CAPSIGNAL=${price.id}`);
  console.log("\nWebhook endpoint (after deploy):");
  console.log("  https://getcapsignal.com/api/stripe/webhook");
  console.log("  Event: checkout.session.completed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
