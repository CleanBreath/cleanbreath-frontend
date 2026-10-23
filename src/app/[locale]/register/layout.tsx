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
  const t = await getTranslations({ locale, namespace: "register" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const m = localeMetadata(locale, "/register");

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
    // 입력 폼뿐인 얇은 페이지라 색인 제외, 링크는 따라가도록 유지
    robots: { index: false, follow: true },
  };
}

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
