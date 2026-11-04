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

const PATH = "/guide/fine";
// 페이지 문구를 바꾸면 dateModified와 sitemap.ts의 날짜를 함께 갱신
const DATE_PUBLISHED = "2026-11-04";
const DATE_MODIFIED = "2026-11-04";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "guide.fine" });
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

export default function FineGuidePage({
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
  const [fine, eCigarette, , owner] = getStatuteData(locale).faq.items;

  const jsonLd = guideJsonLd({
    locale,
    path: PATH,
    headline: t("fine.title"),
    description: t("fine.meta.description"),
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
    homeName: tc("home"),
    breadcrumbName: t("fine.meta.breadcrumb"),
    organizationDescription: tm("organizationDescription"),
  });

  return (
    <GuideLayout
      title={t("fine.title")}
      subtitle={t("fine.subtitle")}
      answer={t("fine.answer")}
      jsonLd={jsonLd}
      related={[{ href: "/guide/apartment", label: t("apartment.title") }]}
    >
      <GuideQuestion
        question={fine.question}
        paragraphs={[fine.answer[0]]}
        sources={fine.sources}
      >
        <GuideSubQuestion question={t("fine.questions.byPlace")}>
          {fine.answer[1]}
        </GuideSubQuestion>
        <GuideSubQuestion question={t("fine.questions.ordinance")}>
          {fine.answer[2]}
        </GuideSubQuestion>
        <GuideSubQuestion question={t("fine.questions.reduction")}>
          {fine.answer[3]}
        </GuideSubQuestion>
      </GuideQuestion>

      <GuideQuestion
        question={eCigarette.question}
        paragraphs={eCigarette.answer}
        sources={eCigarette.sources}
      />

      <GuideQuestion
        question={owner.question}
        paragraphs={owner.answer}
        sources={owner.sources}
      />
    </GuideLayout>
  );
}
