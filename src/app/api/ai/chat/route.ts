import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getAssistantReply, pickFallbackKey, type ChatMessage } from "@/lib/ai-chat";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const conversation = await prisma.conversation.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!conversation) return Response.json({ conversationId: null, messages: [] });

  return Response.json({
    conversationId: conversation.id,
    messages: conversation.messages.map((m) => ({ role: m.role, content: m.content })),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    conversationId?: string;
    message?: string;
    locale?: string;
  };
  const message = body.message?.trim();
  if (!message || message.length > 2000) {
    return Response.json({ error: "invalid_message" }, { status: 400 });
  }

  let conversation = body.conversationId
    ? await prisma.conversation.findFirst({
        where: { id: body.conversationId, userId: user.id },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      })
    : null;

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId: user.id },
      include: { messages: true },
    });
  }

  await prisma.message.create({
    data: { conversationId: conversation.id, role: "user", content: message },
  });

  const history: ChatMessage[] = [
    ...conversation.messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: message },
  ];

  const reply = await getAssistantReply(history);

  let replyContent = reply.content;
  if (reply.source === "sample") {
    const t = await getTranslations({ locale: body.locale ?? "en", namespace: "Dashboard" });
    replyContent = t(pickFallbackKey(message));
  }

  await prisma.message.create({
    data: { conversationId: conversation.id, role: "assistant", content: replyContent },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  return Response.json({
    conversationId: conversation.id,
    reply: replyContent,
    source: reply.source,
  });
}
