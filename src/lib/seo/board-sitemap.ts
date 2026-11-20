/**
 * 게시판 상세(/board/{id}) 사이트맵 항목.
 * src/app/sitemap.ts에서 `[...정적 항목, ...(await getBoardSitemapEntries())]`처럼 합쳐 쓴다.
 * 운영 서버의 재생성 중 목록을 끝까지 받지 못하면(야간 DB 중지 등) 예외를 던져 Next가 마지막으로 성공한 sitemap을 계속 내보내게 하고,
 * 빌드·개발 중에는 받은 데까지만(실패하면 빈 배열) 돌려준다
 */

import type { MetadataRoute } from "next";
import { localizedPath } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import {
  fetchBoardListPage,
  shouldKeepLastGoodPage,
} from "@/lib/seo/board-data";
import type { SmokingAreaItem } from "@/types";

const baseUrl = "https://cleanbreath.cmu02-studio.com";

/**
 * 요청할 페이지 크기. 문서(skill endpoints.md)는 최대 2000이라고 하지만
 * 실제 서버는 더 큰 값을 50으로 줄여 돌려준다 (2026-11-04 size=2000·100 요청 모두 page.size 50 확인).
 * 페이지 수는 응답의 totalPages를 따르므로 서버 상한이 바뀌어도 맞게 동작한다
 */
const PAGE_SIZE = 50;

/** 사이트맵 한 파일은 URL 50,000개까지. 언어 3개 × 16,000 = 48,000으로 정적 페이지 자리를 남긴다 */
const MAX_ITEMS = 16000;

/** 첫 페이지 뒤의 페이지를 동시에 몇 개까지 받을지 (페이지 수백 개를 하나씩 기다리지 않도록) */
const CONCURRENCY = 4;

/** 사이트맵용 목록은 자주 바뀌지 않으므로 1시간 캐시 */
const SITEMAP_REVALIDATE_SECONDS = 3600;

const url = (path: string) => `${baseUrl}${path}`;

/**
 * 백엔드 날짜를 W3C datetime으로 바꾼다. updateAt은 오프셋 없는 서버 시각(UTC)이라
 * 그대로 쓰면 시간대가 빠진 잘못된 <lastmod>가 된다 (zones-data.ts parseServerTime과 같은 해석)
 */
function toW3cDate(raw: string): string | undefined {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const normalized = raw.replace(" ", "T");
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(normalized);
  const date = new Date(hasZone ? normalized : `${normalized.slice(0, 23)}Z`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/**
 * 항목에 날짜 필드가 있으면 lastModified로 쓴다.
 * 문서화된 목록 응답에는 날짜가 없어서 지금은 대부분 생략되고, 백엔드가 updateAt을 내려주면 자동으로 쓰인다
 */
function lastModifiedOf(item: SmokingAreaItem): string | undefined {
  const raw = (item as SmokingAreaItem & { updateAt?: unknown }).updateAt;
  return typeof raw === "string" ? toW3cDate(raw) : undefined;
}

/** 목록 전체. complete가 false면 일부 페이지를 받지 못한 것 */
async function fetchAllBoardItems(): Promise<{
  items: SmokingAreaItem[];
  complete: boolean;
}> {
  const first = await fetchBoardListPage(
    0,
    PAGE_SIZE,
    SITEMAP_REVALIDATE_SECONDS,
  );
  if (first.status !== "ok") return { items: [], complete: false };

  const items = [...first.data.content];
  // 서버가 실제로 쓴 페이지 크기로 필요한 페이지 수를 정한다
  const pageSize = first.data.page?.size || PAGE_SIZE;
  const totalPages = Math.min(
    first.data.page?.totalPages ?? 1,
    Math.ceil(MAX_ITEMS / pageSize),
  );
  const rest = Array.from(
    { length: Math.max(totalPages - 1, 0) },
    (_, i) => i + 1,
  );

  // 하나라도 실패하면 남은 페이지는 요청하지 않는다 (서버가 꺼져 있을 때 수백 번 기다리지 않게)
  const pages: SmokingAreaItem[][] = new Array(rest.length);
  let next = 0;
  let failed = false;
  const worker = async () => {
    while (next < rest.length && !failed) {
      const i = next++;
      const result = await fetchBoardListPage(
        rest[i],
        pageSize,
        SITEMAP_REVALIDATE_SECONDS,
      );
      if (result.status !== "ok") {
        failed = true;
        return;
      }
      pages[i] = result.data.content;
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, rest.length) }, worker),
  );

  // 실패한 경우에도 받은 페이지는 순서대로 남긴다 (빌드·개발 중 부분 결과용)
  for (const page of pages) if (page) items.push(...page);
  return { items: items.slice(0, MAX_ITEMS), complete: !failed };
}

/** 색인할 게시판 상세 페이지의 사이트맵 항목 (언어 3개, hreflang alternates 포함) */
export async function getBoardSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  let items: SmokingAreaItem[] = [];
  try {
    const result = await fetchAllBoardItems();
    if (!result.complete && shouldKeepLastGoodPage()) {
      throw new Error(
        "게시판 목록을 끝까지 받지 못해 이전 sitemap을 유지합니다.",
      );
    }
    items = result.items;
  } catch (error) {
    if (shouldKeepLastGoodPage()) throw error;
    return [];
  }

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
}
