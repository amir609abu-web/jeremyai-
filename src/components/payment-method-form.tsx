"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "@/i18n/navigation";

function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function CardBrandIcons() {
  return (
    <div className="flex items-center gap-2" dir="ltr" aria-hidden>
      <span className="rounded border border-border-glass bg-white px-1.5 py-0.5 text-[10px] font-bold italic text-[#1a1f71]">
        VISA
      </span>
      <span className="flex h-5 w-8 items-center justify-center rounded border border-border-glass bg-white">
        <span className="relative flex h-3 w-5 items-center justify-center">
          <span className="absolute left-0 h-3 w-3 rounded-full bg-[#eb001b] opacity-90" />
          <span className="absolute right-0 h-3 w-3 rounded-full bg-[#f79e1b] opacity-90 mix-blend-multiply" />
        </span>
      </span>
      <span className="rounded border border-border-glass bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#006fcf]">
        AMEX
      </span>
    </div>
  );
}

export function PaymentMethodForm() {
  const t = useTranslations("Billing");
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? t("genericError"));
      setLoading(false);
      return;
    }

    if (!setupIntent) {
      setError(t("genericError"));
      setLoading(false);
      return;
    }

    const res = await fetch("/api/billing/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setupIntentId: setupIntent.id }),
    });

    if (!res.ok) {
      setError(t("genericError"));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <LockIcon className="h-3.5 w-3.5 text-primary" />
          {t("securedByStripe")}
        </span>
        <CardBrandIcons />
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <PaymentElement />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-[#04140a] shadow-[0_0_40px_-10px_rgba(52,225,122,0.7)] transition-transform enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LockIcon className="h-4 w-4" />
          {loading ? t("submitLoading") : t("submit")}
        </button>
      </form>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-2">
        <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {t("encryptionNote")}
      </p>
    </div>
  );
}
