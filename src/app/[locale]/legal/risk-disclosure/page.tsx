import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalShell } from "@/components/legal-shell";

export default async function RiskDisclosurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Legal");
  const tr = await getTranslations("Legal.risk");

  return (
    <LegalShell title={tr("title")} updated={t("draftDate")}>
      <h2>{tr("s1_title")}</h2>
      <p>{tr("s1_body")}</p>

      <h2>{tr("s2_title")}</h2>
      <p>{tr("s2_body")}</p>

      <h2>{tr("s3_title")}</h2>
      <p>{tr("s3_body")}</p>

      <h2>{tr("s4_title")}</h2>
      <p>{tr("s4_body")}</p>

      <h2>{tr("s5_title")}</h2>
      <p>{tr("s5_body")}</p>
    </LegalShell>
  );
}
