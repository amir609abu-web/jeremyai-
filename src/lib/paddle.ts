import { Paddle, Environment, EventName } from "@paddle/paddle-node-sdk";

let paddleClient: Paddle | null = null;

export function isPaddleConfigured() {
  return Boolean(process.env.PADDLE_API_KEY);
}

export function getPaddle(): Paddle {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    throw new Error("PADDLE_API_KEY is not set");
  }
  if (!paddleClient) {
    paddleClient = new Paddle(apiKey, {
      environment: apiKey.startsWith("pdl_live_")
        ? Environment.production
        : Environment.sandbox,
    });
  }
  return paddleClient;
}

const RETENTION_DISCOUNT_CODE = "JEREMYAI-RETENTION-10-12MO";

// Paddle discount IDs are server-generated (no custom-ID support like Stripe
// coupons), so this looks the discount up by its fixed code first and only
// creates it the very first time it's needed.
export async function getOrCreateRetentionDiscount(): Promise<string> {
  const paddle = getPaddle();

  const existing = await paddle.discounts
    .list({ code: [RETENTION_DISCOUNT_CODE] })
    .next();
  if (existing.length > 0) return existing[0].id;

  const created = await paddle.discounts.create({
    code: RETENTION_DISCOUNT_CODE,
    description: "Retention offer — $10 off for 12 months",
    type: "flat",
    amount: "1000",
    currencyCode: "USD",
    recur: true,
    maximumRecurringIntervals: 12,
    enabledForCheckout: false,
  });
  return created.id;
}

export { EventName };
