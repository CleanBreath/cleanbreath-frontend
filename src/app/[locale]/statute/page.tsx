"use client";

import {
  Baby,
  Bath,
  BookMarked,
  BookOpen,
  Building2,
  Bus,
  Dumbbell,
  ExternalLink,
  Factory,
  Gamepad2,
  GraduationCap,
  Heart,
  Hotel,
  Scale,
  Stethoscope,
  Store,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { StatuteCard } from "@/components/statute/statute-card";
import { Button } from "@/components/ui/button";
import { getStatuteData } from "@/lib/statute-data";

// 언어별 statute.json의 항목 순서가 같으므로 category 문자열 대신 순서로 아이콘을 고른다
const categoryIcons: React.ReactNode[] = [
  <Building2 key="government" size={20} />, // 정부,지방청사
  <GraduationCap key="school" size={20} />, // 학교,유치원
  <Stethoscope key="medical" size={20} />, // 의료기관
  <Users key="youth" size={20} />, // 청소년시설
  <Heart key="senior" size={20} />, // 노인시설
  <BookOpen key="library" size={20} />, // 도서관
  <Baby key="children" size={20} />, // 어린이 시설
  <BookMarked key="academy" size={20} />, // 학원
  <Bus key="transport" size={20} />, // 교통관련 시설
  <Building2 key="large-building" size={20} />, // 대형건물
  <Factory key="factory" size={20} />, // 공장
  <Store key="store" size={20} />, // 대규모 점포
  <Hotel key="hotel" size={20} />, // 관광숙박업소
  <Dumbbell key="sports" size={20} />, // 체육시설
  <Heart key="welfare" size={20} />, // 사회복지 시설
  <Bath key="bath" size={20} />, // 목욕장
  <Gamepad2 key="game" size={20} />, // 게임 PC방
  <UtensilsCrossed key="restaurant" size={20} />, // 음식점
  <BookMarked key="comic" size={20} />, // 만화방
];

export default function StatutePage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const t = useTranslations("statute");
  const locale = useLocale();
  const { statute: statuteData, faq: statuteFaq } = getStatuteData(locale);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        icon={<Scale />}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 p-4 pb-8 text-base leading-relaxed">
        <PageSection className="border-primary/20 bg-primary/5">
          <p className="text-muted-foreground">
            {t.rich("intro", {
              strong: (chunks) => (
                <strong className="text-foreground">{chunks}</strong>
              ),
            })}
          </p>
          {/* 번역본(en/ja) 고지: 법령 원문은 한국어본이 우선 */}
          {locale !== "ko" && (
            <p className="mt-2 text-sm text-muted-foreground">
              {t("translationNotice")}
            </p>
          )}
        </PageSection>

        {/* 법률 목록 */}
        <div className="space-y-3">
          {statuteData.map((statute, index) => (
            <StatuteCard
              key={statute.category}
              category={statute.category}
              designatedNoSmokingAreas={statute.designated_no_smoking_areas}
              content={statute.content}
              icon={categoryIcons[index]}
              isExpanded={expandedIndex === index}
              onToggle={() => toggleExpand(index)}
              index={index}
            />
          ))}
        </div>

        {/* 자주 묻는 질문 */}
        <section className="space-y-3">
          <div className="px-1 text-sm text-muted-foreground">
            <p>
              {t.rich("lawDates", {
                lawBaseDate: statuteFaq.lawBaseDate,
                reviewedAt: statuteFaq.reviewedAt,
                num: (chunks) => <span className="tabular-nums">{chunks}</span>,
              })}
            </p>
            <p>{statuteFaq.lawBaseNote}</p>
          </div>
          {statuteFaq.items.map((item) => (
            <PageSection key={item.question} title={item.question}>
              <p className="text-muted-foreground">{item.answer.join(" ")}</p>
              <div className="mt-2 flex flex-wrap gap-x-4">
                {item.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 text-sm text-primary underline underline-offset-2"
                  >
                    {source.label}
                    <ExternalLink size={14} aria-hidden />
                  </a>
                ))}
              </div>
            </PageSection>
          ))}
        </section>

        {/* 하단 안내 */}
        <div className="space-y-3">
          <p className="rounded-xl bg-muted px-4 py-3 text-center text-sm text-muted-foreground">
            {t("disclaimer")}
          </p>

          <PageSection className="border-primary/20 bg-primary/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  aria-hidden
                  className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                >
                  <Scale size={20} />
                </div>
                <div>
                  <h2 className="font-semibold">{t("law.name")}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t("law.source")}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="touch" asChild>
                <a
                  href="https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B5%AD%EB%AF%BC%EA%B1%B4%EA%B0%95%EC%A6%9D%EC%A7%84%EB%B2%95"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("law.view")}
                  <ExternalLink aria-hidden />
                </a>
              </Button>
            </div>
          </PageSection>
        </div>
      </main>
    </div>
  );
}
