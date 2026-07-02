import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

const schema = z.object({ setupIntentId: z.string().min(1) });

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const stripe = getStripe();
  const setupIntent = await stripe.setupIntents.retrieve(parsed.data.setupIntentId);

  if (setupIntent.status !== "succeeded" || !setupIntent.payment_method) {
    return Response.json({ error: "Payment method was not confirmed" }, { status: 400 });
  }

  const paymentMethodId =
    typeof setupIntent.payment_method === "string"
      ? setupIntent.payment_method
      : setupIntent.payment_method.id;

  if (user.stripeCustomerId) {
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
  }

  const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      hasPaymentMethod: true,
      stripePaymentMethodId: paymentMethodId,
      trialEndsAt,
    },
  });

  return Response.json({ ok: true });
}
