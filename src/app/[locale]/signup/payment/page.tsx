"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentMethodForm } from "@/components/payment-method-form";
import { OrderSummaryCard } from "@/components/order-summary-card";

type SetupState =
  | { status: "loading" }
  | { status: "not_configured" }
  | { status: "error" }
  | { status: "ready"; clientSecret: string; stripePromise: Promise<Stripe | null> };

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-primary"
      aria-hidden
    >
      <path d="M12 3 4.5 6v6c0 4.5 3 7.5 7.5 9 4.5-1.5 7.5-4.5 7.5-9V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function PaymentSetupPage() {
  const t = useTranslations("Billing");
  const locale = useLocale();
  const [state, setState] = useState<SetupState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/billing/setup-intent", { method: "POST" })
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 503) {
          setState({ status: "not_configured" });
          return;
        }
        if (!res.ok) {
          setState({ status: "error" });
          return;
        }
        const data = await res.json();
        setState({
          status: "ready",
          clientSecret: data.clientSecret,
          stripePromise: loadStripe(data.publishableKey),
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        <ShieldIcon />
        {t("secureCheckout")}
      </div>

      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
        {t("title")}
      </h1>
      <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>

      <div className="mt-8 space-y-4">
        <OrderSummaryCard />

        {state.status === "loading" && (
          <div className="h-64 animate-pulse rounded-2xl border border-border-glass bg-white/5" />
        )}

        {state.status === "not_configured" && (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-sm text-yellow-200">
            <p className="font-semibold">{t("notConfiguredTitle")}</p>
            <p className="mt-2 text-yellow-200/80">{t("notConfiguredBody")}</p>
          </div>
        )}

        {state.status === "error" && (
          <p className="text-sm text-red-400">{t("genericError")}</p>
        )}

        {state.status === "ready" && (
          <Elements
            stripe={state.stripePromise}
            options={{
              clientSecret: state.clientSecret,
              appearance: { theme: "night" },
              locale: locale as "en" | "he" | "ar",
            }}
          >
            <PaymentMethodForm />
          </Elements>
        )}
      </div>
    </div>
  );
}
