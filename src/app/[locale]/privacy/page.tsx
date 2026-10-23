import {
  Clock,
  Cookie,
  Database,
  ExternalLink,
  FileText,
  Globe,
  Lock,
  Scale,
  Share2,
  ShieldCheck,
  Target,
  Trash2,
  UserCheck,
  UserCog,
} from "lucide-react";
import type { Metadata } from "next";
import { useFormatter, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { localeMetadata, localizedPath } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const SITE_URL = "https://cleanbreath.cmu02-studio.com";
const EFFECTIVE_DATE = "2026-10-22";
const ISSUES_URL = "https://github.com/CleanBreath/cleanbreath-frontend/issues";
const IN_LANGUAGE: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

// 번역되지 않는 표 값. 번역 문구는 messages/<locale>/privacy.json의 같은 순서 rows와 짝을 이룬다
const PROCESSOR_NAMES = [
  "Vercel Inc.",
  "Cloudflare, Inc.",
  "Amazon Web Services",
];

const TRANSFERS = [
  {
    name: "Vercel Inc.",
    policyUrl: "https://vercel.com/legal/privacy-policy",
  },
  {
    name: "Cloudflare, Inc.",
    policyUrl: "https://www.cloudflare.com/privacypolicy/",
  },
];

const DEVICE_STORAGE = [
  { where: "localStorage", name: "cleanbreath_client_token" },
  { where: "localStorage", name: "cleanbreath-disclaimer-accepted" },
  { where: "IndexedDB", name: "cleanbreath-cache" },
];

const REMEDY_LINKS = [
  { url: "https://www.kopico.go.kr", label: "www.kopico.go.kr" },
  { url: "https://privacy.kisa.or.kr", label: "privacy.kisa.or.kr" },
  { url: "https://www.spo.go.kr", label: "www.spo.go.kr" },
  { url: "https://ecrm.police.go.kr", label: "ecrm.police.go.kr" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const m = localeMetadata(locale, "/privacy");
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

const thClass =
  "border-b px-3 py-2 text-left text-sm font-semibold text-foreground";
const tdClass = "border-b px-3 py-2 align-top";

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

function ExternalTextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-primary underline ${className}`}
    >
      {children}
      <ExternalLink aria-hidden className="size-3.5" />
    </a>
  );
}

function issuesLink(chunks: React.ReactNode) {
  return <ExternalTextLink href={ISSUES_URL}>{chunks}</ExternalTextLink>;
}

export default function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 정적 렌더링 유지 (locale 값은 [locale]/layout에서 검증됨)
  const locale = use(params).locale as Locale;
  setRequestLocale(locale);
  const t = useTranslations("privacy");
  const tc = useTranslations("common");
  const ta = useTranslations("about");
  const format = useFormatter();
  const pageTitle = t("meta.title");
  const pageUrl = `${SITE_URL}${localizedPath(locale, "/privacy")}`;
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  const boardLink = (chunks: React.ReactNode) => (
    <Link href="/board" className="text-primary underline">
      {chunks}
    </Link>
  );

  const collectedRows = t.raw("items.rows") as {
    kind: string;
    item: string;
    method: string;
  }[];
  const retentionRows = t.raw("retention.rows") as {
    item: string;
    period: string;
  }[];
  const processorRows = t.raw("outsourcing.processing.rows") as {
    task: string;
    location: string;
  }[];
  const transferRows = t.raw("outsourcing.transfer.rows") as {
    items: string;
    purpose: string;
  }[];
  const storagePurposes = t.raw("storage.rows") as string[];
  const remedyRows = t.raw("remedies.rows") as {
    name: string;
    phone: string;
  }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        description: t("meta.description"),
        inLanguage: IN_LANGUAGE[locale],
        dateModified: EFFECTIVE_DATE,
        isPartOf: { "@id": `${SITE_URL}${localizedPath(locale, "/")}#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: tc("home"),
            item: `${SITE_URL}${localizedPath(locale, "/")}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: pageTitle,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 정적 jsonLd 객체를 JSON.stringify한 값이라 사용자 입력 없음
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <PageHeader
        title={pageTitle}
        description="CleanBreath"
        icon={<ShieldCheck />}
        backLabel={tc("goHome")}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base leading-relaxed text-muted-foreground">
        {/* 영어·일본어본은 참고용 번역이며 한국어본이 우선한다는 고지 */}
        {locale !== "ko" && (
          <PageSection className="border-primary/20 bg-primary/5">
            <p className="text-sm text-foreground">{t("translationNotice")}</p>
          </PageSection>
        )}

        <PageSection className="border-primary/20 bg-primary/5">
          <p className="mb-3">{t("intro.scope")}</p>
          <p>{t.rich("intro.noAccount", { strong })}</p>
        </PageSection>

        <PageSection title={t("purpose.title")} icon={<Target />}>
          <p className="mb-3">{t("purpose.lead")}</p>
          <ul className="space-y-1.5">
            {(t.raw("purpose.items") as string[]).map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
        </PageSection>

        <PageSection title={t("items.title")} icon={<Database />}>
          <section
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 가로 스크롤 표 키보드 접근 (axe scrollable-region-focusable)
            tabIndex={0}
            aria-label={t("items.tableLabel")}
            className="-mx-4 mb-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <table className="w-full min-w-[36rem] border-collapse text-base">
              <caption className="sr-only">{t("items.tableLabel")}</caption>
              <thead>
                <tr className="bg-muted/60">
                  <th scope="col" className={thClass}>
                    {t("items.columns.kind")}
                  </th>
                  <th scope="col" className={thClass}>
                    {t("items.columns.item")}
                  </th>
                  <th scope="col" className={thClass}>
                    {t("items.columns.method")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {collectedRows.map((row) => (
                  <tr key={row.item}>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {row.kind}
                    </td>
                    <td className={tdClass}>{row.item}</td>
                    <td className={tdClass}>{row.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <ul className="space-y-1.5">
            <Bullet>{t("items.noLocation")}</Bullet>
            <Bullet>{t("items.noSensitive")}</Bullet>
            <Bullet>{t.rich("items.public", { board: boardLink })}</Bullet>
            <Bullet>{t("items.noPersonalInput")}</Bullet>
          </ul>
        </PageSection>

        <PageSection title={t("retention.title")} icon={<Clock />}>
          <section
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 가로 스크롤 표 키보드 접근 (axe scrollable-region-focusable)
            tabIndex={0}
            aria-label={t("retention.tableLabel")}
            className="-mx-4 mb-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <table className="w-full min-w-[32rem] border-collapse text-base">
              <caption className="sr-only">{t("retention.tableLabel")}</caption>
              <thead>
                <tr className="bg-muted/60">
                  <th scope="col" className={thClass}>
                    {t("retention.columns.item")}
                  </th>
                  <th scope="col" className={thClass}>
                    {t("retention.columns.period")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {retentionRows.map((row) => (
                  <tr key={row.item}>
                    <td className={tdClass}>{row.item}</td>
                    <td className={tdClass}>{row.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <p>{t("retention.note")}</p>
        </PageSection>

        <PageSection title={t("destruction.title")} icon={<Trash2 />}>
          <ul className="space-y-1.5">
            {(t.raw("destruction.items") as string[]).map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
        </PageSection>

        <PageSection title={t("thirdParty.title")} icon={<Share2 />}>
          <p>{t("thirdParty.body")}</p>
        </PageSection>

        <PageSection title={t("outsourcing.title")} icon={<Globe />}>
          <h3 className="mb-2 font-semibold text-foreground">
            {t("outsourcing.processing.heading")}
          </h3>
          <p className="mb-3">{t("outsourcing.processing.lead")}</p>
          <section
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 가로 스크롤 표 키보드 접근 (axe scrollable-region-focusable)
            tabIndex={0}
            aria-label={t("outsourcing.processing.tableLabel")}
            className="-mx-4 mb-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <table className="w-full min-w-[32rem] border-collapse text-base">
              <caption className="sr-only">
                {t("outsourcing.processing.tableLabel")}
              </caption>
              <thead>
                <tr className="bg-muted/60">
                  <th scope="col" className={thClass}>
                    {t("outsourcing.processing.columns.name")}
                  </th>
                  <th scope="col" className={thClass}>
                    {t("outsourcing.processing.columns.task")}
                  </th>
                  <th scope="col" className={thClass}>
                    {t("outsourcing.processing.columns.location")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {PROCESSOR_NAMES.map((name, i) => (
                  <tr key={name}>
                    <td className={`${tdClass} whitespace-nowrap`}>{name}</td>
                    <td className={tdClass}>{processorRows[i]?.task}</td>
                    <td className={tdClass}>{processorRows[i]?.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <h3 className="mb-2 font-semibold text-foreground">
            {t("outsourcing.map.heading")}
          </h3>
          <p className="mb-4">{t("outsourcing.map.body")}</p>

          <h3 className="mb-2 font-semibold text-foreground">
            {t("outsourcing.transfer.heading")}
          </h3>
          <p className="mb-3">{t("outsourcing.transfer.lead")}</p>
          <section
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 가로 스크롤 표 키보드 접근 (axe scrollable-region-focusable)
            tabIndex={0}
            aria-label={t("outsourcing.transfer.tableLabel")}
            className="-mx-4 mb-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <table className="w-full min-w-[42rem] border-collapse text-base">
              <caption className="sr-only">
                {t("outsourcing.transfer.tableLabel")}
              </caption>
              <thead>
                <tr className="bg-muted/60">
                  <th scope="col" className={thClass}>
                    {t("outsourcing.transfer.columns.recipient")}
                  </th>
                  <th scope="col" className={`${thClass} whitespace-nowrap`}>
                    {t("outsourcing.transfer.columns.country")}
                  </th>
                  <th scope="col" className={thClass}>
                    {t("outsourcing.transfer.columns.items")}
                  </th>
                  <th scope="col" className={thClass}>
                    {t("outsourcing.transfer.columns.timing")}
                  </th>
                  <th scope="col" className={thClass}>
                    {t("outsourcing.transfer.columns.purpose")}
                  </th>
                  <th scope="col" className={thClass}>
                    {t("outsourcing.transfer.columns.retention")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {TRANSFERS.map((row, i) => (
                  <tr key={row.name}>
                    <td className={tdClass}>
                      <span className="block whitespace-nowrap">
                        {row.name}
                      </span>
                      <ExternalTextLink
                        href={row.policyUrl}
                        className="min-h-11"
                      >
                        {t("outsourcing.transfer.policyLink")}
                      </ExternalTextLink>
                    </td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {t("outsourcing.transfer.country")}
                    </td>
                    <td className={tdClass}>{transferRows[i]?.items}</td>
                    <td className={tdClass}>
                      {t("outsourcing.transfer.timing")}
                    </td>
                    <td className={tdClass}>{transferRows[i]?.purpose}</td>
                    <td className={tdClass}>
                      {t("outsourcing.transfer.retention")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <p>{t("outsourcing.transfer.refuse")}</p>
        </PageSection>

        <PageSection title={t("rights.title")} icon={<UserCheck />}>
          <ul className="mb-3 space-y-1.5">
            <Bullet>{t("rights.request")}</Bullet>
            <Bullet>{t.rich("rights.how", { issues: issuesLink })}</Bullet>
            <Bullet>{t("rights.identify")}</Bullet>
            <Bullet>{t("rights.deleteLocal")}</Bullet>
            <Bullet>{t("rights.duty")}</Bullet>
          </ul>
        </PageSection>

        <PageSection title={t("storage.title")} icon={<Cookie />}>
          <p className="mb-3">{t("storage.lead")}</p>
          <section
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 가로 스크롤 표 키보드 접근 (axe scrollable-region-focusable)
            tabIndex={0}
            aria-label={t("storage.tableLabel")}
            className="-mx-4 mb-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <table className="w-full min-w-[32rem] border-collapse text-base">
              <caption className="sr-only">{t("storage.tableLabel")}</caption>
              <thead>
                <tr className="bg-muted/60">
                  <th scope="col" className={thClass}>
                    {t("storage.columns.where")}
                  </th>
                  <th scope="col" className={thClass}>
                    {t("storage.columns.name")}
                  </th>
                  <th scope="col" className={thClass}>
                    {t("storage.columns.purpose")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {DEVICE_STORAGE.map((row, i) => (
                  <tr key={row.name}>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {row.where}
                    </td>
                    <td className={`${tdClass} break-all font-mono text-sm`}>
                      {row.name}
                    </td>
                    <td className={tdClass}>{storagePurposes[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <ul className="space-y-1.5">
            {(t.raw("storage.items") as string[]).map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
        </PageSection>

        <PageSection title={t("security.title")} icon={<Lock />}>
          <ul className="space-y-1.5">
            {(t.raw("security.items") as string[]).map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
        </PageSection>

        <PageSection title={t("officer.title")} icon={<UserCog />}>
          <p className="mb-3">{t("officer.lead")}</p>
          <ul className="space-y-1.5">
            <Bullet>{t.rich("officer.name", { strong })}</Bullet>
            <Bullet>{t.rich("officer.contact", { issues: issuesLink })}</Bullet>
          </ul>
        </PageSection>

        <PageSection title={t("remedies.title")} icon={<Scale />}>
          <p className="mb-3">{t("remedies.lead")}</p>
          <ul className="space-y-1.5">
            {REMEDY_LINKS.map((link, i) => (
              <Bullet key={link.url}>
                {remedyRows[i]?.name}: {remedyRows[i]?.phone},{" "}
                <ExternalTextLink href={link.url}>
                  {link.label}
                </ExternalTextLink>
              </Bullet>
            ))}
          </ul>
        </PageSection>

        <PageSection title={t("changes.title")} icon={<FileText />}>
          <p className="mb-3">
            {t.rich("changes.effective", {
              date: format.dateTime(new Date(EFFECTIVE_DATE), {
                dateStyle: "long",
              }),
              time: (chunks) => <time dateTime={EFFECTIVE_DATE}>{chunks}</time>,
            })}
          </p>
          <p>
            {t("changes.related")}{" "}
            <Link href="/about" className="text-primary underline">
              {ta("meta.title")}
            </Link>
          </p>
        </PageSection>

        <p className="text-center text-sm tabular-nums">
          {t("effectiveDate")}{" "}
          <time dateTime={EFFECTIVE_DATE}>{EFFECTIVE_DATE}</time>
        </p>
      </main>
    </div>
  );
}
