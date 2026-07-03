"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { INSTRUMENTS, type BiasResult } from "@/lib/market-data";

const BIAS_STYLE_CLASSES = {
  bullish: {
    text: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    dot: "bg-primary",
  },
  bearish: {
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    dot: "bg-red-400",
  },
  neutral: {
    text: "text-muted",
    bg: "bg-white/5",
    border: "border-border-glass",
    dot: "bg-muted",
  },
} as const;

export function TimeframeBias({
  symbol: defaultSymbol = INSTRUMENTS[0].symbol,
}: {
  symbol?: string;
}) {
  const t = useTranslations("Dashboard");
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [data, setData] = useState<BiasResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/market/bias?symbol=${encodeURIComponent(symbol)}`)
      .then((res) => res.json())
      .then((json: BiasResult) => {
        if (!cancelled) setData(json);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  const biasLabels: Record<string, string> = {
    bullish: t("bullish"),
    bearish: t("bearish"),
    neutral: t("neutral"),
  };

  const activeInstrument = INSTRUMENTS.find((i) => i.symbol === symbol) ?? INSTRUMENTS[0];

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{t("biasCardTitle")}</h3>
        {data && (
          <span
            className={`rounded-full px-3 py-1 text-xs ${
              data.source === "finnhub"
                ? "border border-primary/30 bg-primary/10 text-primary"
                : "border border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
            }`}
          >
            {data.source === "finnhub" ? t("biasLiveData") : t("biasSampleData")}
          </span>
        )}
      </div>

      <div
        className="mt-4 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
        dir="ltr"
        role="tablist"
      >
        {INSTRUMENTS.map((instrument) => (
          <button
            key={instrument.symbol}
            type="button"
            role="tab"
            aria-selected={instrument.symbol === symbol}
            onClick={() => {
              if (instrument.symbol === symbol) return;
              setLoading(true);
              setSymbol(instrument.symbol);
            }}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              instrument.symbol === symbol
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-border-glass bg-white/5 text-muted hover:text-foreground"
            }`}
          >
            {instrument.display}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-2" dir="ltr">
        {activeInstrument.display}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {(loading
          ? (Array.from({ length: 5 }) as (BiasResult["timeframes"][number] | null)[])
          : data?.timeframes ?? []
        ).map((tf, i) => {
          if (loading || !tf) {
            return (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-border-glass bg-white/5"
              />
            );
          }
          const style = BIAS_STYLE_CLASSES[tf.bias as keyof typeof BIAS_STYLE_CLASSES];
          return (
            <motion.div
              key={tf.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex flex-col items-center gap-1.5 rounded-xl border ${style.border} ${style.bg} px-2 py-3 text-center`}
            >
              <span className="text-xs text-muted" dir="ltr">
                {tf.label}
              </span>
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              <span className={`text-xs font-semibold ${style.text}`}>
                {biasLabels[tf.bias]}
              </span>
            </motion.div>
          );
        })}
      </div>

      {data?.source === "sample" && (
        <p className="mt-4 text-xs text-muted-2">{t("biasSampleNote")}</p>
      )}
    </div>
  );
}
