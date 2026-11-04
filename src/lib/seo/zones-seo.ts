import type { Metadata } from "next";
import { localeMetadata, localizedPath } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { SEOUL_DISTRICTS, type SeoulDistrict } from "./seoul-districts";

// 지역별 금연구역 페이지(/zones/*)의 경로·메타데이터·구조화 데이터

export const SITE_URL = "https://cleanbreath.cmu02-studio.com";

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

/** BreadcrumbList + CollectionPage (FAQPage·HowTo·LocalBusiness는 쓰지 않는다) */
export function zonesJsonLd({
  locale,
  path,
  name,
  description,
  crumbs,
  dateModified,
  numberOfItems,
  links,
}: {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  /** 홈부터 현재 페이지까지 (한국어 기준 경로) */
  crumbs: { name: string; path: string }[];
  dateModified?: string | null;
  numberOfItems?: number;
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
        ...(dateModified ? { dateModified } : {}),
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
          : numberOfItems !== undefined
            ? {
                mainEntity: { "@type": "ItemList", numberOfItems },
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
