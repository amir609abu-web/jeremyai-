"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrowserCard } from "@/components/browser-card";
import { LogoStrip } from "@/components/logo-strip";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative overflow-hidden pb-8 pt-10 md:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-noise opacity-40" />
      <motion.img
        src="/wave-ribbon.svg"
        alt=""
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[460px] w-[1600px] max-w-none -translate-x-1/2 rtl:-scale-x-100"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl px-6 text-center"
      >
        <motion.div
          variants={item}
          animate={{
            boxShadow: [
              "0 0 20px -6px rgba(52,225,122,0.6)",
              "0 0 34px -4px rgba(52,225,122,0.9)",
              "0 0 20px -6px rgba(52,225,122,0.6)",
            ],
          }}
          transition={{ boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
          className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10"
        >
          <span className="font-display text-lg font-bold text-primary">J</span>
        </motion.div>

        <motion.p
          variants={item}
          className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] shimmer-text"
        >
          {t("mission")}
        </motion.p>

        <motion.div
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-glass bg-white/5 px-4 py-1.5 text-xs text-muted"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {t("disclaimer")}
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground glow-text sm:text-5xl md:text-6xl"
        >
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted sm:text-lg"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/signup"
            className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-[#04140a] shadow-[0_0_40px_-10px_rgba(52,225,122,0.7)] transition-transform hover:scale-[1.03]"
          >
            {t("ctaPrimary")}
          </Link>
          <a
            href="#assistant"
            className="rounded-full border border-border-glass px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
          >
            {t("ctaSecondary")}
          </a>
        </motion.div>
        <motion.p variants={item} className="mt-3 text-xs text-muted-2">
          {t("ctaNote")}
        </motion.p>
      </motion.div>

      <div className="relative mt-16 h-[260px] w-full sm:h-[300px]">
        <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-center">
          <div className="flex -space-x-6 rtl:space-x-reverse px-6 sm:-space-x-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.1 },
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              }}
              className="mb-6 hidden sm:block"
            >
              <BrowserCard title={t("card1")} rotate="-6deg" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.2 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="z-10"
            >
              <BrowserCard title={t("card2")} rotate="0deg" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.3 },
                y: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1 },
              }}
              className="mb-6 hidden sm:block"
            >
              <BrowserCard title={t("card3")} rotate="6deg" />
            </motion.div>
          </div>
        </div>
      </div>

      <LogoStrip />
    </section>
  );
}
