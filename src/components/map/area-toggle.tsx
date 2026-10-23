"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ZONE_GROUPS } from "@/lib/zone-style";
import { useMapStore } from "@/store/map-store";

// Tailwind가 클래스를 정적으로 찾을 수 있도록 그룹별 클래스를 문자열 그대로 둔다
const CHIP_CLASSES = {
  nonSmoking: {
    on: "bg-zone-non-smoking-ink hover:bg-zone-non-smoking-ink/90",
    icon: "text-zone-non-smoking-ink",
  },
  smoking: {
    on: "bg-zone-smoking-ink hover:bg-zone-smoking-ink/90",
    icon: "text-zone-smoking-ink",
  },
  apartment: {
    on: "bg-zone-apartment-ink hover:bg-zone-apartment-ink/90",
    icon: "text-zone-apartment-ink",
  },
} as const;

export function AreaToggle() {
  const t = useTranslations("map");
  const showNonSmoking = useMapStore((state) => state.showNonSmoking);
  const showSmoking = useMapStore((state) => state.showSmoking);
  const showApartments = useMapStore((state) => state.showApartments);
  const toggleNonSmoking = useMapStore((state) => state.toggleNonSmoking);
  const toggleSmoking = useMapStore((state) => state.toggleSmoking);
  const toggleApartments = useMapStore((state) => state.toggleApartments);

  const chips = [
    { group: "nonSmoking", pressed: showNonSmoking, onClick: toggleNonSmoking },
    { group: "smoking", pressed: showSmoking, onClick: toggleSmoking },
    { group: "apartment", pressed: showApartments, onClick: toggleApartments },
  ] as const;

  return (
    // 칩이 넘치면 가로 스크롤. 칩 영역만 차지해 나머지 지도 드래그를 막지 않는다 (p-1은 그림자 잘림 방지)
    <fieldset
      aria-label={t("filterLabel")}
      className="absolute top-2 left-2 z-20 flex min-w-0 max-w-[calc(100%-1rem)] gap-2 overflow-x-auto p-1 [scrollbar-width:none]"
    >
      {chips.map(({ group, pressed, onClick }) => {
        const { icon: Icon } = ZONE_GROUPS[group];
        const classes = CHIP_CLASSES[group];
        return (
          <Button
            key={group}
            type="button"
            variant="outline"
            size="touch"
            aria-pressed={pressed}
            onClick={onClick}
            className={cn(
              "gap-1.5 rounded-full shadow-md transition-colors has-[>svg]:px-3",
              pressed
                ? cn(
                    "border-transparent text-white hover:text-white",
                    classes.on,
                  )
                : "bg-card text-foreground",
            )}
          >
            <Icon aria-hidden className={pressed ? undefined : classes.icon} />
            {t(`zoneGroups.${group}`)}
            {pressed && <Check aria-hidden />}
          </Button>
        );
      })}
    </fieldset>
  );
}
