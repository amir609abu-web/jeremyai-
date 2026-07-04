import { getCurrentUser } from "@/lib/session";
import { isPaddleConfigured } from "@/lib/paddle";

export async function GET() {
  if (!isPaddleConfigured()) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const priceId = process.env.PADDLE_PRICE_ID;
  if (!priceId) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  return Response.json({
    priceId,
    email: user.email,
    userId: user.id,
  });
}
