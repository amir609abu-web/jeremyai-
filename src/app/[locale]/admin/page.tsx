import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) return redirect({ href: "/login", locale });
  if (!user.isAdmin) return redirect({ href: "/dashboard", locale });

  const t = await getTranslations("Admin");

  const [userCount, recentUsers, conversationCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      select: { id: true, email: true, name: true, createdAt: true, isAdmin: true },
    }),
    prisma.conversation.count(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
        <span className="inline-block rtl:-scale-x-100">←</span> {t("backDashboard")}
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
        {t("title")}
      </h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted">{t("registeredUsers")}</p>
          <p className="mt-2 font-display text-4xl font-semibold">{userCount}</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-muted">{t("conversationsLogged")}</p>
          <p className="mt-2 font-display text-4xl font-semibold">{conversationCount}</p>
          <p className="mt-2 text-xs text-muted-2">{t("conversationsNote")}</p>
        </div>
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold">{t("recentSignups")}</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border-glass">
        <table className="w-full min-w-[560px] text-start text-sm">
          <thead className="bg-white/5 text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">{t("colEmail")}</th>
              <th className="px-4 py-3 font-medium">{t("colName")}</th>
              <th className="px-4 py-3 font-medium">{t("colJoined")}</th>
              <th className="px-4 py-3 font-medium">{t("colAdmin")}</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((u) => (
              <tr key={u.id} className="border-t border-border-glass">
                <td className="px-4 py-3" dir="ltr">
                  {u.email}
                </td>
                <td className="px-4 py-3 text-muted">{u.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted">
                  {u.createdAt.toLocaleDateString(locale)}
                </td>
                <td className="px-4 py-3 text-muted">{u.isAdmin ? t("yes") : "—"}</td>
              </tr>
            ))}
            {recentUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-2">
                  {t("noUsers")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
