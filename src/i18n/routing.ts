import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en", "ja"],
  defaultLocale: "ko",
  // 한국어는 기존 주소 그대로(/statute), 영어·일본어만 /en·/ja 접두어
  localePrefix: "as-needed",
  // Accept-Language와 NEXT_LOCALE 쿠키로 첫 언어를 고른다. 둘 다 없으면(검색 로봇) 한국어로 200 응답
  localeDetection: true,
  // 고른 언어를 다음 방문에도 유지 (기본값은 세션 쿠키)
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
});

export type Locale = (typeof routing.locales)[number];
