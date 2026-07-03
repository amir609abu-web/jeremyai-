import { getCurrentUser } from "@/lib/session";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let card: { brand: string; last4: string; expMonth: number; expYear: number } | null = null;
  let currentPeriodEnd: string | null = null;
  let hasDiscount = false;

  if (isStripeConfigured() && user.stripePaymentMethodId) {
    const stripe = getStripe();

    try {
      const pm = await stripe.paymentMethods.retrieve(user.stripePaymentMethodId);
      if (pm.card) {
        card = {
          brand: pm.card.brand,
          last4: pm.card.last4,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year,
        };
      }
    } catch {
      card = null;
    }
  }

  if (isStripeConfigured() && user.stripeSubscriptionId) {
    const stripe = getStripe();
    try {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      currentPeriodEnd = subscription.items.data[0]?.current_period_end
        ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
        : null;
      hasDiscount = Boolean(subscription.discounts && subscription.discounts.length > 0);
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
