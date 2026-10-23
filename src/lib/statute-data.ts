import type { Locale } from "@/i18n/routing";
import enStatute from "@/json/en/statute.json";
import enFaq from "@/json/en/statute-faq.json";
import jaStatute from "@/json/ja/statute.json";
import jaFaq from "@/json/ja/statute-faq.json";
import koStatute from "@/json/ko/statute.json";
import koFaq from "@/json/ko/statute-faq.json";

// 언어별 파일은 한국어본과 같은 구조여야 한다 (어긋나면 타입 오류)
type Statute = typeof koStatute;
type StatuteFaq = typeof koFaq;

const STATUTE: Record<Locale, Statute> = {
  ko: koStatute,
  en: enStatute,
  ja: jaStatute,
};

const FAQ: Record<Locale, StatuteFaq> = {
  ko: koFaq,
  en: enFaq,
  ja: jaFaq,
};

/** 법령 안내 데이터 (src/json/<locale>/statute.json, statute-faq.json) */
export function getStatuteData(locale: Locale) {
  return { statute: STATUTE[locale], faq: FAQ[locale] };
}
