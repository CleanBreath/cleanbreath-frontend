import type { MetadataRoute } from "next";
import { localizedPath } from "@/i18n/metadata";
import { type Locale, routing } from "@/i18n/routing";

const baseUrl = "https://cleanbreath.cmu02-studio.com";

// 페이지별 실제 마지막 수정일. 페이지(또는 그 메시지 파일)를 바꾸면 해당 날짜도 함께 갱신할 것
// (기준: 해당 페이지 파일·메시지의 마지막 커밋일 `git log -1 --format=%cs -- <files>`)
const PAGES = [
  { path: "/", lastModified: "2026-11-04" },
  { path: "/statute", lastModified: "2026-11-04" },
  { path: "/guide/fine", lastModified: "2026-11-04" },
  { path: "/guide/apartment", lastModified: "2026-11-04" },
  { path: "/board", lastModified: "2026-10-23" },
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

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = routing.locales.flatMap((locale) =>
    PAGES.map(({ path, lastModified }) => entry(locale, path, lastModified)),
  );

  // ── 동적 항목 자리 (integrator) ─────────────────────────────────────────
  // src/lib/seo/zones-sitemap.ts, src/lib/seo/board-sitemap.ts의 항목을 여기에 이어 붙인다.
  // API 호출이 필요하면 이 함수를 async로 바꾸고, DB 야간 중지(23:00~08:30 KST) 중 실패해도
  // 정적 항목은 그대로 내보내도록 각 호출을 try/catch(빈 배열 대체)로 감쌀 것.
  return [...staticEntries];
}
