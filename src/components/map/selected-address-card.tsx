"use client";

import { MapPin, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { categoryGroup, ZONE_TONE } from "@/components/home/zone-tone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ZONE_GROUPS } from "@/lib/zone-style";
import { useMapStore } from "@/store/map-store";

// 위치는 page.tsx의 하단 스택이 정한다 (모바일: 시트 peek 위)
export function SelectedAddressCard() {
  const t = useTranslations("map");
  const selectedAddress = useMapStore((state) => state.selectedAddress);
  const clearSelection = useMapStore((state) => state.clearSelection);

  if (!selectedAddress) return null;

  const group = categoryGroup(selectedAddress.category);
  const { icon: Icon } = ZONE_GROUPS[group];

  return (
    // 등장 효과는 CSS로 (motion 라이브러리를 홈 번들에 싣지 않는다). 동작 줄이기 설정이면 생략
    <section
      aria-label={t("selectedAddress.label")}
      className="w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-200 motion-reduce:animate-none sm:w-96"
    >
      <Card className="gap-0 py-0 shadow-md">
        <CardContent className="flex items-start gap-3 p-4">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-lg",
              ZONE_TONE[group].solid,
            )}
          >
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 lang="ko" className="text-base font-semibold leading-snug">
              {selectedAddress.addressName}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span lang="ko" className="truncate">
                {selectedAddress.buildingName}
              </span>
            </p>
            <Badge
              variant="outline"
              className={cn("mt-2", ZONE_TONE[group].soft)}
            >
              <Icon aria-hidden />
              {t(`zoneGroups.${group}`)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon-touch"
            className="-mr-2 -mt-2 shrink-0 rounded-full"
            onClick={clearSelection}
            aria-label={t("closeSelection")}
          >
            <X aria-hidden />
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
