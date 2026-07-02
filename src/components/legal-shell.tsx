import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("Legal");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        <span className="inline-block rtl:-scale-x-100">←</span> {t("backHome")}
      </Link>

      <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
        {t("draftNotice")}
      </div>

      <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-2">
        {t("lastUpdated")}: {updated}
      </p>

      <div className="prose-legal mt-10 space-y-6 text-sm leading-relaxed text-muted [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:ps-5">
        {children}
      </div>
    </div>
  );
}
