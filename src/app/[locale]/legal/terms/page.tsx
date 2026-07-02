import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalShell } from "@/components/legal-shell";
import { Link } from "@/i18n/navigation";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Legal");
  const tt = await getTranslations("Legal.terms");

  return (
    <LegalShell title={tt("title")} updated={t("draftDate")}>
      <h2>{tt("s1_title")}</h2>
      <p>{tt("s1_body")}</p>

      <h2>{tt("s2_title")}</h2>
      <p>{tt("s2_body1")}</p>
      <p>
        {tt("s2_body2")}{" "}
        <Link href="/legal/risk-disclosure" className="text-primary underline">
          {tt("s2_body2_link")}
        </Link>
        .
      </p>

      <h2>{tt("s3_title")}</h2>
      <p>{tt("s3_body")}</p>

      <h2>{tt("s4_title")}</h2>
      <p>{tt("s4_body")}</p>

      <h2>{tt("s5_title")}</h2>
      <ul>
        <li>{tt("s5_item1")}</li>
        <li>{tt("s5_item2")}</li>
        <li>{tt("s5_item3")}</li>
        <li>{tt("s5_item4")}</li>
      </ul>

      <h2>{tt("s6_title")}</h2>
      <p>{tt("s6_body")}</p>

      <h2>{tt("s7_title")}</h2>
      <p>{tt("s7_body")}</p>

      <h2>{tt("s8_title")}</h2>
      <p>{tt("s8_body")}</p>

      <h2>{tt("s9_title")}</h2>
      <p>{tt("s9_body")}</p>

      <h2>{tt("s10_title")}</h2>
      <p>{tt("s10_body")}</p>

      <h2>{tt("s11_title")}</h2>
      <p>{tt("s11_body")}</p>

      <h2>{tt("s12_title")}</h2>
      <p>{tt("s12_body")}</p>

      <h2>{tt("s13_title")}</h2>
      <p>{tt("s13_body")}</p>
    </LegalShell>
  );
}
