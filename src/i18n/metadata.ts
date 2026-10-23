import { type Locale, routing } from "./routing";

const OG_LOCALE: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
};

/** 한국어 기준 경로(`/statute`)를 해당 언어 주소로 바꾼다. 한국어는 접두어 없음 */
export function localizedPath(locale: Locale, path: string): string {
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * 언어별 canonical·hreflang alternates와 openGraph url/locale.
 * 하위 세그먼트가 openGraph를 통째로 덮어쓰므로 `openGraph: { ...m.openGraph, title, ... }`처럼 펼쳐 쓴다
 * @param path 한국어 기준 경로 (예: "/", "/statute", `/board/${id}`)
 */
export function localeMetadata(locale: Locale, path: string) {
  return {
    alternates: {
      canonical: localizedPath(locale, path),
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, localizedPath(l, path)]),
        ),
        "x-default": path,
      },
    },
    openGraph: {
      url: localizedPath(locale, path),
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
    },
  };
}
