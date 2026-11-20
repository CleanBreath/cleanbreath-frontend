"use client";

import { Check, MapPin, Minus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
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
  const cardRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // 선택될 때의 포커스 위치(목록 행·모바일 시트 토글)를 돌아갈 곳으로 기억한다.
  // body(지도 클릭)나 카드 안 포커스면 이전 선택의 자리를 남기지 않도록 비운다
  useEffect(() => {
    if (!selectedApartment) return;
    const active = document.activeElement;
    returnFocusRef.current =
      active instanceof HTMLElement &&
      active !== document.body &&
      !cardRef.current?.contains(active)
        ? active
        : null;
  }, [selectedApartment]);

  const close = () => {
    const target = returnFocusRef.current;
    // 하단 스택에서 카드 다음 요소(주 CTA). 돌아갈 곳이 없을 때 쓴다
    const next = cardRef.current?.nextElementSibling;
    returnFocusRef.current = null;
    clearSelection();
    // 닫기 버튼이 사라지며 포커스가 body로 떨어지지 않게 선택 전 자리로, 없거나 분리된 노드(탭 전환 등)면 주 CTA로 보낸다
    if (target?.isConnected) target.focus();
    else if (next instanceof HTMLElement) next.focus();
  };

  if (!selectedApartment) return null;

  const { icon: Icon } = ZONE_GROUPS.apartment;
  const designation = selectedApartment.path[0];

  return (
    // 등장 효과는 CSS로 (motion 라이브러리를 홈 번들에 싣지 않는다). 동작 줄이기 설정이면 생략
    <section
      ref={cardRef}
      aria-label={t("selectedApartment.label")}
      className="w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-200 ease-out motion-reduce:animate-none sm:w-96"
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
            {/* 마지막 상세 화면이라 자르지 않고 줄바꿈한다 (en/ja 페이지는 body:lang(ko)의 keep-all이 안 닿아 span에 break-keep).
                3px은 14px 아이콘을 20px 줄의 첫 줄 가운데에 맞추는 오프셋 */}
            <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin
                className="mt-[3px] size-3.5 shrink-0"
                strokeWidth={1.5}
                aria-hidden
              />
              <span lang="ko" className="break-keep">
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
                {/* 2열 그리드는 라벨+상태를 담기에 좁아 글자 단위로 끊겨, 내용 폭 칩으로 줄바꿈한다 */}
                <ul className="flex flex-wrap gap-1.5">
                  {DESIGNATION_AREAS.map((key) => {
                    const isDesignated = designation[key] === "YES";
                    return (
                      <li
                        key={key}
                        className={cn(
                          "flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs",
                          isDesignated
                            ? ZONE_TONE.nonSmoking.soft
                            : "border-transparent bg-background text-muted-foreground",
                        )}
                      >
                        <span>{t(`selectedApartment.areas.${key}`)}</span>
                        <span className="flex shrink-0 items-center gap-0.5 font-medium">
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
            onClick={close}
            aria-label={t("closeSelection")}
          >
            <X aria-hidden />
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
