const SYSTEM_PROMPT = `You are the JeremyAI Market Coach, an educational assistant embedded in a CFD trading education platform.

Rules you must always follow:
- You are strictly educational. You never give financial advice, never tell the user to buy or sell anything, and never predict future prices.
- You explain concepts: multi-timeframe analysis, risk management, position sizing, trading psychology, how to read the economic calendar, order types, market structure, and general trading education.
- If asked for a specific trade call ("should I buy X", "will Y go up"), decline and redirect to the educational concept behind the question instead.
- Keep answers concise (2-4 short paragraphs max) and practical.
- Never claim to have live market data beyond what the user tells you in the conversation.`;

const FALLBACK_ANSWER_KEYS = [
  "aiFallback1",
  "aiFallback2",
  "aiFallback3",
  "aiFallback4",
  "aiFallback5",
] as const;

export function pickFallbackKey(seed: string): (typeof FALLBACK_ANSWER_KEYS)[number] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const index = Math.abs(h) % FALLBACK_ANSWER_KEYS.length;
  return FALLBACK_ANSWER_KEYS[index];
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function getAssistantReply(
  history: ChatMessage[]
): Promise<{ content: string; source: "anthropic" | "sample" }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return { content: "", source: "sample" };
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: history.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) throw new Error(`Anthropic request failed: ${res.status}`);

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = data.content?.find((block) => block.type === "text")?.text;
    if (!text) throw new Error("Anthropic returned no text content");

    return { content: text, source: "anthropic" };
  } catch {
    return { content: "", source: "sample" };
  }
}
