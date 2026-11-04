import { MapPinned } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import {
  JsonLd,
  MapHomeLink,
  PublicZoneTable,
  ZonesBreadcrumbs,
  ZonesSource,
  ZonesUnavailable,
} from "@/components/zones/zones-parts";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getDistrictZones, PUBLIC_ZONE_TYPES } from "@/lib/seo/zones-data";
import {
  DISTRICTS_WITH_PAGE,
  districtName,
  ZONES_PATHS,
  zonesJsonLd,
  zonesMetadata,
} from "@/lib/seo/zones-seo";
import { PUBLIC_ZONE_ICONS } from "@/lib/zone-style";

// 페이지는 1시간마다 다시 그리고 API 응답은 1일 캐시한다 (zones-data.ts). 재생성 중 API가 꺼져 있으면 이전 페이지 유지
export const revalidate = 3600;
// 공공데이터가 있는 구만 빌드 때 만든다. 그 밖의 슬러그는 404
export const dynamicParams = false;

// 유형별 표에 싣는 최대 행 수. 큰 구는 행이 1500개 가까이 되어 HTML이 0.9MB, DOM이 7천 개를 넘었다.
// 나머지는 개수만 알리고 지도에서 보게 한다 (구 전체·유형별 개수는 소개 문단에 그대로 있다)
const MAX_ROWS_PER_TYPE = 200;

export function generateStaticParams() {
  return DISTRICTS_WITH_PAGE.map((d) => ({ gu: d.slug }));
}

type Params = Promise<{ locale: string; gu: string }>;

function findDistrict(slug: string) {
  return DISTRICTS_WITH_PAGE.find((d) => d.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale: rawLocale, gu } = await params;
  const locale = rawLocale as Locale;
  const district = findDistrict(gu);
  if (!district) return {};
  const t = await getTranslations({ locale, namespace: "zones.district" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const data = await getDistrictZones(gu);
  const name = districtName(district, locale);
  return zonesMetadata({
    locale,
    path: ZONES_PATHS.district(gu),
    title: t("title", { gu: name }),
    description: data
      ? t("description", { gu: name, total: data.rows.length })
      : t("descriptionNoData", { gu: name }),
    ogImageAlt: tm("ogImageAlt"),
  });
}

export default async function DistrictZonesPage({
  params,
}: {
  params: Params;
}) {
  const { locale: rawLocale, gu } = await params;
  const locale = rawLocale as Locale;
  const district = findDistrict(gu);
  if (!district) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("zones");
  const tc = await getTranslations("common");
  const tmap = await getTranslations("map");
  const data = await getDistrictZones(gu);

  const name = districtName(district, locale);
  const title = t("district.title", { gu: name });
  const path = ZONES_PATHS.district(gu);
  const description = data
    ? t("district.description", { gu: name, total: data.rows.length })
    : t("district.descriptionNoData", { gu: name });

  const jsonLd = zonesJsonLd({
    locale,
    path,
    name: title,
    description,
    crumbs: [
      { name: tc("home"), path: "/" },
      { name: t("seoul.breadcrumb"), path: ZONES_PATHS.seoul },
      { name, path },
    ],
  });

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <JsonLd data={jsonLd} />
      <PageHeader
        title={title}
        description={t("seoul.subtitle")}
        icon={<MapPinned />}
        backHref={ZONES_PATHS.seoul}
        backLabel={t("district.backToSeoul")}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base leading-relaxed text-muted-foreground">
        <ZonesBreadcrumbs
          items={[
            { name: tc("home"), href: "/" },
            { name: t("seoul.breadcrumb"), href: ZONES_PATHS.seoul },
            { name },
          ]}
        />

        <PageSection className="border-primary/20 bg-primary/5">
          <p>
            {data
              ? t("district.intro", {
                  gu: name,
                  total: data.rows.length,
                  transit: data.counts.TRANSIT,
                  park: data.counts.PARK,
                  street: data.counts.STREET,
                  boundary: data.counts.BOUNDARY,
                })
              : t("district.introNoData", { gu: name })}
          </p>
        </PageSection>

        {!data && <ZonesUnavailable />}

        {data &&
          PUBLIC_ZONE_TYPES.map((type) => {
            const rows = data.rows.filter((r) => r.zoneType === type);
            if (rows.length === 0) return null;
            const Icon = PUBLIC_ZONE_ICONS[type];
            return (
              <PageSection
                key={type}
                title={tmap(`publicZoneTypes.${type}`)}
                icon={<Icon />}
                action={
                  <span className="shrink-0 text-sm tabular-nums">
                    {t("unit", { count: rows.length })}
                  </span>
                }
              >
                <PublicZoneTable rows={rows.slice(0, MAX_ROWS_PER_TYPE)} />
                {rows.length > MAX_ROWS_PER_TYPE && (
                  <p className="mt-2 text-sm">
                    {t("district.truncated", {
                      shown: MAX_ROWS_PER_TYPE,
                      rest: rows.length - MAX_ROWS_PER_TYPE,
                    })}
                  </p>
                )}
              </PageSection>
            );
          })}

        <ZonesSource
          source="public"
          referenceDate={data?.latestReferenceDate}
          updateAt={data?.updateAt}
          notes={[
            ...(data?.noAddressCount
              ? [t("district.noAddressNote", { count: data.noAddressCount })]
              : []),
            t("mapHint"),
          ]}
        />

        <PageSection title={t("district.otherDistricts")}>
          <ul className="mb-4 flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
            {DISTRICTS_WITH_PAGE.filter((d) => d.slug !== gu).map((d) => (
              <li key={d.slug}>
                <Link
                  href={ZONES_PATHS.district(d.slug)}
                  className="text-primary underline"
                >
                  {districtName(d, locale)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href={ZONES_PATHS.seoul}>{t("district.backToSeoul")}</Link>
            </Button>
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
