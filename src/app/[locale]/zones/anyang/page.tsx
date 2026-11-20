import { Cigarette, CigaretteOff, MapPinned } from "lucide-react";
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
import { type AnyangZones, getAnyangZones } from "@/lib/seo/zones-data";
import { ZONES_PATHS, zonesJsonLd, zonesMetadata } from "@/lib/seo/zones-seo";
import { ZONE_STYLES, type ZoneType } from "@/lib/zone-style";

// 페이지는 1시간마다 다시 그리고 API 응답은 1일 캐시한다 (zones-data.ts). 재생성 중 API가 꺼져 있으면 이전 페이지 유지
export const revalidate = 3600;

const PATH = ZONES_PATHS.anyang;

type AnyangItem = AnyangZones["items"][number];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "zones.anyang" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  return zonesMetadata({
    locale,
    path: PATH,
    title: t("title"),
    description: t("description"),
    ogImageAlt: tm("ogImageAlt"),
    hasData: (await getAnyangZones()) !== null,
  });
}

/** 분류(category)별로 묶고 많은 순으로 정렬. 분류 이름은 데이터 값이라 한국어 그대로 */
function groupByCategory(items: AnyangItem[]) {
  const groups = new Map<string, AnyangItem[]>();
  for (const item of items) {
    groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  }
  return [...groups].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], "ko"),
  );
}

export default async function AnyangZonesPage({
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
  const data = await getAnyangZones();

  const title = t("anyang.title");
  const smoking = data?.items.filter((i) => i.group === "smoking") ?? [];
  const nonSmoking = data?.items.filter((i) => i.group === "nonSmoking") ?? [];
  const nonSmokingGroups = groupByCategory(nonSmoking);
  const smokingGroups = groupByCategory(smoking);
  // 알 수 없는 divisionArea는 라벨 없이 원문을 보여 준다
  const divisionLabel = (divisionArea: string) =>
    divisionArea in ZONE_STYLES
      ? tmap(`zoneTypes.${divisionArea as ZoneType}`)
      : divisionArea;

  const jsonLd = zonesJsonLd({
    locale,
    path: PATH,
    name: title,
    description: t("anyang.description"),
    crumbs: [
      { name: tc("home"), path: "/" },
      { name: t("anyang.breadcrumb"), path: PATH },
    ],
  });

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <JsonLd data={jsonLd} />
      <PageHeader
        title={title}
        description={t("anyang.subtitle")}
        icon={<MapPinned />}
        backLabel={tc("goHome")}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base leading-relaxed text-muted-foreground [&:lang(en)_p]:max-w-lg [&:lang(en)_li]:max-w-lg">
        <ZonesBreadcrumbs
          items={[
            { name: tc("home"), href: "/" },
            { name: t("anyang.breadcrumb") },
          ]}
        />

        <PageSection className="border-primary/20 bg-primary/5">
          <p>
            {data && nonSmokingGroups.length > 0
              ? t("anyang.intro", {
                  total: data.items.length,
                  smoking: smoking.length,
                  nonSmoking: nonSmoking.length,
                  topCategory: nonSmokingGroups[0][0],
                  topCount: nonSmokingGroups[0][1].length,
                })
              : t("anyang.introNoData")}
          </p>
        </PageSection>

        {!data && <ZonesUnavailable />}

        {smoking.length > 0 && (
          <PageSection
            title={t("anyang.smokingTitle")}
            icon={<Cigarette />}
            action={
              <span className="shrink-0 text-sm tabular-nums">
                {t("unit", { count: smoking.length })}
              </span>
            }
          >
            <TableScroll label={t("anyang.smokingTitle")}>
              <thead>
                <tr>
                  <th scope="col">{t("table.name")}</th>
                  <th scope="col">{t("table.category")}</th>
                  <th scope="col">{t("table.zoneType")}</th>
                  <th scope="col">{t("table.address")}</th>
                </tr>
              </thead>
              <tbody>
                {smokingGroups.flatMap(([, items]) =>
                  items.map((item) => (
                    <tr key={item.id}>
                      <th scope="row" lang="ko">
                        {item.buildingName}
                      </th>
                      <td lang="ko">{item.category}</td>
                      <td>
                        {format.list([
                          ...new Set(
                            item.path.map((p) => divisionLabel(p.divisionArea)),
                          ),
                        ])}
                      </td>
                      <td lang="ko">{item.addressName}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </TableScroll>
          </PageSection>
        )}

        {nonSmoking.length > 0 && (
          <PageSection
            title={t("anyang.nonSmokingTitle")}
            icon={<CigaretteOff />}
            action={
              <span className="shrink-0 text-sm tabular-nums">
                {t("unit", { count: nonSmoking.length })}
              </span>
            }
          >
            <div className="space-y-5">
              {nonSmokingGroups.map(([category, items], i) => (
                <section key={category}>
                  <h3 className="mb-2 flex items-baseline justify-between gap-2 font-semibold text-foreground">
                    {/* 표 이름으로 참조한다. 분류명에 공백이 있어 id는 순번으로 만든다 */}
                    <span id={`anyang-category-${i}`} lang="ko">
                      {category}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground tabular-nums">
                      {t("unit", { count: items.length })}
                    </span>
                  </h3>
                  <TableScroll
                    label={category}
                    labelledBy={`anyang-category-${i}`}
                  >
                    <thead>
                      <tr>
                        <th scope="col">{t("table.name")}</th>
                        <th scope="col">{t("table.address")}</th>
                      </tr>
                    </thead>
                    <tbody lang="ko">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <th scope="row">{item.buildingName}</th>
                          <td>{item.addressName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </TableScroll>
                </section>
              ))}
            </div>
          </PageSection>
        )}

        <ZonesSource
          source="anyang"
          updateAt={data?.updateAt}
          notes={
            data?.outsideCount
              ? [t("anyang.outsideNote", { count: data.outsideCount })]
              : []
          }
        />

        <PageSection title={t("otherRegions")}>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              asChild
              className="h-auto min-h-9 max-w-full whitespace-normal text-left"
            >
              <Link href={ZONES_PATHS.seoul}>{t("anyang.seoulLink")}</Link>
            </Button>
            <MapHomeLink />
          </div>
        </PageSection>
      </main>
    </div>
  );
}
