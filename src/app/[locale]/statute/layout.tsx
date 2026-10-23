import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeMetadata, localizedPath } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

const SITE_URL = "https://cleanbreath.cmu02-studio.com";
const IN_LANGUAGE: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "statute" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const m = localeMetadata(locale, "/statute");

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
  };
}

export default async function StatuteLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("statute");
  const tc = await getTranslations("common");
  const pageUrl = SITE_URL + localizedPath(locale, "/statute");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: t("meta.title"),
        description: t("meta.description"),
        inLanguage: IN_LANGUAGE[locale],
        isPartOf: { "@id": `${SITE_URL}${localizedPath(locale, "/")}#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: tc("home"),
            item: SITE_URL + localizedPath(locale, "/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t("title"),
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      {children}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 메시지 파일 문구로 만든 jsonLd 객체를 JSON.stringify한 값이라 사용자 입력 없음
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
