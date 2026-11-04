import { MapPinned, Table2 } from "lucide-react";
import type { Metadata } from "next";
import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import {
  JsonLd,
  MapHomeLink,
  TableScroll,
  ZonesBreadcrumbs,
  ZonesSource,
  ZonesUnavailable,
} from "@/components/zones/zones-parts";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { SEOUL_DISTRICTS } from "@/lib/seo/seoul-districts";
import { getSeoulSummary, PUBLIC_ZONE_TYPES } from "@/lib/seo/zones-data";
import {
  DISTRICTS_WITH_PAGE,
  districtName,
  ZONES_PATHS,
  zonesJsonLd,
  zonesMetadata,
} from "@/lib/seo/zones-seo";

// 페이지는 1시간마다 다시 그리고 API 응답은 1일 캐시한다 (zones-data.ts). 재생성 중 API가 꺼져 있으면 이전 페이지 유지
export const revalidate = 3600;

const PATH = ZONES_PATHS.seoul;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "zones.seoul" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  return zonesMetadata({
    locale,
    path: PATH,
    title: t("title"),
    description: t("description"),
    ogImageAlt: tm("ogImageAlt"),
  });
}

export default async function SeoulZonesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("zones");
  const tc = await getTranslations("common");
  const tmap = await getTranslations("map");
  const format = await getFormatter();
  const summary = await getSeoulSummary();

  const title = t("seoul.title");
  const withPage = new Set(DISTRICTS_WITH_PAGE.map((d) => d.slug));
  const rows = SEOUL_DISTRICTS.map((d) => ({
    district: d,
    name: districtName(d, locale),
    stats: summary?.districts.find((s) => s.slug === d.slug),
  }));
  const typeTotals = Object.fromEntries(
    PUBLIC_ZONE_TYPES.map((type) => [
      type,
      summary?.districts.reduce((sum, d) => sum + d.counts[type], 0) ?? 0,
    ]),
  ) as Record<(typeof PUBLIC_ZONE_TYPES)[number], number>;
  const top = [...rows].sort(
    (a, b) => (b.stats?.total ?? 0) - (a.stats?.total ?? 0),
  )[0];
  const empty = rows.filter((r) => summary && (r.stats?.total ?? 0) === 0);

  const crumbs = [
    { name: tc("home"), path: "/" },
    { name: t("seoul.breadcrumb"), path: PATH },
  ];
  const jsonLd = zonesJsonLd({
    locale,
    path: PATH,
    name: title,
    description: t("seoul.description"),
    crumbs,
    links: rows
      .filter((r) => withPage.has(r.district.slug))
      .map((r) => ({
        name: t("district.title", { gu: r.name }),
        path: ZONES_PATHS.district(r.district.slug),
      })),
  });

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <JsonLd data={jsonLd} />
      <PageHeader
        title={title}
        description={t("seoul.subtitle")}
        icon={<MapPinned />}
        backLabel={tc("goHome")}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base leading-relaxed text-muted-foreground">
        <ZonesBreadcrumbs
          items={[{ name: tc("home"), href: "/" }, { name: crumbs[1].name }]}
        />

        <PageSection className="border-primary/20 bg-primary/5">
          <p className="mb-2">
            {summary && top?.stats
              ? t("seoul.intro", {
                  total: summary.total,
                  transit: typeTotals.TRANSIT,
                  park: typeTotals.PARK,
                  street: typeTotals.STREET,
                  boundary: typeTotals.BOUNDARY,
                  topDistrict: top.name,
                  topCount: top.stats.total,
                })
              : t("seoul.introNoData")}
          </p>
          <p>{t("seoul.introLinks")}</p>
        </PageSection>

        {!summary && <ZonesUnavailable />}

        <PageSection title={t("seoul.tableTitle")} icon={<Table2 />}>
          <TableScroll>
            <thead>
              <tr>
                <th scope="col">{t("table.district")}</th>
                <th scope="col" className="text-right">
                  {t("table.total")}
                </th>
                {PUBLIC_ZONE_TYPES.map((type) => (
                  <th key={type} scope="col" className="text-right">
                    {tmap(`publicZoneTypes.${type}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ district, name, stats }) => (
                <tr key={district.slug}>
                  <th scope="row">
                    {withPage.has(district.slug) ? (
                      <Link
                        href={ZONES_PATHS.district(district.slug)}
                        className="text-primary underline"
                      >
                        {name}
                      </Link>
                    ) : (
                      name
                    )}
                  </th>
                  <td className="text-right tabular-nums">
                    {stats ? format.number(stats.total) : t("table.empty")}
                  </td>
                  {PUBLIC_ZONE_TYPES.map((type) => (
                    <td key={type} className="text-right tabular-nums">
                      {stats
                        ? format.number(stats.counts[type])
                        : t("table.empty")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </TableScroll>
          {empty.length > 0 && (
            <p className="mt-3 text-sm">
              {t("seoul.noDataDistricts", {
                districts: format.list(empty.map((r) => r.name)),
              })}
            </p>
          )}
        </PageSection>

        <ZonesSource
          source="public"
          referenceDate={summary?.latestReferenceDate}
          updateAt={summary?.updateAt}
          notes={[
            ...(summary?.noAddressCount
              ? [t("seoul.noAddressNote", { count: summary.noAddressCount })]
              : []),
            t("mapHint"),
          ]}
        />

        <PageSection title={t("otherRegions")}>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href={ZONES_PATHS.anyang}>{t("anyang.title")}</Link>
            </Button>
            <MapHomeLink />
          </div>
        </PageSection>
      </main>
    </div>
  );
}
