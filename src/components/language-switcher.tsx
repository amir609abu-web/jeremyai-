"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, localeNames } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = e.target.value;
    router.replace(
      // @ts-expect-error -- pathname/params types depend on the current route
      { pathname, params },
      { locale: nextLocale }
    );
  }

  return (
    <label>
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={onChange}
        className="cursor-pointer rounded-full border border-border-glass bg-white/5 px-3 py-1.5 text-sm text-foreground outline-none"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="bg-background text-foreground">
            {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
