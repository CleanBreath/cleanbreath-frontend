import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ZONE_STYLES, type ZoneType } from "@/lib/zone-style";

// 색만으로 구분하지 않도록 스와치(점선 여부) + 아이콘 + 라벨을 함께 표시
export function ZoneLegend({ className }: { className?: string }) {
  const t = useTranslations("map");
  return (
    <ul
      aria-label={t("legendLabel")}
      className={cn("grid gap-1.5 text-sm text-foreground", className)}
    >
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
  );
}
