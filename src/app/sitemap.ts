import type { MetadataRoute } from "next";
import { localizedPath } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";

const baseUrl = "https://cleanbreath.cmu02-studio.com";

// 페이지 내용이 바뀌면 해당 lastModified 날짜도 함께 갱신할 것
const PAGES = [
  { path: "/", lastModified: "2026-10-22" },
  { path: "/statute", lastModified: "2026-10-22" },
  { path: "/board", lastModified: "2026-10-22" },
  { path: "/about", lastModified: "2026-10-22" },
  { path: "/privacy", lastModified: "2026-10-22" },
];

// 한국어 홈은 기존처럼 끝 슬래시 없는 baseUrl
const url = (path: string) => (path === "/" ? baseUrl : `${baseUrl}${path}`);

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    PAGES.map(({ path, lastModified }) => ({
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
    })),
  );
}
