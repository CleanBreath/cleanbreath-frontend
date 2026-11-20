import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import {
  GuideLayout,
  GuideQuestion,
  GuideSubQuestion,
} from "@/components/guide/guide-layout";
import type { Locale } from "@/i18n/routing";
import { guideMetadata } from "@/lib/seo/guide-metadata";
import { guideJsonLd } from "@/lib/seo/jsonld";
import { getStatuteData } from "@/lib/statute-data";

const PATH = "/guide/apartment";
// 페이지 문구를 바꾸면 dateModified와 sitemap.ts의 날짜를 함께 갱신
// messages/*/guide.json의 answer·meta.description은 src/json/*/statute-faq.json의 조문·금액을 옮겨 적은 요약이다.
// statute-faq.json(lawBaseDate·reviewedAt)을 고치면 세 언어의 guide.json 요약도 함께 확인할 것
const DATE_PUBLISHED = "2026-11-04";
const DATE_MODIFIED = "2026-11-04";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "guide.apartment" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  return guideMetadata({
    locale,
    path: PATH,
    title: t("meta.title"),
    description: t("meta.description"),
    imageAlt: tm("ogImageAlt"),
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
  });
}

export default function ApartmentGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 정적 렌더링 유지 (locale 값은 [locale]/layout에서 검증됨)
  const locale = use(params).locale as Locale;
  setRequestLocale(locale);
  const t = useTranslations("guide");
  const tm = useTranslations("meta");
  const tc = useTranslations("common");
  // 법령 문구는 statute-faq.json에서만 가져온다. 항목 순서: 0 과태료, 1 전자담배, 2 공동주택, 3 시설 관리자
  const apartment = getStatuteData(locale).faq.items[2];

  const jsonLd = guideJsonLd({
    locale,
    path: PATH,
    headline: t("apartment.title"),
    description: t("apartment.meta.description"),
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
    homeName: tc("home"),
    breadcrumbName: t("apartment.meta.breadcrumb"),
    organizationDescription: tm("organizationDescription"),
  });

  return (
    <GuideLayout
      title={t("apartment.title")}
      subtitle={t("apartment.subtitle")}
      answer={t("apartment.answer")}
      jsonLd={jsonLd}
      related={[{ href: "/guide/fine", label: t("fine.title") }]}
    >
      <GuideQuestion
        question={apartment.question}
        paragraphs={[apartment.answer[0]]}
        sources={apartment.sources}
      >
        <GuideSubQuestion question={t("apartment.questions.application")}>
          {apartment.answer[1]}
        </GuideSubQuestion>
        <GuideSubQuestion question={t("apartment.questions.fine")}>
          {apartment.answer[2]}
        </GuideSubQuestion>
      </GuideQuestion>

      <GuideQuestion
        question={t("apartment.questions.map")}
        paragraphs={[t("apartment.mapAnswer")]}
      />
    </GuideLayout>
  );
}
