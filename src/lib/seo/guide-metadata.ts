import type { Metadata } from "next";
import { localeMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { OG_IMAGE_URL } from "./jsonld";

interface GuideMetadataOptions {
  locale: Locale;
  /** 한국어 기준 경로 (예: "/guide/fine") */
  path: string;
  title: string;
  description: string;
  imageAlt: string;
  datePublished: string;
  dateModified: string;
}

/** 안내 페이지 metadata. canonical·hreflang(ko/en/ja/x-default)은 localeMetadata로 */
export function guideMetadata({
  locale,
  path,
  title,
  description,
  imageAlt,
  datePublished,
  dateModified,
}: GuideMetadataOptions): Metadata {
  const m = localeMetadata(locale, path);
  return {
    title,
    description,
    alternates: m.alternates,
    openGraph: {
      ...m.openGraph,
      type: "article",
      siteName: "CleanBreath",
      title,
      description,
      publishedTime: datePublished,
      modifiedTime: dateModified,
      images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: imageAlt }],
    },
  };
}
