import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

// 부모 /board canonical을 물려받지 않도록 상세 경로로 덮어씀
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "board" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const m = localeMetadata(locale, `/board/${encodeURIComponent(id)}`);
  const title = t("detailMeta.title");
  const description = t("detailMeta.description");

  return {
    // 부모 board/layout이 템플릿 없는 문자열 title이라 루트 템플릿이 적용되지 않음
    title: { absolute: `${title} | CleanBreath` },
    description,
    alternates: m.alternates,
    openGraph: {
      ...m.openGraph,
      type: "website",
      siteName: "CleanBreath",
      title,
      description,
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

export default function BoardDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
