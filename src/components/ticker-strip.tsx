"use client";

import { useTranslations } from "next-intl";

const TICKER = [
  { symbol: "EUR/USD", price: "1.0842", change: 0.12 },
  { symbol: "GBP/USD", price: "1.2671", change: -0.18 },
  { symbol: "XAU/USD", price: "2,398.50", change: 0.54 },
  { symbol: "USOIL", price: "78.32", change: -0.41 },
  { symbol: "BTC/USD", price: "67,214", change: 1.32 },
  { symbol: "NAS100", price: "19,842", change: 0.27 },
  { symbol: "USD/JPY", price: "156.24", change: -0.09 },
];

function TickerItems() {
  return (
    <>
      {TICKER.map((t) => (
        <span key={t.symbol} className="mx-4 inline-flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">{t.symbol}</span>
          <span className="text-muted">{t.price}</span>
          <span className={t.change >= 0 ? "text-primary" : "text-red-400"}>
            {t.change >= 0 ? "▲" : "▼"} {Math.abs(t.change).toFixed(2)}%
          </span>
        </span>
      ))}
    </>
  );
}

export function TickerStrip() {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex items-center overflow-hidden border-y border-border-glass bg-background-elevated py-2.5">
      <span className="shrink-0 border-e border-border-glass px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-2">
        {t("indicativePricing")}
      </span>
      <div className="flex shrink-0 animate-marquee whitespace-nowrap" dir="ltr">
        <TickerItems />
        <TickerItems />
      </div>
    </div>
  );
}
