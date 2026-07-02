import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="mt-12 border-t border-border-glass">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-muted-2">
          {t("riskDisclosure")}
        </p>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border-glass pt-6 text-xs text-muted-2 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
          <div className="flex gap-6">
            <Link href="/legal/terms" className="hover:text-foreground">
              {t("terms")}
            </Link>
            <Link href="/legal/privacy" className="hover:text-foreground">
              {t("privacy")}
            </Link>
            <Link href="/legal/risk-disclosure" className="hover:text-foreground">
              {t("risk")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
