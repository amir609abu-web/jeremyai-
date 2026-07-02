import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";

export async function Navbar() {
  const t = await getTranslations("Nav");

  const links = [
    { href: "#bias", label: t("bias") },
    { href: "#calendar", label: t("calendar") },
    { href: "#assistant", label: t("assistant") },
    { href: "#pricing", label: t("pricing") },
  ];

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-[#04140a] font-display">
          J
        </span>
        <span className="font-display text-lg font-semibold tracking-tight">
          JeremyAI
        </span>
      </Link>

      <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <Link
          href="/signup"
          className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/15"
        >
          {t("getStarted")}
        </Link>
      </div>
    </header>
  );
}
