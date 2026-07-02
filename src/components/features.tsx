"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function Features() {
  const t = useTranslations("Features");

  const features = [
    { key: "bias", id: "bias", title: t("biasTitle"), description: t("biasBody") },
    { key: "calendar", id: "calendar", title: t("calendarTitle"), description: t("calendarBody") },
    { key: "assistant", id: "assistant", title: t("assistantTitle"), description: t("assistantBody") },
    { key: "security", id: "security", title: t("securityTitle"), description: t("securityBody") },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-muted">{t("subtitle")}</p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2">
        {features.map((f, i) => (
          <motion.div
            key={f.key}
            id={f.id}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
            className="glass-card scroll-mt-24 rounded-2xl p-7"
          >
            <h3 className="font-display text-lg font-semibold text-foreground">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {f.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
