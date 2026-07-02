"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function LogoutButton() {
  const t = useTranslations("Dashboard");
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={onLogout}
      className="whitespace-nowrap rounded-full border border-border-glass px-4 py-2 text-sm text-foreground hover:bg-white/5"
    >
      {t("logout")}
    </button>
  );
}
