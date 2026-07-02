import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";
import { TickerStrip } from "@/components/ticker-strip";
import { TimeframeBias } from "@/components/timeframe-bias";
import { AIPreviewChat } from "@/components/ai-preview-chat";
import { EconomicCalendarList } from "@/components/economic-calendar-list";

export default async function DashboardPage({
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
  if (!user.hasPaymentMethod) {
    return redirect({ href: "/signup/payment", locale });
  }

  const t = await getTranslations("Dashboard");

  return (
    <div>
      <TickerStrip />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted">{t("signedInAs")}</p>
            <p className="truncate font-display text-xl font-semibold" dir="ltr">
              {user.email}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {user.isAdmin && (
              <Link
                href="/admin"
                className="whitespace-nowrap rounded-full border border-border-glass px-4 py-2 text-sm text-foreground hover:bg-white/5"
              >
                {t("admin")}
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
          {t("trialBanner")}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <TimeframeBias />
          <AIPreviewChat />
        </div>

        <div className="mt-6">
          <EconomicCalendarList />
        </div>
      </div>
    </div>
  );
}
