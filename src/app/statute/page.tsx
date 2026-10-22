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
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { StatuteCard } from "@/components/statute/statute-card";
import { Button } from "@/components/ui/button";
import statuteData from "@/json/statute.json";
import statuteFaq from "@/json/statute-faq.json";

const categoryIcons: Record<string, React.ReactNode> = {
  "정부,지방청사": <Building2 size={20} />,
  "학교,유치원": <GraduationCap size={20} />,
  의료기관: <Stethoscope size={20} />,
  청소년시설: <Users size={20} />,
  노인시설: <Heart size={20} />,
  도서관: <BookOpen size={20} />,
  "어린이 시설": <Baby size={20} />,
  학원: <BookMarked size={20} />,
  "교통관련 시설": <Bus size={20} />,
  대형건물: <Building2 size={20} />,
  공장: <Factory size={20} />,
  "대규모 점포": <Store size={20} />,
  관광숙박업소: <Hotel size={20} />,
  체육시설: <Dumbbell size={20} />,
  "사회복지 시설": <Heart size={20} />,
  목욕장: <Bath size={20} />,
  "게임 PC방": <Gamepad2 size={20} />,
  음식점: <UtensilsCrossed size={20} />,
  만화방: <BookMarked size={20} />,
};

export default function StatutePage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <PageHeader
        title="금연구역 관련 법령"
        description="국민건강증진법 시행규칙"
        icon={<Scale />}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 p-4 pb-8 text-base leading-relaxed">
        <PageSection className="border-primary/20 bg-primary/5">
          <p className="text-muted-foreground">
            아래는 <strong className="text-foreground">국민건강증진법</strong>에
            따른 금연구역 지정 시설 및 관련 규정입니다. 각 시설 유형별로
            금연구역 지정 범위와 흡연실 설치 가능 여부를 확인할 수 있습니다.
          </p>
        </PageSection>

        {/* 법률 목록 */}
        <div className="space-y-3">
          {statuteData.map((statute, index) => (
            <StatuteCard
              key={statute.category}
              category={statute.category}
              designatedNoSmokingAreas={statute.designated_no_smoking_areas}
              content={statute.content}
              icon={categoryIcons[statute.category]}
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
              법령 기준일:{" "}
              <span className="tabular-nums">{statuteFaq.lawBaseDate}</span> ·
              최종 검토일:{" "}
              <span className="tabular-nums">{statuteFaq.reviewedAt}</span>
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
            본 내용은 참고용이며, 정확한 법령 내용은 관련 법령을 확인해주세요.
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
                  <h2 className="font-semibold">국민건강증진법</h2>
                  <p className="text-sm text-muted-foreground">
                    법제처 국가법령정보센터
                  </p>
                </div>
              </div>
              <Button variant="outline" size="touch" asChild>
                <a
                  href="https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B5%AD%EB%AF%BC%EA%B1%B4%EA%B0%95%EC%A6%9D%EC%A7%84%EB%B2%95"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  법령 보기
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
