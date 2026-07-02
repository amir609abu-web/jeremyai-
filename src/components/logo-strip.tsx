"use client";

import { useTranslations } from "next-intl";

const sources = [
  "MarketPulse",
  "CandleSense",
  "FlowMetrics",
  "TrendLayer",
  "PipRadar",
];

export function LogoStrip() {
  const t = useTranslations("LogoStrip");

  return (
    <div className="mx-auto mt-14 max-w-5xl px-6">
      <p className="mb-5 text-center text-xs uppercase tracking-widest text-muted-2">
        {t("label")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-50 grayscale">
        {sources.map((name) => (
          <span
            key={name}
            className="font-display text-lg font-medium tracking-tight text-foreground"
            dir="ltr"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
