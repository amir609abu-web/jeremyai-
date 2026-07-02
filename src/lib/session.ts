import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { sessionCookieOptions, verifySessionToken } from "@/lib/auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieOptions.name)?.value;
  if (!token) return null;

  const userId = await verifySessionToken(token);
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      isAdmin: true,
      createdAt: true,
      hasPaymentMethod: true,
      stripeCustomerId: true,
      trialEndsAt: true,
    },
  });
}
