import type { MetadataRoute } from "next";
import { localizedPath } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import { DISTRICTS_WITH_PAGE, SITE_URL, ZONES_PATHS } from "./zones-seo";

// 지역별 금연구역 페이지의 구성(표·문구·구 목록)을 바꾸면 이 날짜도 함께 갱신할 것.
// 표의 행은 API 데이터로 매일 바뀔 수 있지만, 빌드 시점 sitemap이 API(야간 중단)에 묶이지 않도록 고정 날짜를 쓴다
const ZONES_LAST_MODIFIED = "2026-11-04";

const url = (path: string) => `${SITE_URL}${path}`;

/** /zones/* 페이지의 sitemap 항목 (3개 언어, hreflang 포함). app/sitemap.ts에서 이어 붙인다 */
export function zonesSitemap(): MetadataRoute.Sitemap {
  const paths = [
    ZONES_PATHS.seoul,
    ...DISTRICTS_WITH_PAGE.map((d) => ZONES_PATHS.district(d.slug)),
    ZONES_PATHS.anyang,
  ];
  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: url(localizedPath(locale, path)),
      lastModified: ZONES_LAST_MODIFIED,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [l, url(localizedPath(l, path))]),
          ),
          "x-default": url(path),
        },
      },
    })),
  );
}
