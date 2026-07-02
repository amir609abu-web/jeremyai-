import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "he", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const localeDirections: Record<string, "ltr" | "rtl"> = {
  en: "ltr",
  he: "rtl",
  ar: "rtl",
};

export const localeNames: Record<string, string> = {
  en: "English",
  he: "עברית",
  ar: "العربية",
};
