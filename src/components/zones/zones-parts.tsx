import { AlertTriangle, ChevronRight, Map as MapIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { parseServerTime } from "@/lib/seo/zones-data";
import type { PublicZoneItem } from "@/types";

// 지역별 금연구역 페이지(/zones/*) 공통 조각. 모두 서버 컴포넌트

export interface Crumb {
  name: string;
  /** 한국어 기준 경로. 없으면 현재 페이지 */
  href?: string;
}

export function ZonesBreadcrumbs({ items }: { items: Crumb[] }) {
  const t = useTranslations("zones");
  return (
    <nav aria-label={t("breadcrumbLabel")} className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-1">
            {i > 0 && <ChevronRight aria-hidden className="size-3.5" />}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-foreground hover:underline"
              >
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-foreground">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ZonesUnavailable() {
  const t = useTranslations("zones.unavailable");
  return (
    <PageSection
      title={t("title")}
      icon={<AlertTriangle />}
      className="border-amber-300 bg-amber-50"
    >
      <p>{t("body")}</p>
    </PageSection>
  );
}

/** 출처·기준일·조회 시각 줄 */
export function ZonesSource({
  source,
  referenceDate,
  updateAt,
  notes = [],
}: {
  source: "public" | "anyang";
  /** 공공데이터 행의 referenceDate 중 가장 최근 값 (YYYY-MM-DD) */
  referenceDate?: string | null;
  /** 백엔드 응답의 updateAt (응답을 만든 서버 시각) */
  updateAt?: string | null;
  notes?: string[];
}) {
  const t = useTranslations("zones.source");
  const format = useFormatter();
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;
  const reference = referenceDate
    ? new Date(`${referenceDate}T00:00:00+09:00`)
    : null;
  const fetched = parseServerTime(updateAt ?? null);

  return (
    <PageSection className="bg-muted/60">
      <dl className="space-y-1 text-sm">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-semibold text-foreground">{t("label")}</dt>
          <dd>{t(source)}</dd>
        </div>
        {reference && !Number.isNaN(reference.getTime()) && (
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-semibold text-foreground">
              {t("referenceDate")}
            </dt>
            <dd>
              <time dateTime={referenceDate ?? undefined}>
                {format.dateTime(reference, dateOptions)}
              </time>
            </dd>
          </div>
        )}
        {fetched && (
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-semibold text-foreground">{t("fetchedAt")}</dt>
            <dd>
              <time dateTime={fetched.toISOString()}>
                {format.dateTime(fetched, dateOptions)}
              </time>
            </dd>
          </div>
        )}
      </dl>
      {notes.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-sm">{t("disclaimer")}</p>
    </PageSection>
  );
}

export function MapHomeLink() {
  const t = useTranslations("zones");
  return (
    <Button variant="outline" asChild>
      <Link href="/">
        <MapIcon aria-hidden />
        {t("mapHome")}
      </Link>
    </Button>
  );
}

// 셀 스타일은 표에 한 번만 건다. 구 페이지는 행이 1000개를 넘어 셀마다 클래스를 붙이면 HTML·RSC 페이로드가 크게 늘어난다
const TABLE_CLASS = [
  "w-full min-w-[36rem] border-collapse text-left text-sm",
  "[&_thead_th]:border-b [&_thead_th]:bg-muted/60 [&_thead_th]:px-2 [&_thead_th]:py-2 [&_thead_th]:font-semibold [&_thead_th]:text-foreground",
  "[&_tbody_th]:border-b [&_tbody_th]:px-2 [&_tbody_th]:py-2 [&_tbody_th]:text-left [&_tbody_th]:align-top [&_tbody_th]:font-medium [&_tbody_th]:text-foreground",
  "[&_td]:border-b [&_td]:px-2 [&_td]:py-2 [&_td]:align-top",
].join(" ");

/** 가로 스크롤되는 표 (모바일에서 페이지 전체가 가로로 밀리지 않게). 행 제목은 tbody의 th(scope="row") */
export function TableScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className={TABLE_CLASS}>{children}</table>
    </div>
  );
}

/** 공공데이터 금연구역 표. 이름·주소 등 데이터 값은 원문(한국어) 그대로 */
export function PublicZoneTable({ rows }: { rows: PublicZoneItem[] }) {
  const t = useTranslations("zones.table");
  return (
    <TableScroll>
      <thead>
        <tr>
          <th scope="col">{t("name")}</th>
          <th scope="col">{t("division")}</th>
          <th scope="col">{t("scope")}</th>
          <th scope="col">{t("roadAddress")}</th>
        </tr>
      </thead>
      <tbody lang="ko">
        {rows.map((r) => (
          <tr key={r.id}>
            <th scope="row">{r.name}</th>
            <td>{r.division ?? t("empty")}</td>
            <td>{r.scope ?? t("empty")}</td>
            <td>{r.roadAddress ?? t("empty")}</td>
          </tr>
        ))}
      </tbody>
    </TableScroll>
  );
}

/** application/ld+json 스크립트 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: 서버에서 만든 jsonLd 객체를 JSON.stringify하고 <를 이스케이프한 값
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
