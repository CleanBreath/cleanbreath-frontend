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
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { StatuteAccordion } from "@/components/statute/statute-accordion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
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

// 서버 컴포넌트: 시설명(h3)·FAQ 질문(h3)이 서버 HTML에 제목으로 들어간다. 펼침 상태만 StatuteAccordion(클라이언트)
export default function StatutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 정적 렌더링 유지 (locale 값은 [locale]/layout에서 검증됨)
  const locale = use(params).locale as Locale;
  setRequestLocale(locale);
  const t = useTranslations("statute");
  const tg = useTranslations("guide");
  const { statute: statuteData, faq: statuteFaq } = getStatuteData(locale);

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        icon={<Scale />}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 p-4 pb-8 text-base leading-relaxed [&:lang(en)_p]:max-w-lg [&:lang(en)_li]:max-w-lg">
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

        {/* 시설별 금연구역 */}
        <section aria-labelledby="statute-facilities" className="space-y-3">
          <h2
            id="statute-facilities"
            className="px-1 text-lg font-semibold text-foreground"
          >
            {t("sections.facilities")}
          </h2>
          <StatuteAccordion items={statuteData} icons={categoryIcons} />
        </section>

        {/* 자주 묻는 질문 */}
        <section aria-labelledby="statute-faq" className="space-y-3">
          <h2
            id="statute-faq"
            className="px-1 text-lg font-semibold text-foreground"
          >
            {t("sections.faq")}
          </h2>
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
            <PageSection
              key={item.question}
              title={item.question}
              headingLevel="h3"
            >
              <div className="space-y-2 text-muted-foreground">
                {item.answer.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
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

        {/* 법령 FAQ를 주제별로 풀어 쓴 안내 페이지 */}
        <PageSection title={t("sections.guides")}>
          <ul className="space-y-1">
            <li>
              <Link
                href="/guide/fine"
                className="inline-flex min-h-11 items-center text-primary underline underline-offset-2"
              >
                {tg("fine.title")}
              </Link>
            </li>
            <li>
              <Link
                href="/guide/apartment"
                className="inline-flex min-h-11 items-center text-primary underline underline-offset-2"
              >
                {tg("apartment.title")}
              </Link>
            </li>
          </ul>
        </PageSection>

        {/* 하단 안내 */}
        <div className="space-y-3">
          {/* 면은 아래 카드와 같은 폭으로 두고, 영어 행 길이 제한(max-w-lg)은 안쪽 문단에만 걸린다 */}
          <div className="rounded-xl bg-muted px-4 py-3 text-center text-sm text-muted-foreground">
            <p className="mx-auto">{t("disclaimer")}</p>
          </div>

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
                  <h2 className="text-lg font-semibold text-foreground">
                    {t("law.name")}
                  </h2>
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
