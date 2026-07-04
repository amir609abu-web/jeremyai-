import { getCurrentUser } from "@/lib/session";
import { getPaddle, isPaddleConfigured } from "@/lib/paddle";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let card: { brand: string; last4: string; expMonth: number; expYear: number } | null = null;
  let currentPeriodEnd: string | null = null;
  let hasDiscount = false;

  if (isPaddleConfigured() && user.paddleCustomerId) {
    const paddle = getPaddle();
    try {
      const methods = await paddle.paymentMethods
        .list(user.paddleCustomerId, { perPage: 1 })
        .next();
      const pm = methods[0];
      if (pm?.card) {
        card = {
          brand: pm.card.type,
          last4: pm.card.last4,
          expMonth: pm.card.expiryMonth,
          expYear: pm.card.expiryYear,
        };
      }
    } catch {
      card = null;
    }
  }

  if (isPaddleConfigured() && user.paddleSubscriptionId) {
    const paddle = getPaddle();
    try {
      const subscription = await paddle.subscriptions.get(user.paddleSubscriptionId);
      currentPeriodEnd = subscription.nextBilledAt;
      hasDiscount = Boolean(subscription.discount);
    } catch {
      currentPeriodEnd = null;
    }
  }

  return Response.json({
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    subscriptionStatus: user.subscriptionStatus,
    trialEndsAt: user.trialEndsAt,
    currentPeriodEnd,
    hasDiscount,
    card,
  });
}
