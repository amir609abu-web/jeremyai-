import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

const RETENTION_COUPON_ID = "jeremyai-retention-10-usd";

// Stripe coupons are idempotent by id, so re-running this after the coupon
// already exists just retrieves it instead of erroring.
export async function getOrCreateRetentionCoupon(): Promise<string> {
  const stripe = getStripe();
  try {
    const existing = await stripe.coupons.retrieve(RETENTION_COUPON_ID);
    return existing.id;
  } catch {
    const created = await stripe.coupons.create({
      id: RETENTION_COUPON_ID,
      amount_off: 1000,
      currency: "usd",
      duration: "forever",
      name: "Retention offer — $10 off",
    });
    return created.id;
  }
}
