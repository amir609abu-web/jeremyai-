"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export function OrderSummaryCard() {
  const t = useTranslations("Billing");
  const tp = useTranslations("Pricing");
  const locale = useLocale();

  const [trialEndDate] = useState(() =>
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(locale, {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  );

  return (
    <div className="glass-card-solid rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{t("orderSummary")}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="font-display text-lg font-semibold">{tp("plan")}</p>
        <p className="font-display text-lg font-semibold">
          $29<span className="text-xs font-normal text-muted">{tp("priceSuffix")}</span>
        </p>
      </div>

      <div className="mt-4 space-y-2 border-t border-border-glass pt-4 text-sm">
        <div className="flex items-center justify-between text-muted">
          <span>{t("dueToday")}</span>
          <span className="font-semibold text-primary">$0.00</span>
        </div>
        <div className="flex items-center justify-between text-muted">
          <span>{t("dueAfterTrial")}</span>
          <span>$29.00</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-2" dir="auto">
        {t("trialEndsLabel")}: <span dir="ltr">{trialEndDate}</span>
      </p>
    </div>
  );
}
