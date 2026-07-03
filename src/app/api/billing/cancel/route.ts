import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getOrCreateRetentionCoupon, getStripe, isStripeConfigured } from "@/lib/stripe";

const schema = z.object({ acceptOffer: z.boolean() });

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }

  if (!user.stripeSubscriptionId) {
    return Response.json({ error: "no_subscription" }, { status: 400 });
  }

  const stripe = getStripe();

  if (parsed.data.acceptOffer) {
    const couponId = await getOrCreateRetentionCoupon();
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      discounts: [{ coupon: couponId }],
    });
    return Response.json({ ok: true, status: "discounted" });
  }

  await stripe.subscriptions.cancel(user.stripeSubscriptionId);

  if (user.stripePaymentMethodId) {
    try {
      await stripe.paymentMethods.detach(user.stripePaymentMethodId);
    } catch {
      // Already detached or invalid — cancellation still succeeds.
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      hasPaymentMethod: false,
      subscriptionStatus: "canceled",
      stripeSubscriptionId: null,
      stripePaymentMethodId: null,
    },
  });

  return Response.json({ ok: true, status: "canceled" });
}
