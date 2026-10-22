"use client";

import { Check, MapPin, Minus, X } from "lucide-react";
import * as motion from "motion/react-client";
import { ZONE_TONE } from "@/components/home/zone-tone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ZONE_GROUPS } from "@/lib/zone-style";
import { useMapStore } from "@/store/map-store";

const DESIGNATION_AREAS = [
  ["hallway", "복도"],
  ["stairs", "계단"],
  ["elevator", "엘리베이터"],
  ["undergroundParkingLot", "지하주차장"],
] as const;

// 위치는 page.tsx의 하단 스택이 정한다 (모바일: 시트 peek 위)
export function SelectedApartmentCard() {
  const selectedApartment = useMapStore((state) => state.selectedApartment);
  const clearSelection = useMapStore((state) => state.clearSelection);

  if (!selectedApartment) return null;

  const { icon: Icon } = ZONE_GROUPS.apartment;
  const designation = selectedApartment.path[0];

  return (
    <motion.section
      aria-label="선택한 아파트"
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
            <h2 className="text-base font-semibold leading-snug">
              {selectedApartment.apartmentName}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{selectedApartment.address}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 tabular-nums">
              <Badge variant="outline" className={ZONE_TONE.apartment.soft}>
                {selectedApartment.numberOfBuilding}개 동
              </Badge>
              <Badge variant="outline" className={ZONE_TONE.apartment.soft}>
                {selectedApartment.numberOfHouseholds}세대
              </Badge>
            </div>

            {designation && (
              <div className="mt-3 rounded-lg bg-muted p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  금연구역 지정 범위
                </p>
                <ul className="grid grid-cols-2 gap-1.5">
                  {DESIGNATION_AREAS.map(([key, name]) => {
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
                        <span>{name}</span>
                        <span className="flex items-center gap-0.5 font-medium">
                          {isDesignated ? (
                            <Check className="size-3.5" aria-hidden />
                          ) : (
                            <Minus className="size-3.5" aria-hidden />
                          )}
                          {isDesignated ? "지정" : "미지정"}
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
            aria-label="선택 닫기"
          >
            <X aria-hidden />
          </Button>
        </CardContent>
      </Card>
    </motion.section>
  );
}
