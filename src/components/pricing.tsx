import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Pricing() {
  const t = await getTranslations("Pricing");

  const features = [t("feature1"), t("feature2"), t("feature3"), t("feature4")];
  const paymentMethods = [t("applePay"), t("googlePay")];

  return (
    <section id="pricing" className="mx-auto max-w-3xl px-6 py-24 scroll-mt-24">
      <div className="mx-auto mb-12 max-w-xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-muted">{t("subtitle")}</p>
      </div>

      <div className="glass-card mx-auto max-w-md rounded-3xl p-6 text-center sm:p-8">
        <p className="font-display text-sm font-medium uppercase tracking-widest text-primary">
          {t("plan")}
        </p>
        <p className="mt-3 font-display text-5xl font-semibold">
          $29<span className="text-lg font-normal text-muted">{t("priceSuffix")}</span>
        </p>
        <p className="mt-2 text-sm text-muted-2">{t("priceNote")}</p>

        <ul className="mt-8 space-y-3 text-start text-sm text-muted">
          {features.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>

        <Link
          href="/signup"
          className="mt-8 block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-[#04140a] shadow-[0_0_40px_-10px_rgba(52,225,122,0.7)] transition-transform hover:scale-[1.02]"
        >
          {t("cta")}
        </Link>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-2">
          {paymentMethods.map((m) => (
            <span
              key={m}
              className="rounded-full border border-border-glass px-3 py-1"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
