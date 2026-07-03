import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/session";
import { TickerStrip } from "@/components/ticker-strip";
import { AccountPanel } from "@/components/account-panel";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) {
    return redirect({ href: "/login", locale });
  }

  const t = await getTranslations("Account");

  return (
    <div>
      <TickerStrip />

      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
          <Link
            href="/dashboard"
            className="whitespace-nowrap rounded-full border border-border-glass px-4 py-2 text-sm text-foreground hover:bg-white/5"
          >
            {t("backToDashboard")}
          </Link>
        </div>

        <div className="mt-8">
          <AccountPanel />
        </div>
      </div>
    </div>
  );
}
