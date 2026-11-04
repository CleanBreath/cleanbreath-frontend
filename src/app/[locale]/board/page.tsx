import { getTranslations, setRequestLocale } from "next-intl/server";
import { BoardList } from "@/components/board/board-list";
import { localizedPath } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { BOARD_PAGE_SIZE, getZoneLabel } from "@/lib/board-zone";
import {
  fetchBoardListPage,
  shouldKeepLastGoodPage,
} from "@/lib/seo/board-data";

// ISR: 5분마다 첫 페이지를 다시 받아 HTML에 구역 이름을 싣는다 (board-data의 BOARD_REVALIDATE_SECONDS와 같은 값)
export const revalidate = 300;

const SITE_URL = "https://cleanbreath.cmu02-studio.com";
const IN_LANGUAGE: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

export default async function BoardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("board");
  const tc = await getTranslations("common");

  const result = await fetchBoardListPage(0, BOARD_PAGE_SIZE);
  // 운영 중 재생성이 실패하면(야간 DB 중지) 던져서 마지막으로 성공한 페이지를 계속 내보낸다.
  // 빌드 중 실패는 데이터 없이 렌더링하고, 화면은 클라이언트 조회로 채운다
  if (result.status !== "ok" && shouldKeepLastGoodPage()) {
    throw new Error("게시판 목록을 불러오지 못해 이전 페이지를 유지합니다.");
  }
  const firstPage = result.status === "ok" ? result.data : undefined;

  const pageUrl = SITE_URL + localizedPath(locale, "/board");
  const items = firstPage?.content ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: t("meta.title"),
        description: t("meta.description"),
        inLanguage: IN_LANGUAGE[locale],
        isPartOf: { "@id": `${SITE_URL}${localizedPath(locale, "/")}#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        // 서버에서 받은 첫 페이지 구역만 나열한다 (못 받았으면 생략)
        ...(items.length > 0 && {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: firstPage?.page.totalElements ?? items.length,
            itemListElement: items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: SITE_URL + localizedPath(locale, `/board/${item.id}`),
              name: getZoneLabel(item),
            })),
          },
        }),
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
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <BoardList initialFirstPage={firstPage} size={BOARD_PAGE_SIZE} />
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
