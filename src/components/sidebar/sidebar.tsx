"use client";

import {
  Activity,
  Building2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Info,
  List,
  MapPinPlus,
  MessageSquarePlus,
  PanelLeft,
  PanelLeftClose,
  Scale,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { categoryGroup, ZONE_TONE } from "@/components/home/zone-tone";
import { ZoneLegend } from "@/components/map/zone-legend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ZONE_GROUPS } from "@/lib/zone-style";
import { useMapStore } from "@/store/map-store";
import type { AddressItem, ApartmentItem } from "@/types";

type Snap = "peek" | "half" | "full";

// 시트 높이는 100dvh-4rem 고정, 스냅은 translate로만 바꾼다(높이 애니메이션 금지).
// half에서는 화면 밖으로 밀린 만큼 내부 스크롤 하단 여백(pad)을 줘서 끝까지 스크롤되게 한다.
// peek 4.75rem = 손잡이 + 헤더 한 줄. page.tsx 하단 스택도 같은 값을 쓴다
const SNAP_STYLE: Record<Snap, { y: string; pad: string }> = {
  peek: { y: "calc(100% - 4.75rem - env(safe-area-inset-bottom))", pad: "0px" },
  half: { y: "calc(100% - 50dvh)", pad: "calc(50dvh - 4rem)" },
  full: { y: "0px", pad: "0px" },
};
const NEXT_SNAP: Record<Snap, Snap> = {
  peek: "half",
  half: "full",
  full: "peek",
};

interface SidebarProps {
  addresses: AddressItem[];
  apartments: ApartmentItem[];
  isLoading: boolean;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onFeedbackClick: () => void;
  onVersionClick: () => void;
}

// 콘텐츠는 한 번만 렌더하고 CSS로 배치만 바꾼다: <lg 바텀 시트, ≥lg 왼쪽 사이드바 (SEO용 h1·소개 문구 중복 방지)
export function Sidebar({
  addresses,
  apartments,
  isLoading,
  isCollapsed,
  onCollapsedChange,
  onFeedbackClick,
  onVersionClick,
}: SidebarProps) {
  const [snap, setSnap] = useState<Snap>("peek");
  const [dragY, setDragY] = useState<number | null>(null);
  const dragStartY = useRef(0);
  const sheetRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const bodyId = useId();
  const selectAddress = useMapStore((state) => state.selectAddress);
  const selectApartment = useMapStore((state) => state.selectApartment);
  const selection = useMapStore(
    (state) => state.selectedAddress ?? state.selectedApartment,
  );

  // 시트를 내릴 때 본문에 있던 포커스는 화면 밖으로 밀리므로 항상 보이는 토글로 옮긴다
  // (≥lg에서는 토글이 숨겨져 focus()가 무시되고 포커스는 그대로 남는다)
  const collapse = () => {
    setSnap("peek");
    if (bodyRef.current?.contains(document.activeElement))
      toggleRef.current?.focus();
  };

  // 지도나 목록에서 선택하면 시트를 내려 선택 카드와 지도가 보이게 한다
  // biome-ignore lint/correctness/useExhaustiveDependencies: 선택이 바뀔 때만 실행
  useEffect(() => {
    if (selection) collapse();
  }, [selection]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    if ((e.target as HTMLElement).closest("button, a")) return;
    dragStartY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragY(0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragY !== null) setDragY(e.clientY - dragStartY.current);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragY === null) return;
    const dy = e.clientY - dragStartY.current;
    const sheet = sheetRef.current;
    setDragY(null);
    // 거의 안 움직였으면 탭으로 보고 다음 스냅
    if (Math.abs(dy) < 8 || !sheet) {
      setSnap(NEXT_SNAP[snap]);
      return;
    }
    // 놓은 위치에서 보이는 높이와 가장 가까운 스냅
    const visible = window.innerHeight - sheet.getBoundingClientRect().top;
    const heights: Record<Snap, number> = {
      peek: 76,
      half: window.innerHeight / 2,
      full: sheet.offsetHeight,
    };
    const nearest = (Object.keys(heights) as Snap[]).reduce((a, b) =>
      Math.abs(heights[a] - visible) <= Math.abs(heights[b] - visible) ? a : b,
    );
    setSnap(nearest);
  };

  const sheetY =
    dragY === null
      ? SNAP_STYLE[snap].y
      : `max(0px, calc(${SNAP_STYLE[snap].y} + ${dragY}px))`;

  return (
    <>
      <aside
        ref={sheetRef}
        aria-label="지도 정보 패널"
        onKeyDown={(e) => {
          if (e.key === "Escape" && snap !== "peek") collapse();
        }}
        onFocus={(e) => {
          // 하단 메뉴는 full에서만 화면 안에 있다. 본문은 접힌 상태면 반쯤 펼친다
          if (snap !== "full" && navRef.current?.contains(e.target))
            setSnap("full");
          else if (snap === "peek" && bodyRef.current?.contains(e.target))
            setSnap("half");
        }}
        onBlur={(e) => {
          // 키보드로 지도 쪽(main)으로 나가면 접어서 하단 스택이 시트에 가리지 않게 한다. 모달(포털)로 갈 때는 유지
          if ((e.relatedTarget as HTMLElement | null)?.closest("main"))
            setSnap("peek");
        }}
        style={
          {
            "--sheet-y": sheetY,
            "--sheet-pad": SNAP_STYLE[snap].pad,
          } as React.CSSProperties
        }
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 flex h-[calc(100dvh-4rem)] translate-y-(--sheet-y) flex-col overflow-hidden rounded-t-2xl border-t bg-background shadow-lg",
          dragY === null &&
            "transition-transform duration-200 ease-out motion-reduce:transition-none",
          "lg:relative lg:inset-auto lg:z-auto lg:h-full lg:w-95 lg:shrink-0 lg:translate-y-0 lg:rounded-none lg:border-t-0 lg:border-r lg:shadow-none",
          isCollapsed && "lg:hidden",
        )}
      >
        {/* 헤더: 모바일에서는 시트 손잡이(드래그·탭) 겸 peek 요약 줄 */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setDragY(null)}
          className="shrink-0 touch-none select-none px-4 pt-2 pb-3 lg:touch-auto lg:select-auto lg:p-5"
        >
          <div
            aria-hidden
            className="mx-auto mb-2 h-1 w-10 rounded-full bg-muted-foreground/40 lg:hidden"
          />
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary p-1.5">
              <Image src="/logo.svg" alt="" width={28} height={28} />
            </span>
            <h1 className="flex min-w-0 flex-1 flex-col">
              <span className="text-lg font-bold leading-tight tracking-tight">
                CleanBreath
              </span>
              <span className="text-sm font-normal text-muted-foreground">
                금연구역·흡연구역 지도
              </span>
            </h1>
            <Button
              ref={toggleRef}
              variant="ghost"
              size="icon-touch"
              className="shrink-0 lg:hidden"
              onClick={() => setSnap(NEXT_SNAP[snap])}
              aria-expanded={snap !== "peek"}
              aria-controls={bodyId}
              aria-label={snap === "full" ? "패널 접기" : "패널 펼치기"}
            >
              {snap === "full" ? (
                <ChevronDown aria-hidden />
              ) : (
                <ChevronUp aria-hidden />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-touch"
              className="hidden shrink-0 lg:inline-flex"
              onClick={() => onCollapsedChange(true)}
              aria-label="사이드바 접기"
            >
              <PanelLeftClose aria-hidden />
            </Button>
          </div>
        </div>

        <div
          ref={bodyRef}
          id={bodyId}
          className="flex min-h-0 flex-1 flex-col border-t"
        >
          <Tabs defaultValue="info" className="min-h-0 flex-1 gap-0">
            <TabsList className="mx-4 mt-3 grid w-auto shrink-0 grid-cols-3">
              <TabsTrigger value="info">
                <Info aria-hidden />
                소개
              </TabsTrigger>
              <TabsTrigger value="list">
                <List aria-hidden />
                구역
              </TabsTrigger>
              <TabsTrigger value="apartments">
                <Building2 aria-hidden />
                아파트
              </TabsTrigger>
            </TabsList>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-(--sheet-pad) lg:pb-0">
              <TabsContent value="info" className="p-4">
                <ServiceInfo />
              </TabsContent>

              <TabsContent value="list" className="p-2">
                <AddressList
                  addresses={addresses}
                  isLoading={isLoading}
                  onItemClick={selectAddress}
                />
              </TabsContent>

              <TabsContent value="apartments" className="p-2">
                <ApartmentList
                  apartments={apartments}
                  isLoading={isLoading}
                  onItemClick={selectApartment}
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* 보조 동작 메뉴 (피드백·버전 정보·구역 등록) */}
          <nav
            ref={navRef}
            aria-label="보조 메뉴"
            className="grid shrink-0 grid-cols-3 gap-2 border-t p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:pb-4"
          >
            <Button
              variant="outline"
              size="touch"
              className="px-2"
              onClick={onFeedbackClick}
            >
              <MessageSquarePlus aria-hidden />
              피드백
            </Button>
            <Button variant="outline" size="touch" className="px-2" asChild>
              <Link href="/register">
                <MapPinPlus aria-hidden />
                구역 등록
              </Link>
            </Button>
            <Button
              variant="outline"
              size="touch"
              className="px-2"
              onClick={onVersionClick}
            >
              <Info aria-hidden />
              버전 정보
            </Button>
          </nav>
        </div>
      </aside>

      {/* 데스크톱: 사이드바를 접었을 때 다시 여는 버튼 (상단은 필터 칩 영역이라 좌하단, NAVER 로고 줄 위) */}
      {isCollapsed && (
        <Button
          variant="outline"
          size="touch"
          className="fixed bottom-10 left-4 z-20 hidden bg-background shadow-md lg:inline-flex"
          onClick={() => onCollapsedChange(false)}
        >
          <PanelLeft aria-hidden />
          메뉴 열기
        </Button>
      )}
    </>
  );
}

const linkClass = "text-primary underline underline-offset-2";

function ServiceInfo() {
  return (
    <div className="space-y-6 text-base leading-relaxed lg:text-sm">
      <section>
        <h2 className="mb-2 text-base font-semibold">서비스 소개</h2>
        <div className="space-y-2 text-muted-foreground">
          <p>
            CleanBreath는 금연구역과 흡연구역을 지도에 표시하는 무료
            서비스입니다. 초록색은 금연구역, 주황·빨강·보라색은 흡연구역이며,
            아파트 탭에서는 공동주택의 복도·계단·엘리베이터·지하주차장 금연구역
            지정 여부를 확인할 수 있습니다.
          </p>
          <p>
            새로운 구역은 누구나{" "}
            <Link href="/register" className={linkClass}>
              구역 등록
            </Link>{" "}
            페이지에서 제안할 수 있으며, 검토를 거친 뒤 지도에 반영됩니다.
            제안된 구역은{" "}
            <Link href="/board" className={linkClass}>
              게시판
            </Link>
            에 공개되어 &lsquo;사실이에요&rsquo;·&lsquo;아니에요&rsquo; 투표로
            정확성에 대한 의견을 남길 수 있습니다.
          </p>
          <p>
            금연구역은 국민건강증진법 제9조에 근거해 지정됩니다. 시설별 지정
            기준은{" "}
            <Link href="/statute" className={linkClass}>
              금연구역 관련 법령
            </Link>
            에서, 운영 주체와 데이터 관리 방식은{" "}
            <Link href="/about" className={linkClass}>
              서비스 소개 및 운영 정보
            </Link>
            에서 확인하세요.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">사용 방법</h2>
        <ol className="space-y-2">
          {[
            "상단 필터로 금연구역·흡연구역·아파트 표시를 켜고 끄세요",
            "지도의 마커를 클릭하면 상세 정보를 볼 수 있습니다",
            "목록에서 구역을 선택하면 해당 위치로 이동합니다",
          ].map((text, i) => (
            <li key={text} className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums text-foreground">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">범례</h2>
        <ZoneLegend />
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">더 알아보기</h2>
        <ul className="divide-y rounded-lg border">
          {[
            {
              href: "/statute",
              icon: Scale,
              title: "금연구역 관련 법령",
              desc: "국민건강증진법에 따른 금연구역 지정 시설 및 관련 규정을 확인해보세요.",
            },
            {
              href: "/about",
              icon: Info,
              title: "서비스 소개 및 운영 정보",
              desc: "운영 주체와 데이터 관리 방식을 확인할 수 있습니다.",
            },
            {
              href: "/health",
              icon: Activity,
              title: "서버 상태",
              desc: "API 서버와 데이터베이스의 실시간 상태를 확인할 수 있습니다.",
            },
          ].map(({ href, icon: Icon, title, desc }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex min-h-11 items-center gap-3 p-3 hover:bg-accent"
              >
                <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{title}</span>
                  <span className="block text-sm text-muted-foreground">
                    {desc}
                  </span>
                </span>
                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ListStatus({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex h-40 items-center justify-center" role="status">
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent motion-reduce:animate-none" />
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        </div>
      ) : (
        <p className="text-muted-foreground">데이터가 없습니다</p>
      )}
    </div>
  );
}

const rowClass =
  "flex min-h-11 w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-accent";

interface AddressListProps {
  addresses: AddressItem[];
  isLoading: boolean;
  onItemClick: (address: AddressItem) => void;
}

function AddressList({ addresses, isLoading, onItemClick }: AddressListProps) {
  if (isLoading || !addresses.length)
    return <ListStatus isLoading={isLoading} />;

  return (
    <ul className="space-y-0.5">
      {addresses.map((address) => {
        const group = categoryGroup(address.category);
        const Icon = ZONE_GROUPS[group].icon;
        return (
          <li key={address.id}>
            <button
              type="button"
              className={rowClass}
              onClick={() => onItemClick(address)}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  ZONE_TONE[group].solid,
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {address.addressName}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {address.buildingName}
                </span>
              </span>
              <Badge variant="outline" className={ZONE_TONE[group].soft}>
                {group === "smoking" ? "흡연" : "금연"}
              </Badge>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

interface ApartmentListProps {
  apartments: ApartmentItem[];
  isLoading: boolean;
  onItemClick: (apartment: ApartmentItem) => void;
}

function ApartmentList({
  apartments,
  isLoading,
  onItemClick,
}: ApartmentListProps) {
  if (isLoading || !apartments.length)
    return <ListStatus isLoading={isLoading} />;

  const Icon = ZONE_GROUPS.apartment.icon;

  return (
    <ul className="space-y-0.5">
      {apartments.map((apartment) => (
        <li key={apartment.id}>
          <button
            type="button"
            className={rowClass}
            onClick={() => onItemClick(apartment)}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                ZONE_TONE.apartment.solid,
              )}
            >
              <Icon className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {apartment.apartmentName}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {apartment.address}
              </span>
            </span>
            <Badge
              variant="outline"
              className={cn("tabular-nums", ZONE_TONE.apartment.soft)}
            >
              {apartment.numberOfBuilding}동
            </Badge>
          </button>
        </li>
      ))}
    </ul>
  );
}
