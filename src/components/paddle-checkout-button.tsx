"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: "sandbox" | "production") => void };
      Initialize: (options: {
        token: string;
        eventCallback?: (event: { name: string; data?: unknown }) => void;
        checkout?: {
          settings?: { locale?: string; displayMode?: string; theme?: string };
        };
      }) => void;
      Checkout: {
        open: (options: {
          items: { priceId: string; quantity: number }[];
          customer?: { email: string };
          customData?: Record<string, string>;
          settings?: { locale?: string };
        }) => void;
      };
    };
  }
}

const SCRIPT_ID = "paddle-js-script";
const SCRIPT_SRC = "https://cdn.paddle.com/paddle/v2/paddle.js";

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

export function PaddleCheckoutButton({
  priceId,
  email,
  userId,
}: {
  priceId: string;
  email: string;
  userId: string;
}) {
  const t = useTranslations("Billing");
  const locale = useLocale();
  const router = useRouter();
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const completingRef = useRef(false);

  useEffect(() => {
    if (!clientToken) return;
    const token: string = clientToken;

    function initialize() {
      if (!window.Paddle) return;
      window.Paddle.Environment.set(token.startsWith("test_") ? "sandbox" : "production");
      window.Paddle.Initialize({
        token,
        checkout: { settings: { locale, displayMode: "overlay", theme: "dark" } },
        eventCallback: (event) => {
          if (event.name === "checkout.completed" && !completingRef.current) {
            completingRef.current = true;
            setLoading(true);
            fetch("/api/billing/confirm", { method: "POST" })
              .then((res) => {
                if (!res.ok) throw new Error("confirm_failed");
                router.push("/dashboard");
                router.refresh();
              })
              .catch(() => {
                completingRef.current = false;
                setLoading(false);
                setError(t("genericError"));
              });
          }
        },
      });
      setReady(true);
    }

    if (window.Paddle) {
      initialize();
      return;
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", initialize);
    return () => script?.removeEventListener("load", initialize);
  }, [clientToken, locale, router, t]);

  function onClick() {
    if (!window.Paddle) return;
    setError(null);
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email },
      customData: { userId },
      settings: { locale },
    });
  }

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-1.5 text-xs text-muted">
        <LockIcon className="h-3.5 w-3.5 text-primary" />
        {t("securedByPaddle")}
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={!clientToken || !ready || loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-[#04140a] shadow-[0_0_40px_-10px_rgba(52,225,122,0.7)] transition-transform enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <LockIcon className="h-4 w-4" />
        {loading ? t("submitLoading") : t("submit")}
      </button>

      {(!clientToken || error) && (
        <p className="mt-3 text-sm text-red-400">{error ?? t("genericError")}</p>
      )}

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-2">
        <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {t("encryptionNote")}
      </p>
    </div>
  );
}
