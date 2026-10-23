"use client";

import { MapPin, X } from "lucide-react";
import * as motion from "motion/react-client";
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
    <motion.section
      aria-label={t("selectedAddress.label")}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full sm:w-96"
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
    </motion.section>
  );
}
