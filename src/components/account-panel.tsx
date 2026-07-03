"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

type AccountData = {
  email: string;
  name: string | null;
  createdAt: string;
  subscriptionStatus: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  hasDiscount: boolean;
  card: { brand: string; last4: string; expMonth: number; expYear: number } | null;
};

type View = "idle" | "offer" | "confirmCancel" | "canceled" | "discounted";

const STATUS_KEY: Record<string, string> = {
  trialing: "statusTrialing",
  active: "statusActive",
  past_due: "statusPastDue",
  canceled: "statusCanceled",
};

function CardBrandLabel({ brand }: { brand: string }) {
  return <span className="capitalize">{brand}</span>;
}

export function AccountPanel() {
  const t = useTranslations("Account");
  const locale = useLocale();
  const router = useRouter();

  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/billing/account")
      .then((res) => (res.ok ? res.json() : null))
      .then((json: AccountData | null) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  async function submitCancel(acceptOffer: boolean) {
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptOffer }),
      });
      if (!res.ok) throw new Error("failed");

      if (acceptOffer) {
        setData((prev) => (prev ? { ...prev, hasDiscount: true } : prev));
        setView("discounted");
      } else {
        setView("canceled");
        router.refresh();
      }
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="glass-card rounded-2xl p-6 text-sm text-muted">{t("loading")}</div>;
  }

  if (!data) {
    return <div className="glass-card rounded-2xl p-6 text-sm text-red-400">{t("genericError")}</div>;
  }

  const statusKey = data.subscriptionStatus ? STATUS_KEY[data.subscriptionStatus] : null;

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">{t("profileTitle")}</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">{t("emailLabel")}</dt>
            <dd dir="ltr">{data.email}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">{t("memberSince")}</dt>
            <dd dir="ltr">
              {new Date(data.createdAt).toLocaleDateString(locale, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </div>

      <div className="glass-card rounded-2xl p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">{t("subscriptionTitle")}</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">{t("statusLabel")}</dt>
            <dd>{statusKey ? t(statusKey) : "—"}</dd>
          </div>
          {data.subscriptionStatus === "trialing" && data.trialEndsAt && (
            <div className="flex items-center justify-between">
              <dt className="text-muted">{t("trialEndsLabel")}</dt>
              <dd dir="ltr">
                {new Date(data.trialEndsAt).toLocaleDateString(locale, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </dd>
            </div>
          )}
          {data.currentPeriodEnd && (
            <div className="flex items-center justify-between">
              <dt className="text-muted">{t("renewsLabel")}</dt>
              <dd dir="ltr">
                {new Date(data.currentPeriodEnd).toLocaleDateString(locale, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </dd>
            </div>
          )}
          {data.hasDiscount && (
            <div className="mt-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-center text-xs text-primary">
              {t("discountActive")}
            </div>
          )}
        </dl>
      </div>

      <div className="glass-card rounded-2xl p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">{t("paymentMethodTitle")}</h2>

        {data.card ? (
          <div className="mt-4 flex items-center justify-between text-sm">
            <div dir="ltr">
              <span className="font-medium">
                <CardBrandLabel brand={data.card.brand} /> •••• {data.card.last4}
              </span>
              <span className="ms-2 text-muted-2">
                {String(data.card.expMonth).padStart(2, "0")}/{data.card.expYear}
              </span>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-2">{t("noCard")}</p>
        )}

        {data.card && view === "idle" && (
          <button
            type="button"
            onClick={() => setView("offer")}
            className="mt-5 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
          >
            {t("removeCard")}
          </button>
        )}

        {view === "offer" && (
          <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <p className="font-display text-sm font-semibold text-primary">{t("offerTitle")}</p>
            <p className="mt-1.5 text-sm text-muted">{t("offerBody")}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={busy}
                onClick={() => submitCancel(true)}
                className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-[#04140a] transition-transform enabled:hover:scale-[1.02] disabled:opacity-50"
              >
                {t("offerAccept")}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setView("confirmCancel")}
                className="flex-1 rounded-full border border-border-glass px-4 py-2.5 text-sm text-muted hover:text-foreground disabled:opacity-50"
              >
                {t("offerDecline")}
              </button>
            </div>
          </div>
        )}

        {view === "confirmCancel" && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
            <p className="font-display text-sm font-semibold text-red-400">
              {t("confirmCancelTitle")}
            </p>
            <p className="mt-1.5 text-sm text-muted">{t("confirmCancelBody")}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={busy}
                onClick={() => submitCancel(false)}
                className="flex-1 rounded-full bg-red-500/90 px-4 py-2.5 text-sm font-semibold text-white transition-transform enabled:hover:scale-[1.02] disabled:opacity-50"
              >
                {t("confirmCancelButton")}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setView("idle")}
                className="flex-1 rounded-full border border-border-glass px-4 py-2.5 text-sm text-muted hover:text-foreground disabled:opacity-50"
              >
                {t("keepSubscription")}
              </button>
            </div>
          </div>
        )}

        {view === "discounted" && (
          <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
            <p className="font-display text-sm font-semibold text-primary">
              {t("discountAppliedTitle")}
            </p>
            <p className="mt-1.5 text-sm text-muted">{t("discountAppliedBody")}</p>
          </div>
        )}

        {view === "canceled" && (
          <div className="mt-5 rounded-xl border border-border-glass bg-white/5 p-4 text-center">
            <p className="font-display text-sm font-semibold">{t("canceledTitle")}</p>
            <p className="mt-1.5 text-sm text-muted">{t("canceledBody")}</p>
            <button
              type="button"
              onClick={() => router.push("/signup/payment")}
              className="mt-4 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-[#04140a] transition-transform hover:scale-[1.02]"
            >
              {t("resubscribe")}
            </button>
          </div>
        )}

        {error && <p className="mt-3 text-xs text-red-400">{t("genericError")}</p>}
      </div>
    </div>
  );
}
