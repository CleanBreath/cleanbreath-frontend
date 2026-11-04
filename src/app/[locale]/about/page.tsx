import {
  AlertTriangle,
  Database,
  ExternalLink,
  FileText,
  Info,
  MapPin,
  MessageSquare,
  Scale,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { localeMetadata, localizedPath } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  breadcrumbJsonLd,
  IN_LANGUAGE,
  ISSUES_URL,
  ORGANIZATION_ID,
  organizationJsonLd,
  SITE_URL,
  serializeJsonLd,
} from "@/lib/seo/jsonld";

// 페이지 문구를 바꾸면 이 날짜와 sitemap.ts의 날짜를 함께 갱신
const LAST_UPDATED = "2026-11-04";
const GITHUB_URL = "https://github.com/CleanBreath/cleanbreath-frontend";
const LAW_URL =
  "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B5%AD%EB%AF%BC%EA%B1%B4%EA%B0%95%EC%A6%9D%EC%A7%84%EB%B2%95";

// 버전 정보 모달(version-modal.tsx)에 기록된 개발 참여자 (실명이라 언어와 관계없이 한글 그대로)
const DEVELOPERS = ["최현준", "문찬수", "김건우", "유현목", "최시헌", "김장환"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const m = localeMetadata(locale, "/about");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: m.alternates,
    openGraph: {
      ...m.openGraph,
      title: t("meta.title"),
      description: t("meta.description"),
      type: "website",
      siteName: "CleanBreath",
      images: [
        {
          url: `${SITE_URL}/OGImage.png`,
          width: 1200,
          height: 630,
          alt: tm("ogImageAlt"),
        },
      ],
    },
  };
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary"
      />
      <span>{children}</span>
    </li>
  );
}

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 정적 렌더링 유지 (locale 값은 [locale]/layout에서 검증됨)
  const locale = use(params).locale as Locale;
  setRequestLocale(locale);
  const t = useTranslations("about");
  const tc = useTranslations("common");
  const tm = useTranslations("meta");
  const pageTitle = t("meta.title");
  const pageUrl = `${SITE_URL}${localizedPath(locale, "/about")}`;
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  // 한 문장(텍스트 노드 하나)으로 렌더링해 크롤러가 날짜를 라벨과 함께 읽게 한다
  const lastUpdated = t.rich("lastUpdated", {
    date: LAST_UPDATED,
    time: (chunks) => <time dateTime={LAST_UPDATED}>{chunks}</time>,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(tm("organizationDescription")),
      {
        "@type": "AboutPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        description: t("meta.description"),
        inLanguage: IN_LANGUAGE[locale],
        dateModified: LAST_UPDATED,
        isPartOf: { "@id": `${SITE_URL}${localizedPath(locale, "/")}#website` },
        about: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      breadcrumbJsonLd(`${pageUrl}#breadcrumb`, [
        { name: tc("home"), url: `${SITE_URL}${localizedPath(locale, "/")}` },
        { name: t("meta.breadcrumb"), url: pageUrl },
      ]),
    ],
  };

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 정적 jsonLd 객체를 JSON.stringify한 값이라 사용자 입력 없음
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />

      <PageHeader
        title={pageTitle}
        description="CleanBreath"
        icon={<Info />}
        backLabel={tc("goHome")}
      />

      {/* 메인 컨텐츠 */}
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base leading-relaxed text-muted-foreground">
        <p className="px-1 text-sm tabular-nums">{lastUpdated}</p>

        <PageSection
          title={t("intro.title")}
          icon={<MapPin />}
          className="border-primary/20 bg-primary/5"
        >
          <p className="mb-3">{t.rich("intro.lead", { strong })}</p>
          <ul className="space-y-1.5">
            {(t.raw("intro.items") as string[]).map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
        </PageSection>

        <PageSection title={t("operator.title")} icon={<Users />}>
          <p className="mb-3">{t.rich("operator.lead", { strong })}</p>
          <p className="mb-2 text-sm font-semibold text-foreground">
            {t("operator.developers")}
          </p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {DEVELOPERS.map((name) => (
              <Badge key={name} variant="secondary" lang="ko">
                {name}
              </Badge>
            ))}
          </div>
          <Button variant="outline" asChild>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              {t("operator.github")}
              <ExternalLink aria-hidden />
            </a>
          </Button>
        </PageSection>

        <PageSection
          id="data-sources"
          title={t("dataSources.title")}
          icon={<FileText />}
          className="scroll-mt-20"
        >
          <p className="mb-3">{t("dataSources.lead")}</p>
          <h3 className="mb-1 font-semibold text-foreground">
            {t("dataSources.publicTitle")}
          </h3>
          <ul className="mb-3 space-y-1.5">
            <Bullet>{t.rich("dataSources.public", { strong })}</Bullet>
            <Bullet>{t("dataSources.publicDate")}</Bullet>
          </ul>
          <h3 className="mb-1 font-semibold text-foreground">
            {t("dataSources.anyangTitle")}
          </h3>
          <ul className="mb-3 space-y-1.5">
            <Bullet>{t("dataSources.anyang")}</Bullet>
          </ul>
          <h3 className="mb-1 font-semibold text-foreground">
            {t("dataSources.refreshTitle")}
          </h3>
          <ul className="space-y-1.5">
            <Bullet>{t("dataSources.refreshPublic")}</Bullet>
            <Bullet>{t("dataSources.refreshAnyang")}</Bullet>
          </ul>
        </PageSection>

        <PageSection title={t("data.title")} icon={<Database />}>
          <ul className="space-y-1.5">
            <Bullet>{t("data.source")}</Bullet>
            <Bullet>
              {t.rich("data.proposal", {
                register: (chunks) => (
                  <Link href="/register" className="text-primary underline">
                    {chunks}
                  </Link>
                ),
                board: (chunks) => (
                  <Link href="/board" className="text-primary underline">
                    {chunks}
                  </Link>
                ),
              })}
            </Bullet>
            <Bullet>{t("data.autoApply")}</Bullet>
            <Bullet>{t("data.voting")}</Bullet>
          </ul>
        </PageSection>

        <PageSection
          id="contact"
          title={t("contact.title")}
          icon={<MessageSquare />}
          className="scroll-mt-20"
        >
          <p className="mb-3">{t("contact.body")}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/">{t("contact.feedback")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
                GitHub Issues
                <ExternalLink aria-hidden />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/privacy">{t("contact.privacy")}</Link>
            </Button>
          </div>
        </PageSection>

        <PageSection
          title={t("disclaimer.title")}
          icon={<AlertTriangle />}
          className="bg-muted/60"
        >
          <p className="mb-3">{t.rich("disclaimer.lead", { strong })}</p>
          <ul className="space-y-1.5">
            {(t.raw("disclaimer.items") as string[]).map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
        </PageSection>

        <PageSection
          title={t("law.title")}
          icon={<Scale />}
          className="border-primary/20 bg-primary/5"
        >
          <p className="mb-3">{t("law.body")}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/statute">{t("law.statute")}</Link>
            </Button>
            {/* 번역 라벨이 길어 모바일에서 줄바꿈 허용 (가로 스크롤 방지) */}
            <Button
              variant="outline"
              asChild
              className="h-auto min-h-9 whitespace-normal text-left"
            >
              <a href={LAW_URL} target="_blank" rel="noopener noreferrer">
                {t("law.external")}
                <ExternalLink aria-hidden />
              </a>
            </Button>
          </div>
        </PageSection>

        <p className="text-center text-sm tabular-nums">{lastUpdated}</p>
      </main>
    </div>
  );
}
