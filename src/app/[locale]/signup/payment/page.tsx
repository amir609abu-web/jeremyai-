"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentMethodForm } from "@/components/payment-method-form";

type SetupState =
  | { status: "loading" }
  | { status: "not_configured" }
  | { status: "error" }
  | { status: "ready"; clientSecret: string; stripePromise: Promise<Stripe | null> };

export default function PaymentSetupPage() {
  const t = useTranslations("Billing");
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
      <h1 className="font-display text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>

      <div className="mt-8">
        {state.status === "loading" && (
          <div className="h-40 animate-pulse rounded-xl border border-border-glass bg-white/5" />
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
            options={{ clientSecret: state.clientSecret, appearance: { theme: "night" } }}
          >
            <PaymentMethodForm />
          </Elements>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted-2">{t("securityNote")}</p>
    </div>
  );
}
