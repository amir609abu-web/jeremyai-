import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getOrCreateRetentionDiscount, getPaddle, isPaddleConfigured } from "@/lib/paddle";

const schema = z.object({ acceptOffer: z.boolean() });

export async function POST(request: Request) {
  if (!isPaddleConfigured()) {
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

  if (!user.paddleSubscriptionId) {
    return Response.json({ error: "no_subscription" }, { status: 400 });
  }

  const paddle = getPaddle();

  if (parsed.data.acceptOffer) {
    const discountId = await getOrCreateRetentionDiscount();
    await paddle.subscriptions.update(user.paddleSubscriptionId, {
      discount: { id: discountId, effectiveFrom: "immediately" },
    });
    return Response.json({ ok: true, status: "discounted" });
  }

  await paddle.subscriptions.cancel(user.paddleSubscriptionId, {
    effectiveFrom: "immediately",
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      hasPaymentMethod: false,
      subscriptionStatus: "canceled",
      paddleSubscriptionId: null,
    },
  });

  return Response.json({ ok: true, status: "canceled" });
}
