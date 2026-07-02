import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSessionToken, hashPassword, sessionCookieOptions } from "@/lib/auth";
import { cookies } from "next/headers";

const TERMS_VERSION = "v1-draft";

const signupSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
  acceptedTerms: z.literal(true, {
    error: "You must accept the Terms of Service and Risk Disclosure to sign up.",
  }),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      acceptedTermsAt: new Date(),
      acceptedTermsVersion: TERMS_VERSION,
      hasPaymentMethod: false,
    },
  });

  const token = await createSessionToken(user.id);
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieOptions.name, token, sessionCookieOptions);

  return Response.json({ id: user.id, email: user.email, name: user.name });
}
