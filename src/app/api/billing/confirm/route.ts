import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getPaddle, isPaddleConfigured } from "@/lib/paddle";

// Called by the client right after the Paddle overlay checkout reports
// checkout.completed. The webhook is the long-term source of truth for
// subscription status, but it can lag a beat behind the browser event, so
// this looks the subscription up directly to unlock the dashboard immediately.
export async function POST() {
  if (!isPaddleConfigured()) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const paddle = getPaddle();

  let customerId = user.paddleCustomerId;
  if (!customerId) {
    const customers = await paddle.customers.list({ email: [user.email] }).next();
    customerId = customers[0]?.id ?? null;
  }
  if (!customerId) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const subscriptions = await paddle.subscriptions
    .list({ customerId: [customerId], perPage: 1 })
    .next();
  const subscription = subscriptions[0];
  if (!subscription) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      hasPaymentMethod: true,
      paddleCustomerId: customerId,
      paddleSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      trialEndsAt: subscription.nextBilledAt ? new Date(subscription.nextBilledAt) : null,
    },
  });

  return Response.json({ ok: true });
}
