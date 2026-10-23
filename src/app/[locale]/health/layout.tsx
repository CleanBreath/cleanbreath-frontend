import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "health" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const m = localeMetadata(locale, "/health");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: m.alternates,
    openGraph: {
      ...m.openGraph,
      type: "website",
      siteName: "CleanBreath",
      title: t("meta.title"),
      description: t("meta.description"),
      images: [
        {
          url: "/OGImage.png",
          width: 1200,
          height: 630,
          alt: tm("ogImageAlt"),
        },
      ],
    },
    robots: { index: false, follow: false },
  };
}

export default function HealthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
