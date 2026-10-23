"use client";

import { Check, MapPin, Minus, X } from "lucide-react";
import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";
import { ZONE_TONE } from "@/components/home/zone-tone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ZONE_GROUPS } from "@/lib/zone-style";
import { useMapStore } from "@/store/map-store";

// 라벨은 messages map.selectedApartment.areas.<key>
const DESIGNATION_AREAS = [
  "hallway",
  "stairs",
  "elevator",
  "undergroundParkingLot",
] as const;

// 위치는 page.tsx의 하단 스택이 정한다 (모바일: 시트 peek 위)
export function SelectedApartmentCard() {
  const t = useTranslations("map");
  const selectedApartment = useMapStore((state) => state.selectedApartment);
  const clearSelection = useMapStore((state) => state.clearSelection);

  if (!selectedApartment) return null;

  const { icon: Icon } = ZONE_GROUPS.apartment;
  const designation = selectedApartment.path[0];

  return (
    <motion.section
      aria-label={t("selectedApartment.label")}
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
              ZONE_TONE.apartment.solid,
            )}
          >
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 lang="ko" className="text-base font-semibold leading-snug">
              {selectedApartment.apartmentName}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span lang="ko" className="truncate">
                {selectedApartment.address}
              </span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 tabular-nums">
              <Badge variant="outline" className={ZONE_TONE.apartment.soft}>
                {t("selectedApartment.buildings", {
                  count: selectedApartment.numberOfBuilding,
                })}
              </Badge>
              <Badge variant="outline" className={ZONE_TONE.apartment.soft}>
                {t("selectedApartment.households", {
                  count: selectedApartment.numberOfHouseholds,
                })}
              </Badge>
            </div>

            {designation && (
              <div className="mt-3 rounded-lg bg-muted p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {t("selectedApartment.designationTitle")}
                </p>
                <ul className="grid grid-cols-2 gap-1.5">
                  {DESIGNATION_AREAS.map((key) => {
                    const isDesignated = designation[key] === "YES";
                    return (
                      <li
                        key={key}
                        className={cn(
                          "flex items-center justify-between gap-1 rounded-md border px-2 py-1.5 text-xs",
                          isDesignated
                            ? ZONE_TONE.nonSmoking.soft
                            : "border-transparent bg-background text-muted-foreground",
                        )}
                      >
                        <span>{t(`selectedApartment.areas.${key}`)}</span>
                        <span className="flex items-center gap-0.5 font-medium">
                          {isDesignated ? (
                            <Check className="size-3.5" aria-hidden />
                          ) : (
                            <Minus className="size-3.5" aria-hidden />
                          )}
                          {isDesignated
                            ? t("selectedApartment.designated")
                            : t("selectedApartment.notDesignated")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
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
