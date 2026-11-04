import type { Metadata } from "next";
import { localeMetadata, localizedPath } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { SEOUL_DISTRICTS, type SeoulDistrict } from "./seoul-districts";

// 지역별 금연구역 페이지(/zones/*)의 경로·메타데이터·구조화 데이터

export const SITE_URL = "https://cleanbreath.cmu02-studio.com";

/**
 * /zones/* 페이지 구성(표·문구·구 목록)의 마지막 수정일. sitemap lastmod와 CollectionPage.dateModified에 같이 쓴다.
 * 표의 행은 API 데이터로 바뀔 수 있지만, 빌드 시점 값이 API(야간 중단)에 묶이지 않도록 고정 날짜를 쓴다.
 * 데이터 기준일(referenceDate)은 페이지 수정일이 아니므로 본문 출처 줄(ZonesSource)에만 보여 준다
 */
export const ZONES_LAST_MODIFIED = "2026-11-04";

export const ZONES_PATHS = {
  seoul: "/zones/seoul",
  anyang: "/zones/anyang",
  district: (slug: string) => `/zones/seoul/${slug}`,
} as const;

/** 상세 페이지가 있는 구 (생성 시점에 공공데이터가 있던 구) */
export const DISTRICTS_WITH_PAGE = SEOUL_DISTRICTS.filter(
  (d) => d.tiles.length > 0,
);

export function districtName(district: SeoulDistrict, locale: Locale) {
  return locale === "ko" ? district.ko : district[locale];
}

const IN_LANGUAGE: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

/** canonical·hreflang·openGraph를 포함한 페이지 메타데이터 */
export function zonesMetadata({
  locale,
  path,
  title,
  description,
  ogImageAlt,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  ogImageAlt: string;
}): Metadata {
  const m = localeMetadata(locale, path);
  return {
    title,
    description,
    alternates: m.alternates,
    openGraph: {
      ...m.openGraph,
      type: "website",
      siteName: "CleanBreath",
      title,
      description,
      images: [
        { url: "/OGImage.png", width: 1200, height: 630, alt: ogImageAlt },
      ],
    },
  };
}

/**
 * BreadcrumbList + CollectionPage (FAQPage·HowTo·LocalBusiness는 쓰지 않는다).
 * 행 목록을 ItemList로 넣지 않는다 (구 페이지는 행이 1000개를 넘고, 요소 없는 ItemList는 정보가 없다)
 */
export function zonesJsonLd({
  locale,
  path,
  name,
  description,
  crumbs,
  links,
}: {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  /** 홈부터 현재 페이지까지 (한국어 기준 경로) */
  crumbs: { name: string; path: string }[];
  /** 목록 페이지가 링크하는 하위 페이지 (ItemList로 표시) */
  links?: { name: string; path: string }[];
}) {
  const abs = (p: string) => SITE_URL + localizedPath(locale, p);
  const pageUrl = abs(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name,
        description,
        inLanguage: IN_LANGUAGE[locale],
        dateModified: ZONES_LAST_MODIFIED,
        isPartOf: { "@id": `${abs("/")}#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        ...(links
          ? {
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: links.length,
                itemListElement: links.map((l, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: l.name,
                  url: abs(l.path),
                })),
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: abs(c.path),
        })),
      },
    ],
  };
}
