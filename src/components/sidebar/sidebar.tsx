"use client";

import {
  Activity,
  Building2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Info,
  List,
  MapPin,
  MapPinned,
  MapPinPlus,
  MessageSquarePlus,
  PanelLeft,
  PanelLeftClose,
  Receipt,
  Scale,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { categoryGroup, ZONE_TONE } from "@/components/home/zone-tone";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { ZoneLegend } from "@/components/map/zone-legend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ZONE_GROUPS } from "@/lib/zone-style";
import { useMapStore } from "@/store/map-store";
import type { AddressItem, ApartmentItem } from "@/types";

type Snap = "peek" | "half" | "full";

// 시트 높이는 100dvh-4rem 고정, 스냅은 translate로만 바꾼다(높이 애니메이션 금지).
// half에서는 화면 밖으로 밀린 만큼 내부 스크롤 하단 여백(pad)을 줘서 끝까지 스크롤되게 한다.
// peek 5.25rem(84px) = 손잡이 + 헤더(브랜드·h1·한 줄 소개). page.tsx 하단 스택도 같은 값을 쓴다
const SNAP_STYLE: Record<Snap, { y: string; pad: string }> = {
  peek: { y: "calc(100% - 5.25rem - env(safe-area-inset-bottom))", pad: "0px" },
  half: { y: "calc(100% - 50dvh)", pad: "calc(50dvh - 4rem)" },
  full: { y: "0px", pad: "0px" },
};
const NEXT_SNAP: Record<Snap, Snap> = {
  peek: "half",
  half: "full",
  full: "peek",
};

/** 목록 하나의 조회 상태. 목록마다 따로 받아 한쪽 실패가 다른 쪽 표시에 번지지 않게 한다 */
export interface ListState {
  /** 데이터 없이 가져오는 중 */
  isLoading: boolean;
  isError: boolean;
  /** react-query refetch. 결과로 성공 여부를 보고 포커스를 옮긴다 */
  onRetry: () => Promise<{ isError: boolean }>;
}

interface SidebarProps {
  addresses: AddressItem[];
  apartments: ApartmentItem[];
  addressState: ListState;
  apartmentState: ListState;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onFeedbackClick: () => void;
  onVersionClick: () => void;
}

// 콘텐츠는 한 번만 렌더하고 CSS로 배치만 바꾼다: <lg 바텀 시트, ≥lg 왼쪽 사이드바 (SEO용 h1·소개 문구 중복 방지)
export function Sidebar({
  addresses,
  apartments,
  addressState,
  apartmentState,
  isCollapsed,
  onCollapsedChange,
  onFeedbackClick,
  onVersionClick,
}: SidebarProps) {
  const t = useTranslations("sidebar");
  const [snap, setSnap] = useState<Snap>("peek");
  const [dragY, setDragY] = useState<number | null>(null);
  const dragStartY = useRef(0);
  const sheetRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const peekHeight = useRef(84);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const collapseRef = useRef<HTMLButtonElement>(null);
  const reopenRef = useRef<HTMLButtonElement>(null);
  // 접기/펼치기 버튼은 누르면 숨겨지거나 사라지므로, 키보드 포커스를 반대편 버튼으로 옮긴다 (첫 렌더에는 옮기지 않음)
  const restoreFocus = useRef(false);
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

  useEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    (isCollapsed ? reopenRef : collapseRef).current?.focus();
  }, [isCollapsed]);

  const setCollapsed = (next: boolean) => {
    restoreFocus.current = true;
    onCollapsedChange(next);
  };

  // peek에서 보이는 높이(84px + 하단 안전 영역). peek일 때 헤더 높이가 곧 그 값이라 그때 잰다
  useEffect(() => {
    if (snap === "peek" && headerRef.current)
      peekHeight.current = headerRef.current.offsetHeight;
  }, [snap]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    if ((e.target as HTMLElement).closest("button, a, select")) return;
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
      peek: peekHeight.current,
      half: window.innerHeight / 2,
      full: sheet.offsetHeight,
    };
    const nearest = (Object.keys(heights) as Snap[]).reduce((a, b) =>
      Math.abs(heights[a] - visible) <= Math.abs(heights[b] - visible) ? a : b,
    );
    setSnap(nearest);
  };

  // 드래그 중에도 가장 바깥 스냅(full~peek) 사이에서만 움직인다
  const sheetY =
    dragY === null
      ? SNAP_STYLE[snap].y
      : `clamp(0px, calc(${SNAP_STYLE[snap].y} + ${dragY}px), ${SNAP_STYLE.peek.y})`;

  return (
    <>
      <aside
        ref={sheetRef}
        aria-label={t("panelLabel")}
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
          "fixed right-[env(safe-area-inset-right)] bottom-0 left-[env(safe-area-inset-left)] z-30 flex h-[calc(100dvh-4rem)] translate-y-(--sheet-y) flex-col overflow-hidden rounded-t-2xl border-t bg-background shadow-lg",
          dragY === null &&
            "transition-transform duration-200 ease-out motion-reduce:transition-none",
          "lg:relative lg:inset-auto lg:z-auto lg:h-full lg:w-95 lg:shrink-0 lg:translate-y-0 lg:rounded-none lg:border-t-0 lg:border-r lg:shadow-none",
          isCollapsed && "lg:hidden",
        )}
      >
        {/* 헤더: 모바일에서는 시트 손잡이(드래그·탭) 겸 peek 요약 줄 */}
        {/* peek은 5.25rem + 하단 안전 영역만큼 보이므로, 그 높이를 헤더 아래 여백으로 채워 본문(탭 목록)이 홈 인디케이터 줄에 반쯤 걸치지 않게 한다 */}
        <div
          ref={headerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setDragY(null)}
          className={cn(
            "shrink-0 touch-none select-none px-4 pt-2 pb-2.5 lg:touch-auto lg:select-auto lg:p-5",
            snap === "peek" &&
              "pb-[calc(0.625rem+env(safe-area-inset-bottom))]",
          )}
        >
          <div
            aria-hidden
            className="mx-auto mb-1.5 h-1 w-10 rounded-full bg-muted-foreground/40 lg:hidden"
          />
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary p-1.5">
              <Image src="/logo.svg" alt="" width={28} height={28} />
            </span>
            {/* 브랜드 → h1(무엇을 하는 지도인지) → 한 줄 소개. 접힌 모바일 시트(peek)에서는 세 줄이 84px 안에 들어가도록
                각 줄 높이를 고정하고 자른다(16+20+20px). 펼치면(half·full) 줄바꿈해 전체 문구를 보여준다. 데스크톱은 항상 줄바꿈 */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-muted-foreground text-xs leading-4 tracking-tight">
                CleanBreath
              </p>
              <h1
                className={cn(
                  "font-bold text-base leading-5 tracking-tight lg:whitespace-normal lg:text-lg lg:leading-snug",
                  snap === "peek" && "truncate",
                )}
              >
                {t("title")}
              </h1>
              <p
                className={cn(
                  "text-muted-foreground text-sm leading-5 lg:mt-0.5 lg:whitespace-normal",
                  snap === "peek" && "truncate",
                )}
              >
                {t("tagline")}
              </p>
            </div>
            <LocaleSwitcher iconOnly />
            <Button
              ref={toggleRef}
              variant="ghost"
              size="icon-touch"
              className="shrink-0 lg:hidden"
              onClick={() => setSnap(NEXT_SNAP[snap])}
              aria-expanded={snap !== "peek"}
              aria-controls={bodyId}
              aria-label={
                snap === "full" ? t("collapsePanel") : t("expandPanel")
              }
            >
              {snap === "full" ? (
                <ChevronDown aria-hidden />
              ) : (
                <ChevronUp aria-hidden />
              )}
            </Button>
            <Button
              ref={collapseRef}
              variant="ghost"
              size="icon-touch"
              className="hidden shrink-0 lg:inline-flex"
              onClick={() => setCollapsed(true)}
              aria-label={t("collapseSidebar")}
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
                {t("tabs.info")}
              </TabsTrigger>
              <TabsTrigger value="list">
                <List aria-hidden />
                {t("tabs.list")}
              </TabsTrigger>
              <TabsTrigger value="apartments">
                <Building2 aria-hidden />
                {t("tabs.apartments")}
              </TabsTrigger>
            </TabsList>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-(--sheet-pad) lg:pb-0">
              <TabsContent value="info" className="p-4">
                <ServiceInfo />
              </TabsContent>

              <TabsContent value="list" className="p-2">
                <AddressList
                  addresses={addresses}
                  state={addressState}
                  onItemClick={selectAddress}
                />
              </TabsContent>

              <TabsContent value="apartments" className="p-2">
                <ApartmentList
                  apartments={apartments}
                  state={apartmentState}
                  onItemClick={selectApartment}
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* 보조 동작 메뉴 (피드백·버전 정보·구역 등록) */}
          <nav
            ref={navRef}
            aria-label={t("nav.label")}
            className="grid shrink-0 grid-cols-3 gap-2 border-t p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:pb-4"
          >
            <Button
              variant="outline"
              size="touch"
              className="px-2"
              onClick={onFeedbackClick}
            >
              <MessageSquarePlus aria-hidden />
              {t("nav.feedback")}
            </Button>
            <Button variant="outline" size="touch" className="px-2" asChild>
              <Link href="/register">
                <MapPinPlus aria-hidden />
                {t("nav.register")}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="touch"
              className="px-2"
              onClick={onVersionClick}
            >
              <Info aria-hidden />
              {t("nav.version")}
            </Button>
          </nav>
        </div>
      </aside>

      {/* 데스크톱: 사이드바를 접었을 때 다시 여는 버튼 (상단은 필터 칩 영역이라 좌하단, NAVER 로고 줄 위) */}
      {isCollapsed && (
        <Button
          ref={reopenRef}
          variant="outline"
          size="touch"
          className="fixed bottom-10 left-4 z-20 hidden bg-background shadow-md lg:inline-flex"
          onClick={() => setCollapsed(false)}
        >
          <PanelLeft aria-hidden />
          {t("openMenu")}
        </Button>
      )}
    </>
  );
}

// 문장 속 링크: 터치 기기에서는 세로 패딩으로 누르는 영역만 44px 안팎으로 넓힌다 (인라인 요소라 줄 간격은 그대로)
const linkClass =
  "text-primary underline underline-offset-2 pointer-coarse:py-3";

const MORE_LINKS = [
  { href: "/zones/seoul", icon: MapPinned, key: "zonesSeoul" },
  { href: "/zones/anyang", icon: MapPin, key: "zonesAnyang" },
  { href: "/guide/fine", icon: Receipt, key: "guideFine" },
  { href: "/guide/apartment", icon: Building2, key: "guideApartment" },
  { href: "/statute", icon: Scale, key: "statute" },
  { href: "/about", icon: Info, key: "about" },
  { href: "/health", icon: Activity, key: "health" },
  { href: "/privacy", icon: ShieldCheck, key: "privacy" },
] as const;

function ServiceInfo() {
  const t = useTranslations("sidebar.info");
  const link = (href: string) => (chunks: React.ReactNode) => (
    <Link href={href} className={linkClass}>
      {chunks}
    </Link>
  );

  return (
    // 행 길이 제한(max-w-lg)은 영어 산문(소개·사용법)에만 건다. 범례·더 보기 목록은 탭 목록과 같은 전체 폭 (콘텐츠 페이지의 :lang(en) 규칙과 같은 기준)
    <div className="space-y-6 text-base leading-relaxed lg:text-sm">
      <section>
        <h2 className="mb-2 text-base font-semibold">{t("aboutTitle")}</h2>
        <div className="space-y-2 text-muted-foreground [&:lang(en)]:max-w-lg">
          <p>{t("about1")}</p>
          <p>
            {t.rich("about2", {
              register: link("/register"),
              board: link("/board"),
            })}
          </p>
          <p>
            {t.rich("about3", {
              statute: link("/statute"),
              about: link("/about"),
            })}
          </p>
          <p className="text-sm">
            {t.rich("dataSource", { sources: link("/about#data-sources") })}
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">{t("howToTitle")}</h2>
        <ol className="space-y-2 [&:lang(en)]:max-w-lg">
          {(t.raw("howTo") as string[]).map((text, i) => (
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
        <h2 className="mb-2 text-base font-semibold">{t("legendTitle")}</h2>
        <ZoneLegend />
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">{t("moreTitle")}</h2>
        {/* 목록은 자식을 자르지 않으므로(포커스 링 보존) 첫·마지막 행의 hover 배경에 안쪽 반경(12-1px)을 준다 */}
        <ul className="divide-y rounded-lg border [&>li:first-child>a]:rounded-t-[calc(var(--radius-lg)_-_1px)] [&>li:last-child>a]:rounded-b-[calc(var(--radius-lg)_-_1px)]">
          {MORE_LINKS.map(({ href, icon: Icon, key }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex min-h-11 items-center gap-3 p-3 hover:bg-accent"
              >
                <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">
                    {t(`more.${key}.title`)}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {t(`more.${key}.desc`)}
                  </span>
                </span>
                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.5}
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

// 실패(다시 시도) → 불러오는 중 → 빈 목록.
// v5는 데이터 없는 쿼리를 다시 가져오면 status를 'pending'으로 되돌려 isError가 곧바로 false가 되므로,
// 재시도 중임을 따로 기억해 실패 화면(누른 버튼)을 그대로 두고 버튼 문구만 바꾼다 (스피너로 바꾸면 포커스가 body로 떨어짐)
function ListStatus({ state }: { state: ListState }) {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const [retrying, setRetrying] = useState(false);

  const retry = async () => {
    // aria-disabled는 클릭을 막지 않으므로 재시도 중 중복 요청은 여기서 막는다
    if (retrying) return;
    // 성공하면 이 상태 영역이 목록으로 바뀌어 사라지므로, 감싼 탭 패널(포커스 가능)로 포커스를 옮긴다
    const panel = ref.current?.closest<HTMLElement>('[role="tabpanel"]');
    setRetrying(true);
    try {
      const result = await state.onRetry();
      if (!result.isError) panel?.focus();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div
      ref={ref}
      className="flex min-h-40 flex-col items-center justify-center gap-3 text-center"
      role="status"
    >
      {state.isError || retrying ? (
        <>
          <p className="text-sm text-muted-foreground">
            {t("sidebar.loadError")}
          </p>
          <Button
            variant="outline"
            size="touch"
            // 누른 버튼에 포커스가 남도록 disabled 대신 aria-disabled와 핸들러 가드로 막는다
            aria-disabled={retrying || undefined}
            onClick={retry}
          >
            {retrying ? t("common.loading") : t("common.retry")}
          </Button>
        </>
      ) : state.isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent motion-reduce:animate-none" />
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        </div>
      ) : (
        <p className="text-muted-foreground">{t("sidebar.empty")}</p>
      )}
    </div>
  );
}

const rowClass =
  "flex min-h-11 w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-accent";

interface AddressListProps {
  addresses: AddressItem[];
  state: ListState;
  onItemClick: (address: AddressItem) => void;
}

function AddressList({ addresses, state, onItemClick }: AddressListProps) {
  const t = useTranslations("sidebar.badge");
  if (state.isLoading || !addresses.length) return <ListStatus state={state} />;

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
              <span lang="ko" className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {address.addressName}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {address.buildingName}
                </span>
              </span>
              <Badge variant="outline" className={ZONE_TONE[group].soft}>
                {group === "smoking" ? t("smoking") : t("nonSmoking")}
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
  state: ListState;
  onItemClick: (apartment: ApartmentItem) => void;
}

function ApartmentList({ apartments, state, onItemClick }: ApartmentListProps) {
  const t = useTranslations("sidebar");
  if (state.isLoading || !apartments.length)
    return <ListStatus state={state} />;

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
            <span lang="ko" className="min-w-0 flex-1">
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
              {t("buildingCount", { count: apartment.numberOfBuilding })}
            </Badge>
          </button>
        </li>
      ))}
    </ul>
  );
}
