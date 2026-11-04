/**
 * 게시판 상세(/board/{id}) 사이트맵 항목.
 * src/app/sitemap.ts에서 `[...정적 항목, ...(await getBoardSitemapEntries())]`처럼 합쳐 쓴다.
 * API가 실패하면(야간 DB 중지 등) 예외 대신 빈 배열을 돌려준다
 */

import type { MetadataRoute } from "next";
import { localizedPath } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import { fetchBoardListPage } from "@/lib/seo/board-data";
import type { SmokingAreaItem } from "@/types";

const baseUrl = "https://cleanbreath.cmu02-studio.com";

/** /allRequestAddressPage의 size 최대값 */
const PAGE_SIZE = 2000;

/** 사이트맵 한 파일은 URL 50,000개까지. 언어 3개 × 16,000 = 48,000으로 정적 페이지 자리를 남긴다 */
const MAX_ITEMS = 16000;

/** 사이트맵용 목록은 자주 바뀌지 않으므로 1시간 캐시 */
const SITEMAP_REVALIDATE_SECONDS = 3600;

const url = (path: string) => `${baseUrl}${path}`;

/**
 * 항목에 날짜 필드가 있으면 lastModified로 쓴다.
 * 문서화된 목록 응답에는 날짜가 없어서 지금은 대부분 생략되고, 백엔드가 updateAt을 내려주면 자동으로 쓰인다
 */
function lastModifiedOf(item: SmokingAreaItem): string | undefined {
  const raw = (item as SmokingAreaItem & { updateAt?: unknown }).updateAt;
  if (typeof raw !== "string") return undefined;
  const time = Date.parse(raw.replace(" ", "T"));
  return Number.isNaN(time) ? undefined : raw.replace(" ", "T");
}

async function fetchAllBoardItems(): Promise<SmokingAreaItem[] | null> {
  const items: SmokingAreaItem[] = [];
  for (let page = 0; items.length < MAX_ITEMS; page++) {
    const result = await fetchBoardListPage(
      page,
      PAGE_SIZE,
      SITEMAP_REVALIDATE_SECONDS,
    );
    if (result.status !== "ok") return null;
    items.push(...result.data.content);
    const totalPages = result.data.page?.totalPages ?? 0;
    if (page + 1 >= totalPages || result.data.content.length === 0) break;
  }
  return items.slice(0, MAX_ITEMS);
}

/** 색인할 게시판 상세 페이지의 사이트맵 항목 (언어 3개, hreflang alternates 포함) */
export async function getBoardSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const items = await fetchAllBoardItems();
    if (!items) return [];

    // 같은 id가 페이지 경계에서 중복될 수 있어 한 번만 넣는다
    const seen = new Set<number>();
    const unique = items.filter((item) => {
      if (typeof item.id !== "number" || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    return routing.locales.flatMap((locale) =>
      unique.map((item) => {
        const path = `/board/${item.id}`;
        const lastModified = lastModifiedOf(item);
        return {
          url: url(localizedPath(locale, path)),
          ...(lastModified && { lastModified }),
          alternates: {
            languages: {
              ...Object.fromEntries(
                routing.locales.map((l) => [l, url(localizedPath(l, path))]),
              ),
              "x-default": url(path),
            },
          },
        };
      }),
    );
  } catch {
    return [];
  }
}
