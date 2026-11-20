"use client";

import { type LucideIcon, ZoomIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { MapPlaceholder } from "@/components/map/map-placeholder";
import { usePublicZonesWithin } from "@/hooks/use-address";
import { useNaverMapLoader } from "@/hooks/use-naver-map-loader";
import { iconMarkup } from "@/lib/icon-markup";
import {
  getZoneStyle,
  PUBLIC_ZONE_ICONS,
  ZONE_STYLES,
  type ZoneStyle,
} from "@/lib/zone-style";
import { useMapStore } from "@/store/map-store";
import type {
  AddressItem,
  ApartmentItem,
  MapBounds,
  PublicZoneItem,
} from "@/types";

interface NaverMapProps {
  zoom?: number;
  addresses?: AddressItem[];
  apartments?: ApartmentItem[];
}

function isSmokingZone(divisionArea: string): boolean {
  return divisionArea.startsWith("SMOKING_ZONE");
}

// 마커 HTML은 구역 타입별로 한 번만 만든다
const markerContentCache = new Map<string, string>();

// icon을 넘기면 구역 색은 그대로 두고 아이콘만 바꾼다 (공공데이터 유형별 아이콘). 이때 cacheKey도 유형별로 넘긴다
function createMarkerContent(
  divisionArea: string,
  icon?: LucideIcon,
  cacheKey = divisionArea,
): string {
  const cached = markerContentCache.get(cacheKey);
  if (cached) return cached;

  const { icon: zoneIcon, stroke, dashed } = getZoneStyle(divisionArea);
  const svg = iconMarkup(icon ?? zoneIcon, {
    size: 20,
    className: "text-white",
    "aria-hidden": true,
  });

  // 배경은 stroke 색: 흰 아이콘 대비 3:1 이상 (fill 색은 초록·주황에서 미달). 비공식 구역은 점선 테두리
  const content = `<div class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-md${dashed ? " border-dashed" : ""}" style="background-color:${stroke}">${svg}</div>`;
  markerContentCache.set(cacheKey, content);
  return content;
}

// 지도 타일 위에서 테두리가 묻히지 않도록 불투명 + 굵게, 비공식 구역은 점선
function polygonStroke({ stroke, dashed }: ZoneStyle) {
  return {
    strokeColor: stroke,
    strokeOpacity: 1,
    strokeWeight: 3,
    strokeStyle: dashed ? "shortdash" : "solid",
  } as const;
}

// 메인 스레드에 제어권을 넘겨 입력/페인트가 끼어들 수 있게 함
function yieldToMain(): Promise<void> {
  const { scheduler } = globalThis as {
    scheduler?: { yield?: () => Promise<void> };
  };
  return scheduler?.yield
    ? scheduler.yield()
    : new Promise((resolve) => setTimeout(resolve, 0));
}

// 수백 개를 한 번에 만들면 긴 작업(long task)이 되므로 ~10ms씩 나눠 실행
async function runInChunks(tasks: (() => void)[], isCancelled: () => boolean) {
  let deadline = performance.now() + 10;
  for (const task of tasks) {
    if (performance.now() > deadline) {
      await yieldToMain();
      if (isCancelled()) return;
      deadline = performance.now() + 10;
    }
    task();
  }
}

// NAVER 지도 기본 배경색(라이트). 첫 타일 전에는 투명으로 두고 이후 이 값으로 되돌린다
const MAP_BACKGROUND = "#f8f9fa";
// 타일 이벤트가 오지 않아도(타일 오류 등) 이 시간이 지나면 구역 조회·그리기를 시작한다
const VIEW_READY_TIMEOUT_MS = 5000;

// 구역은 이 줌 이상에서만 그린다 (공공데이터가 전국 10만 건이라 축소 상태에서 다 그릴 수 없고, 직접 그린 구역도 맞춘다)
const ZONE_MIN_ZOOM = 16;
// 화면 범위를 약 500m 격자로 넓혀, 조금 움직여도 같은 쿼리 키(캐시)를 쓰게 한다
const BOUNDS_GRID = 0.005;

function snap(value: number, round: (x: number) => number): number {
  return Number((round(value / BOUNDS_GRID) * BOUNDS_GRID).toFixed(3));
}

function viewBounds(map: naver.maps.Map): MapBounds | null {
  if (map.getZoom() < ZONE_MIN_ZOOM) return null;
  const bounds = map.getBounds() as naver.maps.LatLngBounds;
  const sw = bounds.getSW();
  const ne = bounds.getNE();
  return {
    swLat: snap(sw.lat(), Math.floor),
    swLng: snap(sw.lng(), Math.floor),
    neLat: snap(ne.lat(), Math.ceil),
    neLng: snap(ne.lng(), Math.ceil),
  };
}

// 선택 카드(SelectedAddressCard)를 그대로 쓰기 위해 구역 형태로 바꾼다. id는 기존 구역과 겹치지 않게 음수
function publicZoneToAddress(zone: PublicZoneItem): AddressItem {
  return {
    id: -zone.id,
    addressName: zone.name,
    buildingName: zone.roadAddress ?? zone.scope ?? "",
    latitude: zone.latitude,
    longitude: zone.longitude,
    category: "NON_SMOKING",
    path: [],
  };
}

export function NaverMap({
  zoom = 17,
  addresses = [],
  apartments = [],
}: NaverMapProps) {
  const center = useMapStore((state) => state.center);
  const showNonSmoking = useMapStore((state) => state.showNonSmoking);
  const showSmoking = useMapStore((state) => state.showSmoking);
  const showApartments = useMapStore((state) => state.showApartments);
  const selectAddress = useMapStore((state) => state.selectAddress);
  const selectApartment = useMapStore((state) => state.selectApartment);

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [viewReady, setViewReady] = useState(false);
  const { data: publicZoneData } = usePublicZonesWithin(bounds);
  const { isLoaded, isError } = useNaverMapLoader();
  const t = useTranslations("map");

  // 지도 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: 생성 시점 center/zoom만 사용, 이후 변경은 아래 panTo/setZoom effect가 처리
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const newMap = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(center.lat, center.lng),
      zoom,
      // 첫 타일이 올 때까지 아래 자리표시자가 비치게 투명으로 시작 (NAVER는 # 또는 rgb로 시작해야 색으로 본다)
      background: "rgba(0,0,0,0)",
    });

    // 첫 화면 준비: 타일이 다 그려졌거나(tilesloaded), 그 전에 사용자가 지도를 움직였거나(idle), 시간이 지나면.
    // 자리표시자를 걷고 NAVER 기본 배경색으로 되돌린 뒤, 화면 범위 조회(공공데이터)와 구역 그리기를 시작한다
    let done = false;
    const markReady = () => {
      if (done) return;
      done = true;
      newMap.setOptions({ background: MAP_BACKGROUND });
      setViewReady(true);
    };
    const listeners = [
      naver.maps.Event.once(newMap, "tilesloaded", markReady),
      naver.maps.Event.once(newMap, "idle", markReady),
    ];
    const timer = window.setTimeout(markReady, VIEW_READY_TIMEOUT_MS);
    setMap(newMap);

    return () => {
      window.clearTimeout(timer);
      naver.maps.Event.removeListener(listeners);
    };
  }, [isLoaded]);

  // 중심 좌표 변경. 동작 줄이기 설정이면 애니메이션 없이 바로 이동 (register/page.tsx의 revealMap과 같은 방식)
  useEffect(() => {
    if (!map) return;
    const target = new naver.maps.LatLng(center.lat, center.lng);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // 축소 상태에서 목록의 구역을 고르면 구역이 안 그려지므로 보이는 줌까지 확대하며 이동
    if (reduce) {
      map.setCenter(target);
      if (map.getZoom() < ZONE_MIN_ZOOM) map.setZoom(ZONE_MIN_ZOOM, false);
    } else if (map.getZoom() < ZONE_MIN_ZOOM) map.morph(target, ZONE_MIN_ZOOM);
    else map.panTo(target);
  }, [map, center.lat, center.lng]);

  // 줌 변경
  useEffect(() => {
    if (!map) return;
    map.setZoom(zoom);
  }, [map, zoom]);

  // 이동·확대가 끝날 때마다(idle) 화면 범위 갱신. 격자가 같으면 이전 객체를 유지해 다시 그리지 않는다.
  // 첫 화면 타일이 준비된 뒤에 시작해, 공공데이터 요청·마커 생성이 첫 타일 로드와 겹치지 않게 한다
  useEffect(() => {
    if (!map || !viewReady) return;
    const update = () =>
      setBounds((prev) => {
        const next = viewBounds(map);
        return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
      });
    update();
    const listener = naver.maps.Event.addListener(map, "idle", update);
    return () => naver.maps.Event.removeListener(listener);
  }, [map, viewReady]);

  // 공공데이터 실외 금연구역 점 마커. bounds 대신 확대 여부만 의존해, 이동할 때는 새 데이터가 왔을 때 한 번만 다시 그린다
  const zoomedIn = bounds !== null;
  // shortcut: 범위가 바뀌면 전부 지우고 다시 만든다. 확대 상태라 수백 개 수준이며, 끊김이 보이면 id로 차이만 반영한다
  useEffect(() => {
    if (!map || !zoomedIn || !showNonSmoking || !publicZoneData) return;

    const markers: naver.maps.Marker[] = [];
    // 키보드 경로는 로빙 tabindex: 마커마다 Tab 정지점을 두면 하단 스택(선택 카드·주 CTA)까지 수백 번 Tab해야 하므로
    // Tab 정지점은 화면 안 마커 하나뿐이고, 방향키로 화면 안 마커 사이를 옮긴다 (북→남, 서→동 순)
    const items: { zone: PublicZoneItem; el: HTMLElement }[] = [];
    let hasTabStop = false;
    const inView = (zone: PublicZoneItem, bounds: naver.maps.LatLngBounds) =>
      bounds.hasLatLng(new naver.maps.LatLng(zone.latitude, zone.longitude));
    const view = map.getBounds() as naver.maps.LatLngBounds;
    const isVisible = (zone: PublicZoneItem) => inView(zone, view);
    // 같은 격자 안에서 지도를 옮기면 다시 그리지 않으므로, 움직임이 끝날 때 Tab 정지점이 화면 밖(또는 없음)이면 화면 안 첫 마커로 옮긴다
    const idleListener = naver.maps.Event.addListener(map, "idle", () => {
      const bounds = map.getBounds() as naver.maps.LatLngBounds;
      const current = items.find((item) => item.el.tabIndex === 0);
      if (current && inView(current.zone, bounds)) return;
      const next = items.find((item) => inView(item.zone, bounds));
      if (!next) return;
      if (current) current.el.tabIndex = -1;
      next.el.tabIndex = 0;
      hasTabStop = true;
    });
    const zones = [...publicZoneData.data].sort(
      (a, b) => b.latitude - a.latitude || a.longitude - b.longitude,
    );
    const tasks = zones.map((zone) => () => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(zone.latitude, zone.longitude),
        icon: {
          content: createMarkerContent(
            "NON_SMOKING_ZONE",
            PUBLIC_ZONE_ICONS[zone.zoneType],
            zone.zoneType,
          ),
          anchor: new naver.maps.Point(20, 20),
        },
        title: zone.name,
        map,
      });
      const select = () => selectAddress(publicZoneToAddress(zone));
      naver.maps.Event.addListener(marker, "click", select);
      // 키보드·스크린리더 경로 (공공 구역은 사이드바 목록에 없다). 이름은 데이터 원문(zone.name)이라 메시지 키가 필요 없다
      const el = marker.getElement();
      if (el) {
        // 첫 번째로 만든 화면 안 마커만 Tab 정지점
        const isTabStop = !hasTabStop && isVisible(zone);
        if (isTabStop) hasTabStop = true;
        el.tabIndex = isTabStop ? 0 : -1;
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", zone.name);
        el.setAttribute("lang", "ko");
        // 선택 카드가 닫힐 때, 다시 그려져 바뀐 마커 노드를 찾아 포커스를 돌려줄 수 있게 구역 id를 남긴다
        el.dataset.zoneMarker = String(zone.id);
        el.addEventListener("keydown", (e) => {
          const step =
            e.key === "ArrowRight" || e.key === "ArrowDown"
              ? 1
              : e.key === "ArrowLeft" || e.key === "ArrowUp"
                ? -1
                : 0;
          if (e.key !== "Enter" && e.key !== " " && !step) return;
          e.preventDefault();
          e.stopPropagation(); // 지도 keyboardShortcuts가 같은 키를 또 처리하지 않게
          if (!step) {
            select();
            return;
          }
          // 지금 화면 범위 안의 다음·이전 마커로 (격자로 넓힌 조회 범위라 화면 밖 마커도 있다)
          const bounds = map.getBounds() as naver.maps.LatLngBounds;
          const from = items.findIndex((item) => item.el === el);
          for (let i = from + step; i >= 0 && i < items.length; i += step) {
            if (inView(items[i].zone, bounds)) {
              items[i].el.focus();
              return;
            }
          }
        });
        // 화면 밖 마커에 포커스가 가면 브라우저가 지도 컨테이너를 스크롤해 판이 어긋나므로 되돌린다
        el.addEventListener("focus", () => {
          // 포커스를 받은 마커가 Tab 정지점이 된다 (클릭·방향키 모두)
          for (const item of items) item.el.tabIndex = item.el === el ? 0 : -1;
          const root = mapRef.current;
          for (
            let n = el.parentElement;
            n && root?.contains(n);
            n = n.parentElement
          ) {
            n.scrollTop = 0;
            n.scrollLeft = 0;
          }
        });
        items.push({ zone, el });
      }
      markers.push(marker);
    });

    let cancelled = false;
    runInChunks(tasks, () => cancelled);
    return () => {
      cancelled = true;
      naver.maps.Event.removeListener(idleListener);
      for (const marker of markers) marker.setMap(null);
    };
  }, [map, zoomedIn, showNonSmoking, publicZoneData, selectAddress]);

  // 마커 및 폴리곤 렌더링 (직접 그린 구역). 축소 상태에서는 그리지 않는다
  useEffect(() => {
    if (!map || !zoomedIn) return;

    const tasks: (() => void)[] = [];
    const overlays: (naver.maps.Marker | naver.maps.Polygon)[] = [];

    // 주소 마커 렌더링
    if (addresses.length > 0) {
      addresses.forEach((address) => {
        // 각 path의 divisionArea를 확인하여 흡연/금연 구역 판단
        const hasSmokingZone = address.path.some((p) =>
          isSmokingZone(p.divisionArea),
        );
        const hasNonSmokingZone = address.path.some(
          (p) => p.divisionArea === "NON_SMOKING_ZONE",
        );

        // 토글 상태에 따라 필터링
        if (hasSmokingZone && !hasNonSmokingZone && !showSmoking) return;
        if (hasNonSmokingZone && !hasSmokingZone && !showNonSmoking) return;

        // 폴리곤 생성 (각 path별로)
        address.path.forEach((pathItem) => {
          tasks.push(() => {
            const isSmoking = isSmokingZone(pathItem.divisionArea);

            // 토글 상태에 따라 개별 폴리곤 필터링
            if (isSmoking && !showSmoking) return;
            if (!isSmoking && !showNonSmoking) return;

            const lats = pathItem.pathsLatitude
              .split(",")
              .map((s) => parseFloat(s.trim()));
            const lngs = pathItem.pathsLongitude
              .split(",")
              .map((s) => parseFloat(s.trim()));

            if (lats.length !== lngs.length || lats.length < 3) return;

            const polygonPath = lats.map(
              (lat, i) => new naver.maps.LatLng(lat, lngs[i]),
            );

            const colors = getZoneStyle(pathItem.divisionArea);

            // 클릭된 구역의 divisionArea를 기반으로 카테고리 결정
            const handleClick = () =>
              selectAddress({
                ...address,
                category: isSmoking ? "SMOKING" : "NON_SMOKING",
              });

            const polygon = new naver.maps.Polygon({
              paths: [polygonPath],
              ...polygonStroke(colors),
              fillColor: colors.fill,
              fillOpacity: 0.4,
              clickable: true,
              map,
            });

            naver.maps.Event.addListener(polygon, "click", handleClick);

            overlays.push(polygon);

            // 마커 생성 (폴리곤 중심에)
            const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
            const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

            const overlay = new naver.maps.Marker({
              position: new naver.maps.LatLng(centerLat, centerLng),
              icon: {
                content: createMarkerContent(pathItem.divisionArea),
                anchor: new naver.maps.Point(20, 20),
              },
              map,
            });

            naver.maps.Event.addListener(overlay, "click", handleClick);

            overlays.push(overlay);
          });
        });
      });
    }

    // 아파트 마커 렌더링
    if (apartments.length > 0 && showApartments) {
      apartments.forEach((apartment) => {
        apartment.path.forEach((pathItem) => {
          tasks.push(() => {
            // pathsLat, pathsLng를 파싱
            const lats = pathItem.pathsLat
              .split(",")
              .map((s) => parseFloat(s.trim()));
            const lngs = pathItem.pathsLng
              .split(",")
              .map((s) => parseFloat(s.trim()));

            if (lats.length !== lngs.length || lats.length < 3) return;

            const polygonPath = lats.map(
              (lat, i) => new naver.maps.LatLng(lat, lngs[i]),
            );

            const polygon = new naver.maps.Polygon({
              paths: [polygonPath],
              ...polygonStroke(ZONE_STYLES.APARTMENT),
              fillColor: ZONE_STYLES.APARTMENT.fill,
              fillOpacity: 0.3,
              clickable: true,
              map,
            });

            naver.maps.Event.addListener(polygon, "click", () =>
              selectApartment(apartment),
            );

            overlays.push(polygon);

            // 마커 생성 (폴리곤 중심에)
            const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
            const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

            const overlay = new naver.maps.Marker({
              position: new naver.maps.LatLng(centerLat, centerLng),
              icon: {
                content: createMarkerContent("APARTMENT"),
                anchor: new naver.maps.Point(20, 20),
              },
              map,
            });

            naver.maps.Event.addListener(overlay, "click", () =>
              selectApartment(apartment),
            );

            overlays.push(overlay);
          });
        });
      });
    }

    let cancelled = false;
    runInChunks(tasks, () => cancelled);

    // 토글 변경·언마운트(사이드바 접힘 시 key 리마운트 포함) 시 남은 작업 중단 및 오버레이 제거
    return () => {
      cancelled = true;
      for (const overlay of overlays) overlay.setMap(null);
    };
  }, [
    map,
    zoomedIn,
    addresses,
    apartments,
    showNonSmoking,
    showSmoking,
    showApartments,
    selectAddress,
    selectApartment,
  ]);

  // NAVER 내부 컨트롤의 z-index가 시트·다이얼로그 위로 새지 않도록 쌓임 맥락을 가둔다.
  // 지도 div는 처음부터 같은 크기로 두고(레이아웃 이동 없음), 첫 타일 전까지 뒤에 자리표시자를 깐다
  return (
    <>
      {/* 하나의 안정된 live region. 같은 노드 안에서 문구가 "불러오는 중"(또는 로드 실패)에서 확대 안내로 바뀌어 읽힌다.
          지도 div보다 앞에 있어야 지도가 자리표시자 위에 그려진다 */}
      <div role="status">
        {!viewReady && (
          <MapPlaceholder
            label={isError ? t("loadError") : t("loading")}
            isError={isError}
          />
        )}
        {/* 필터 칩(top-2, 높이 약 3.5rem) 바로 아래. 구역은 ZONE_MIN_ZOOM 이상에서만 그린다 */}
        {map && viewReady && !zoomedIn && (
          <p className="pointer-events-none absolute top-16 left-1/2 z-20 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-foreground text-sm shadow-md">
            <ZoomIn aria-hidden className="size-4" strokeWidth={1.5} />
            {t("zoomInHint")}
          </p>
        )}
      </div>
      <div ref={mapRef} className="isolate h-full w-full" />
    </>
  );
}
