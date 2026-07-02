"use client";

import { useTranslations } from "next-intl";

const IMPACT_COLORS = {
  high: "bg-red-400",
  medium: "bg-yellow-400",
  low: "bg-muted-2",
} as const;

const EVENTS: {
  day: "dayMon" | "dayTue" | "dayWed" | "dayThu" | "dayFri";
  time: string;
  currency: string;
  title: string;
  impact: keyof typeof IMPACT_COLORS;
}[] = [
  { day: "dayMon", time: "08:30", currency: "USD", title: "Non-Farm Payrolls", impact: "high" },
  { day: "dayMon", time: "10:00", currency: "EUR", title: "CPI Flash Estimate y/y", impact: "high" },
  { day: "dayTue", time: "02:00", currency: "CNY", title: "Manufacturing PMI", impact: "medium" },
  { day: "dayTue", time: "12:30", currency: "GBP", title: "BoE Rate Decision", impact: "high" },
  { day: "dayWed", time: "14:00", currency: "USD", title: "FOMC Statement", impact: "high" },
  { day: "dayThu", time: "08:30", currency: "USD", title: "Unemployment Claims", impact: "medium" },
  { day: "dayFri", time: "09:00", currency: "EUR", title: "ECB President Speech", impact: "medium" },
  { day: "dayFri", time: "23:50", currency: "JPY", title: "GDP q/q", impact: "low" },
];

export function EconomicCalendarList() {
  const t = useTranslations("Dashboard");

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{t("calendarTitle")}</h3>
        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-200">
          {t("biasSampleData")}
        </span>
      </div>

      <div className="mt-4 divide-y divide-border-glass">
        {EVENTS.map((e, i) => (
          <div key={i} className="flex items-center gap-2 py-3 text-sm sm:gap-4">
            <div className="w-12 shrink-0 text-xs text-muted-2 sm:w-14">
              <div>{t(e.day)}</div>
              <div dir="ltr">{e.time}</div>
            </div>
            <span
              className="w-9 shrink-0 rounded border border-border-glass px-1 py-0.5 text-center text-[10px] font-semibold text-muted sm:w-10 sm:px-1.5"
              dir="ltr"
            >
              {e.currency}
            </span>
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${IMPACT_COLORS[e.impact]}`} />
            <span className="min-w-0 flex-1 text-foreground" dir="ltr">
              {e.title}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-2">{t("calendarSampleNote")}</p>
    </div>
  );
}
