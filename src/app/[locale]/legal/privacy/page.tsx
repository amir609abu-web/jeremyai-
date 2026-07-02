import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalShell } from "@/components/legal-shell";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Legal");
  const tp = await getTranslations("Legal.privacy");

  return (
    <LegalShell title={tp("title")} updated={t("draftDate")}>
      <h2>{tp("s1_title")}</h2>
      <ul>
        <li>{tp("s1_item1")}</li>
        <li>{tp("s1_item2")}</li>
        <li>{tp("s1_item3")}</li>
        <li>{tp("s1_item4")}</li>
      </ul>

      <h2>{tp("s2_title")}</h2>
      <p>{tp("s2_body")}</p>

      <h2>{tp("s3_title")}</h2>
      <ul>
        <li>{tp("s3_item1")}</li>
        <li>{tp("s3_item2")}</li>
        <li>{tp("s3_item3")}</li>
        <li>{tp("s3_item4")}</li>
      </ul>

      <h2>{tp("s4_title")}</h2>
      <p>{tp("s4_body")}</p>

      <h2>{tp("s5_title")}</h2>
      <p>{tp("s5_body")}</p>

      <h2>{tp("s6_title")}</h2>
      <p>{tp("s6_body")}</p>

      <h2>{tp("s7_title")}</h2>
      <p>{tp("s7_body")}</p>

      <h2>{tp("s8_title")}</h2>
      <p>{tp("s8_body")}</p>

      <h2>{tp("s9_title")}</h2>
      <p>{tp("s9_body")}</p>

      <h2>{tp("s10_title")}</h2>
      <p>{tp("s10_body")}</p>
    </LegalShell>
  );
}
