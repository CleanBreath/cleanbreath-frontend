import { BookOpen, ExternalLink, MapPin, Scale } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { serializeJsonLd } from "@/lib/seo/jsonld";
import { getStatuteData } from "@/lib/statute-data";

const LAW_URL =
  "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B5%AD%EB%AF%BC%EA%B1%B4%EA%B0%95%EC%A6%9D%EC%A7%84%EB%B2%95";

interface Source {
  label: string;
  url: string;
}

interface GuideLayoutProps {
  title: string;
  subtitle: string;
  /** 제목 바로 아래에 두는 1~2문장 직접 답변 */
  answer: string;
  jsonLd: unknown;
  /** 다른 안내 페이지 링크 (한국어 기준 경로) */
  related: { href: string; label: string }[];
  children: React.ReactNode;
}

/**
 * 법령 안내 페이지 공통 틀: h1 → 직접 답변·기준일 → 질문별 h2/h3 → 지도 CTA → 관련 안내.
 * 본문 법령 문구는 src/json/<locale>/statute-faq.json에서만 가져온다
 */
export function GuideLayout({
  title,
  subtitle,
  answer,
  jsonLd,
  related,
  children,
}: GuideLayoutProps) {
  const locale = useLocale();
  const t = useTranslations("guide.common");
  const ts = useTranslations("statute");
  const tc = useTranslations("common");
  const { faq } = getStatuteData(locale);

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 메시지·법령 JSON 문구로 만든 jsonLd 객체를 직렬화한 값이라 사용자 입력 없음
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <PageHeader
        title={title}
        description={subtitle}
        icon={<BookOpen />}
        backLabel={tc("goHome")}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base leading-relaxed text-muted-foreground">
        <PageSection className="border-primary/20 bg-primary/5">
          <p className="font-medium text-foreground">{answer}</p>
          <p className="mt-3 text-sm tabular-nums">
            {t.rich("dates", {
              lawBaseDate: faq.lawBaseDate,
              reviewedAt: faq.reviewedAt,
              lawBase: (chunks) => (
                <time dateTime={faq.lawBaseDate}>{chunks}</time>
              ),
              reviewed: (chunks) => (
                <time dateTime={faq.reviewedAt}>{chunks}</time>
              ),
            })}
          </p>
          <p className="text-sm">{faq.lawBaseNote}</p>
          {/* 번역본(en/ja) 고지: 법령 원문은 한국어본이 우선 */}
          {locale !== "ko" && (
            <p className="mt-2 text-sm">{ts("translationNotice")}</p>
          )}
        </PageSection>

        {children}

        <PageSection
          title={t("mapCta.title")}
          icon={<MapPin />}
          className="border-primary/20 bg-primary/5"
        >
          <p className="mb-3">{t("mapCta.body")}</p>
          <Button size="touch" asChild>
            <Link href="/">
              <MapPin aria-hidden />
              {t("mapCta.button")}
            </Link>
          </Button>
        </PageSection>

        <PageSection title={t("related")} icon={<Scale />}>
          <ul className="space-y-1">
            {related.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-primary underline underline-offset-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/statute"
                className="inline-flex min-h-11 items-center text-primary underline underline-offset-2"
              >
                {t("statuteLink")}
              </Link>
            </li>
            <li>
              <a
                href={LAW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 text-primary underline underline-offset-2"
              >
                {ts("law.name")} ({ts("law.source")}) · {ts("law.view")}
                <ExternalLink size={14} aria-hidden />
              </a>
            </li>
          </ul>
        </PageSection>

        <p className="rounded-xl bg-muted px-4 py-3 text-center text-sm">
          {ts("disclaimer")}
        </p>
      </main>
    </div>
  );
}

/** 질문 하나(h2)와 답변 문단, 하위 질문(h3), 근거 법령 링크 */
export function GuideQuestion({
  question,
  paragraphs,
  sources,
  children,
}: {
  question: string;
  paragraphs: string[];
  sources?: Source[];
  children?: React.ReactNode;
}) {
  const t = useTranslations("guide.common");
  return (
    <PageSection title={question}>
      <div className="space-y-2">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {children}
      {sources && sources.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-foreground">
            {t("sources")}
          </p>
          <ul className="flex flex-wrap gap-x-4">
            {sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 text-sm text-primary underline underline-offset-2"
                >
                  {source.label}
                  <ExternalLink size={14} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageSection>
  );
}

/** GuideQuestion 안의 하위 질문(h3)과 답변 */
export function GuideSubQuestion({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4">
      <h3 className="mb-1 font-semibold text-foreground">{question}</h3>
      <p>{children}</p>
    </section>
  );
}
