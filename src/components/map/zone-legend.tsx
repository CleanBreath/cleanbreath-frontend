import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  PUBLIC_ZONE_ICONS,
  ZONE_STYLES,
  type ZoneType,
} from "@/lib/zone-style";
import type { PublicZoneType } from "@/types";

// 색만으로 구분하지 않도록 스와치(점선 여부) + 아이콘 + 라벨을 함께 표시
export function ZoneLegend({ className }: { className?: string }) {
  const t = useTranslations("map");
  return (
    <div className={cn("grid gap-3 text-sm text-foreground", className)}>
      <ul aria-label={t("legendLabel")} className="grid gap-1.5">
        {(Object.keys(ZONE_STYLES) as ZoneType[]).map((type) => {
          const zone = ZONE_STYLES[type];
          const Icon = zone.icon;
          return (
            <li key={type} className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "size-4 shrink-0 rounded-sm border-2",
                  zone.dashed ? "border-dashed" : "border-solid",
                )}
                // 지도 폴리곤과 같은 반투명 fill (hex alpha 0x66 ≈ 0.4)
                style={{
                  backgroundColor: `${zone.fill}66`,
                  borderColor: zone.stroke,
                }}
              />
              <Icon
                aria-hidden
                className="size-4 shrink-0"
                style={{ color: zone.stroke }}
              />
              <span>{t(`zoneTypes.${type}`)}</span>
            </li>
          );
        })}
      </ul>

      {/* 공공데이터 점은 지도 마커와 같은 모양(초록 원 + 흰 아이콘)으로 보여준다 */}
      <p aria-hidden className="-mb-1.5 text-muted-foreground text-xs">
        {t("publicZoneLegendLabel")}
      </p>
      <ul aria-label={t("publicZoneLegendLabel")} className="grid gap-1.5">
        {(Object.keys(PUBLIC_ZONE_ICONS) as PublicZoneType[]).map((type) => {
          const Icon = PUBLIC_ZONE_ICONS[type];
          return (
            <li key={type} className="flex items-center gap-2">
              <span
                aria-hidden
                className="flex size-5 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: ZONE_STYLES.NON_SMOKING_ZONE.stroke }}
              >
                <Icon className="size-3 text-white" />
              </span>
              <span>{t(`publicZoneTypes.${type}`)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
