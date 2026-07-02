"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function OutroSection() {
  const t = useTranslations("Outro");

  return (
    <section className="relative flex h-[420px] items-center justify-center overflow-hidden border-y border-border-glass bg-background-elevated">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-noise opacity-30" />

      <div
        className="pointer-events-none absolute -top-1/2 start-0 h-[220%] w-[45%] -z-10 animate-light-sweep"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(52,225,122,0.22), transparent)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 30px -8px rgba(52,225,122,0.6)",
              "0 0 55px -6px rgba(52,225,122,0.95)",
              "0 0 30px -8px rgba(52,225,122,0.6)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10"
        >
          <span className="font-display text-3xl font-bold text-primary">J</span>
        </motion.div>

        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-md text-muted">{t("subtitle")}</p>

        <Link
          href="/signup"
          className="mt-8 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-[#04140a] shadow-[0_0_40px_-10px_rgba(52,225,122,0.7)] transition-transform hover:scale-[1.03]"
        >
          {t("cta")}
        </Link>
      </motion.div>
    </section>
  );
}
