import { localizedPath } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

export const SITE_URL = "https://cleanbreath.cmu02-studio.com";
/** 모든 페이지의 구조화 데이터가 author·publisher·about으로 가리키는 운영 주체 */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const GITHUB_ORG_URL = "https://github.com/CleanBreath";
export const ISSUES_URL =
  "https://github.com/CleanBreath/cleanbreath-frontend/issues";
export const OG_IMAGE_URL = `${SITE_URL}/OGImage.png`;

export const IN_LANGUAGE: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

/** 한국어 기준 경로를 해당 언어의 절대 주소로 바꾼다 */
export function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${localizedPath(locale, path)}`;
}

/**
 * CleanBreath 운영 주체. 실제 값만 넣는다 (대표 이메일·전화는 없어 contactPoint는 GitHub Issues)
 * @param description 언어별 설명 (meta.organizationDescription)
 */
export function organizationJsonLd(description: string) {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "CleanBreath",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.svg`,
    description,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "대림대학교",
      alternateName: "Daelim University",
    },
    sameAs: [GITHUB_ORG_URL],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: ISSUES_URL,
      availableLanguage: ["ko", "en", "ja"],
    },
  };
}

/** 홈부터 현재 페이지까지의 BreadcrumbList. items는 순서대로 { name, url } */
export function breadcrumbJsonLd(
  id: string,
  items: { name: string; url: string }[],
) {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface GuideJsonLdOptions {
  locale: Locale;
  /** 한국어 기준 경로 (예: "/guide/fine") */
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  homeName: string;
  breadcrumbName: string;
  organizationDescription: string;
}

/** 안내(가이드) 페이지용 Article + BreadcrumbList. FAQPage·HowTo는 쓰지 않는다 */
export function guideJsonLd({
  locale,
  path,
  headline,
  description,
  datePublished,
  dateModified,
  homeName,
  breadcrumbName,
  organizationDescription,
}: GuideJsonLdOptions) {
  const pageUrl = absoluteUrl(locale, path);
  const homeUrl = absoluteUrl(locale, "/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(organizationDescription),
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline,
        description,
        inLanguage: IN_LANGUAGE[locale],
        datePublished,
        dateModified,
        image: OG_IMAGE_URL,
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
          breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        },
        isPartOf: { "@id": `${homeUrl}#website` },
      },
      breadcrumbJsonLd(`${pageUrl}#breadcrumb`, [
        { name: homeName, url: homeUrl },
        { name: breadcrumbName, url: pageUrl },
      ]),
    ],
  };
}

/** <script type="application/ld+json">에 넣을 문자열. `</script>` 탈출을 막는다 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
