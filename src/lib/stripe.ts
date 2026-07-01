import Stripe from "stripe";

export type CheckoutPlan = "capsignal";

export const TRIAL_DAYS = 7;

export const planDetails: Record<
  CheckoutPlan,
  { name: string; amountCents: number; description: string }
> = {
  capsignal: {
    name: "CapSignal",
    amountCents: 9999,
    description:
      "Verified investor contacts, AI-ranked matches, outreach sequences, and raise support",
  },
};

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function checkoutConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function stripePriceId(): string | undefined {
  return process.env.STRIPE_PRICE_CAPSIGNAL ?? process.env.STRIPE_PRICE_SCALE;
}
