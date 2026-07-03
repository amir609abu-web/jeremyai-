"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

type ChatMessage = { role: "user" | "assistant"; content: string };

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export function AIChatPanel() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState<"preview" | "live" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/ai/chat")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { conversationId: string | null; messages: ChatMessage[] } | null) => {
        if (!data) return;
        setConversationId(data.conversationId);
        setMessages(data.messages);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setError(false);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setSending(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: trimmed, locale }),
      });

      if (!res.ok) throw new Error("chat_failed");

      const data = (await res.json()) as {
        conversationId: string;
        reply: string;
        source: "anthropic" | "sample";
      };

      setConversationId(data.conversationId);
      setMode(data.source === "anthropic" ? "live" : "preview");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setError(true);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  const suggestions = [t("aiSuggestion1"), t("aiSuggestion2"), t("aiSuggestion3")];

  return (
    <div className="glass-card flex h-full min-h-[420px] flex-col rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0px 0px rgba(52,225,122,0.5)",
              "0 0 22px 4px rgba(52,225,122,0.5)",
              "0 0 0px 0px rgba(52,225,122,0.5)",
            ],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20"
        >
          <span className="h-3 w-3 rounded-full bg-primary" />
        </motion.div>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold">{t("aiCoachTitle")}</p>
          <p className="text-xs text-muted-2">{t("aiCoachDisclaimer")}</p>
        </div>
        {mode && (
          <span
            className={`ms-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
              mode === "live"
                ? "border border-primary/30 bg-primary/10 text-primary"
                : "border border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
            }`}
          >
            {mode === "live" ? t("aiChatLiveBadge") : t("aiChatPreviewBadge")}
          </span>
        )}
      </div>

      <div
        ref={scrollRef}
        className="mt-4 max-h-[50vh] min-h-0 flex-1 space-y-3 overflow-y-auto lg:max-h-none"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-6 text-center">
            <div>
              <p className="font-display text-sm font-semibold">{t("aiChatEmptyTitle")}</p>
              <p className="mx-auto mt-1 max-w-[85%] text-xs text-muted-2">
                {t("aiChatEmptySubtitle")}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-border-glass bg-white/5 px-3 py-1.5 text-xs text-muted transition-colors hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "ms-auto bg-white/10 text-foreground"
                  : "border border-primary/20 bg-primary/5 text-muted"
              }`}
            >
              {m.content}
            </motion.div>
          ))}
        </AnimatePresence>

        {sending && (
          <div className="flex max-w-[90%] items-center gap-1.5 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
                className="h-1.5 w-1.5 rounded-full bg-primary"
              />
            ))}
          </div>
        )}

        {error && <p className="text-xs text-red-400">{t("aiChatError")}</p>}
      </div>

      {mode === "preview" && messages.length > 0 && (
        <p className="mt-3 text-xs text-muted-2">{t("aiChatPreviewNote")}</p>
      )}

      <form onSubmit={onSubmit} className="mt-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("aiInputPlaceholder")}
          disabled={sending}
          className="min-w-0 flex-1 rounded-full border border-border-glass bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-2 focus:border-primary/40 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-[#04140a] transition-transform enabled:hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendIcon />
          <span className="hidden sm:inline">
            {sending ? t("aiChatSending") : t("aiChatSend")}
          </span>
        </button>
      </form>
    </div>
  );
}
