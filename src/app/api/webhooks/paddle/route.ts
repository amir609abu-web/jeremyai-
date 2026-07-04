import { prisma } from "@/lib/db";
import { getPaddle, isPaddleConfigured, EventName } from "@/lib/paddle";

export async function POST(request: Request) {
  if (!isPaddleConfigured() || !process.env.PADDLE_WEBHOOK_SECRET) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("paddle-signature");
  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  const paddle = getPaddle();

  let event;
  try {
    event = await paddle.webhooks.unmarshal(body, process.env.PADDLE_WEBHOOK_SECRET, signature);
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.eventType) {
    case EventName.SubscriptionCreated:
    case EventName.SubscriptionUpdated:
    case EventName.SubscriptionActivated:
    case EventName.SubscriptionTrialing:
    case EventName.SubscriptionPastDue:
    case EventName.SubscriptionPaused: {
      const sub = event.data;
      await prisma.user.updateMany({
        where: { paddleSubscriptionId: sub.id },
        data: { subscriptionStatus: sub.status },
      });
      break;
    }
    case EventName.SubscriptionCanceled: {
      const sub = event.data;
      await prisma.user.updateMany({
        where: { paddleSubscriptionId: sub.id },
        data: { subscriptionStatus: "canceled" },
      });
      break;
    }
    case EventName.TransactionPaymentFailed: {
      const txn = event.data;
      if (txn.subscriptionId) {
        await prisma.user.updateMany({
          where: { paddleSubscriptionId: txn.subscriptionId },
          data: { subscriptionStatus: "past_due" },
        });
      }
      break;
    }
    default:
      break;
  }

  return Response.json({ received: true });
}
