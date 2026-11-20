import type { MetadataRoute } from "next";
import { localizedPath } from "@/i18n/metadata";
import { type Locale, routing } from "@/i18n/routing";
import { getBoardSitemapEntries } from "@/lib/seo/board-sitemap";
import { zonesSitemap } from "@/lib/seo/zones-sitemap";

// 게시판 상세 항목이 API에서 오므로 빌드 시점 값에 묶이지 않게 1시간마다 다시 만든다.
// 야간 DB 중지(23:00~08:30 KST) 중 재생성되면 예외로 끝나 이전 sitemap이 그대로 유지된다 (게시판 항목이 빠진 판을 캐시하지 않음)
export const revalidate = 3600;

const baseUrl = "https://cleanbreath.cmu02-studio.com";

// 페이지별 실제 마지막 수정일. 페이지(또는 그 메시지 파일)를 바꾸면 해당 날짜도 함께 갱신할 것
// (기준: 해당 페이지 파일·메시지의 마지막 커밋일 `git log -1 --format=%cs -- <files>`)
const PAGES = [
  { path: "/", lastModified: "2026-11-04" },
  { path: "/statute", lastModified: "2026-11-04" },
  { path: "/guide/fine", lastModified: "2026-11-04" },
  { path: "/guide/apartment", lastModified: "2026-11-04" },
  { path: "/board", lastModified: "2026-11-04" },
  { path: "/about", lastModified: "2026-11-04" },
  { path: "/privacy", lastModified: "2026-10-26" },
];

// 한국어 홈은 기존처럼 끝 슬래시 없는 baseUrl
const url = (path: string) => (path === "/" ? baseUrl : `${baseUrl}${path}`);

/** 한 언어의 sitemap 항목 (ko/en/ja + x-default hreflang). 동적 항목도 이 모양을 따른다 */
function entry(
  locale: Locale,
  path: string,
  lastModified: string | Date,
): MetadataRoute.Sitemap[number] {
  return {
    url: url(localizedPath(locale, path)),
    lastModified,
    alternates: {
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, url(localizedPath(l, path))]),
        ),
        "x-default": url(path),
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = routing.locales.flatMap((locale) =>
    PAGES.map(({ path, lastModified }) => entry(locale, path, lastModified)),
  );

  // 지역 페이지 항목은 고정 날짜 상수로 만들어 API와 무관하다
  const zoneEntries = zonesSitemap();

  // 게시판 상세는 API 목록에서 만든다. 운영 재생성 중 실패하면(야간 DB 중지 등) 여기서 예외가 올라가
  // Next가 마지막으로 성공한 sitemap을 계속 내보낸다. 빌드·개발 중에는 빈 배열로 대체한다 (board-sitemap.ts)
  const boardEntries = await getBoardSitemapEntries();

  return [...staticEntries, ...zoneEntries, ...boardEntries];
}
