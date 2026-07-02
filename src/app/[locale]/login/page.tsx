"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? t("genericError"));
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(t("genericError"));
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-8 text-sm text-muted hover:text-foreground">
        <span className="inline-block rtl:-scale-x-100">←</span> {t("backHome")}
      </Link>

      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t("loginTitle")}
      </h1>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
            {t("emailLabel")}
          </label>
          <input
            id="email"
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border-glass bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-muted">
            {t("passwordLabel")}
          </label>
          <input
            id="password"
            type="password"
            required
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border-glass bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-[#04140a] shadow-[0_0_40px_-10px_rgba(52,225,122,0.7)] transition-transform enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? t("loginSubmitLoading") : t("loginSubmit")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-2">
        {t("noAccount")}{" "}
        <Link href="/signup" className="text-primary underline">
          {t("signupLink")}
        </Link>
      </p>
    </div>
  );
}
