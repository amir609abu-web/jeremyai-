import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { GlobeSection } from "@/components/globe-section";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { OutroSection } from "@/components/outro-section";
import { Footer } from "@/components/footer";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <Hero />
      <GlobeSection />
      <Features />
      <Pricing />
      <OutroSection />
      <Footer />
    </div>
  );
}
