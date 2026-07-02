"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function AIPreviewChat() {
  const t = useTranslations("Dashboard");

  const exchange = [
    { role: "user" as const, text: t("aiSampleQuestion") },
    { role: "ai" as const, text: t("aiSampleAnswer") },
  ];

  return (
    <div className="glass-card flex h-full flex-col rounded-2xl p-6">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ boxShadow: [
            "0 0 0px 0px rgba(52,225,122,0.5)",
            "0 0 22px 4px rgba(52,225,122,0.5)",
            "0 0 0px 0px rgba(52,225,122,0.5)",
          ] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20"
        >
          <span className="h-3 w-3 rounded-full bg-primary" />
        </motion.div>
        <div>
          <p className="font-display text-sm font-semibold">{t("aiCoachTitle")}</p>
          <p className="text-xs text-muted-2">{t("aiCoachDisclaimer")}</p>
        </div>
      </div>

      <div className="mt-5 flex-1 space-y-3">
        {exchange.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.35, duration: 0.5 }}
            className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === "user"
                ? "ms-auto bg-white/10 text-foreground"
                : "border border-primary/20 bg-primary/5 text-muted"
            }`}
          >
            {m.text}
          </motion.div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-full border border-border-glass bg-white/5 px-4 py-2.5 text-sm text-muted-2">
        {t("aiInputPlaceholder")}
        <span className="ms-auto text-xs text-muted-2">{t("aiInputNote")}</span>
      </div>
    </div>
  );
}
