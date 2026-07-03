import type { Metadata } from "next";
import { Inter, Space_Grotesk, Heebo, Cairo } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, localeDirections } from "@/i18n/routing";
import { CrispChat } from "@/components/crisp-chat";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
  preload: false,
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
  preload: false,
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  preload: false,
});

// Only the fonts a locale actually renders are attached to <html>, so the
// other locales' @font-face rules (and their font files) never load.
const localeFonts: Record<string, { className: string; sans: string; display: string }> = {
  en: {
    className: `${inter.variable} ${spaceGrotesk.variable}`,
    sans: "var(--font-inter)",
    display: "var(--font-space-grotesk)",
  },
  he: {
    className: heebo.variable,
    sans: "var(--font-heebo)",
    display: "var(--font-heebo)",
  },
  ar: {
    className: cairo.variable,
    sans: "var(--font-cairo)",
    display: "var(--font-cairo)",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  // The Legal namespace (three full legal documents) is only ever read by
  // server components (LegalShell uses useTranslations server-side), so it
  // never needs to reach the client — excluding it shrinks every page's
  // hydration payload in all three languages.
  const { Legal: _legal, ...messages } = await getMessages();
  const dir = localeDirections[locale];
  const font = localeFonts[locale];

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${font.className} h-full antialiased dark`}
      style={
        {
          "--font-sans": font.sans,
          "--font-display": font.display,
        } as React.CSSProperties
      }
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          {children}
          <CrispChat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
