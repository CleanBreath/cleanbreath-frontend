import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BoardDetail } from "@/components/board/board-detail";
import { localeMetadata, localizedPath } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { getZoneName, hasBuildingName, parseBoardId } from "@/lib/board-zone";
import { fetchBoardDetail } from "@/lib/seo/board-data";
import type { SmokingAreaDetail } from "@/types";

// [locale] 레이아웃이 dynamicParams = false라 generateStaticParams를 두면 새 글이 404가 된다.
// 그래서 요청마다 렌더링하되, API 응답은 fetch 데이터 캐시(5분)에 두고
// 재검증이 실패하면(야간 DB 중지) 마지막으로 받은 데이터를 계속 쓴다 (board-data 참고)

const SITE_URL = "https://cleanbreath.cmu02-studio.com";
const IN_LANGUAGE: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

type Params = Promise<{ locale: string; id: string }>;

/** 구역 데이터로 만든 제목·설명. 데이터가 없으면 기존 고정 문구 */
async function buildDetailText(locale: Locale, detail?: SmokingAreaDetail) {
  const t = await getTranslations({ locale, namespace: "board" });
  if (!detail) {
    return {
      title: t("detailMeta.title"),
      description: t("detailMeta.description"),
    };
  }
  const values = {
    name: getZoneName(detail),
    address: detail.addressName,
    category: detail.category,
  };
  return hasBuildingName(detail)
    ? {
        title: t("detailMeta.titleNamed", values),
        description: t("detailMeta.descriptionNamed", values),
      }
    : {
        title: t("detailMeta.titleAddressOnly", values),
        description: t("detailMeta.descriptionAddressOnly", values),
      };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale: rawLocale, id: rawId } = await params;
  const locale = rawLocale as Locale;
  const id = parseBoardId(rawId);
  // 형식이 틀린 id는 페이지에서 notFound() 처리
  if (id === null) return {};

  const result = await fetchBoardDetail(id);
  const detail = result.status === "ok" ? result.data : undefined;
  const { title, description } = await buildDetailText(locale, detail);
  const tm = await getTranslations({ locale, namespace: "meta" });
  // 부모 /board canonical을 물려받지 않도록 상세 경로로 덮어씀
  const m = localeMetadata(locale, `/board/${id}`);

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

export default async function BoardDetailPage({ params }: { params: Params }) {
  const { locale: rawLocale, id: rawId } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const id = parseBoardId(rawId);
  if (id === null) notFound();

  const result = await fetchBoardDetail(id);
  // 백엔드가 없다고 답한 경우만 404. API 장애(야간 DB 중지 등)는 404가 아니라 클라이언트 조회로 채운다
  if (result.status === "not-found") notFound();
  const detail = result.status === "ok" ? result.data : undefined;

  const t = await getTranslations({ locale, namespace: "board" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const { title } = await buildDetailText(locale, detail);
  const listUrl = SITE_URL + localizedPath(locale, "/board");
  const pageUrl = SITE_URL + localizedPath(locale, `/board/${id}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
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
            name: t("list.title"),
            item: listUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: detail ? getZoneName(detail) : t("detail.title"),
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <BoardDetail id={id} initialDetail={detail} />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 메시지 문구와 API 데이터로 만든 jsonLd를 JSON.stringify하고 <를 이스케이프한 값
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
