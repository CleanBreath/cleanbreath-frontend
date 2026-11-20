"use client";

import { MapPin, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
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
  const cardRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // 선택될 때의 포커스 위치(목록 행·모바일 시트 토글·공공 구역 마커)를 돌아갈 곳으로 기억한다.
  // body(지도 클릭)나 카드 안 포커스면 이전 선택의 자리를 남기지 않도록 비운다
  useEffect(() => {
    if (!selectedAddress) return;
    const active = document.activeElement;
    returnFocusRef.current =
      active instanceof HTMLElement &&
      active !== document.body &&
      !cardRef.current?.contains(active)
        ? active
        : null;
    // 마커는 선택 후 지도가 움직여 다시 그려지면 사라져 포커스가 body로 떨어지므로, 키보드로 고른 경우 카드로 옮긴다
    if (returnFocusRef.current?.dataset.zoneMarker) headingRef.current?.focus();
  }, [selectedAddress]);

  const close = () => {
    const target = returnFocusRef.current;
    // 하단 스택에서 카드 다음 요소(주 CTA). 돌아갈 곳이 없을 때 쓴다
    const next = cardRef.current?.nextElementSibling;
    returnFocusRef.current = null;
    clearSelection();
    // 닫기 버튼이 사라지며 포커스가 body로 떨어지지 않게 선택 전 자리로 돌려보낸다.
    // 다시 그려진 마커는 구역 id로 새 노드를 찾고, 탭 전환 등으로 분리된 노드면 주 CTA로 보낸다
    const marker = target?.dataset.zoneMarker;
    const fallback =
      (marker &&
        document.querySelector<HTMLElement>(
          `[data-zone-marker="${marker}"]`,
        )) ||
      next;
    if (target?.isConnected) target.focus();
    else if (fallback instanceof HTMLElement) fallback.focus();
  };

  if (!selectedAddress) return null;

  const group = categoryGroup(selectedAddress.category);
  const { icon: Icon } = ZONE_GROUPS[group];

  return (
    // 등장 효과는 CSS로 (motion 라이브러리를 홈 번들에 싣지 않는다). 동작 줄이기 설정이면 생략
    <section
      ref={cardRef}
      aria-label={t("selectedAddress.label")}
      className="w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-200 ease-out motion-reduce:animate-none sm:w-96"
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
            <h2
              ref={headingRef}
              tabIndex={-1}
              lang="ko"
              className="text-base font-semibold leading-snug"
            >
              {selectedAddress.addressName}
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
                {selectedAddress.buildingName}
              </span>
            </p>
            <Badge
              variant="outline"
              className={cn("mt-2", ZONE_TONE[group].soft)}
            >
              <Icon strokeWidth={1.5} aria-hidden />
              {t(`zoneGroups.${group}`)}
            </Badge>
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
