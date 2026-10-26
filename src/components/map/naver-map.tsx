"use client";

import { ZoomIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { usePublicZonesWithin } from "@/hooks/use-address";
import { useNaverMapLoader } from "@/hooks/use-naver-map-loader";
import { getZoneStyle, ZONE_STYLES, type ZoneStyle } from "@/lib/zone-style";
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

// renderToString은 비싸므로 마커마다 호출하지 않고 구역 타입별로 한 번만 생성
const markerContentCache = new Map<string, string>();

function createMarkerContent(divisionArea: string): string {
  const cached = markerContentCache.get(divisionArea);
  if (cached) return cached;

  const { icon: Icon, stroke, dashed } = getZoneStyle(divisionArea);

  // 배경은 stroke 색: 흰 아이콘 대비 3:1 이상 (fill 색은 초록·주황에서 미달). 비공식 구역은 점선 테두리
  const content = renderToString(
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-md ${dashed ? "border-dashed" : ""}`}
      style={{ backgroundColor: stroke }}
    >
      <Icon size={20} className="text-white" aria-hidden />
    </div>,
  );
  markerContentCache.set(divisionArea, content);
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

// 공공데이터 점은 이 줌 이상에서만 불러온다 (서울만 1만 건이라 축소 상태에서 다 그릴 수 없다)
const PUBLIC_ZONE_MIN_ZOOM = 16;
// 화면 범위를 약 500m 격자로 넓혀, 조금 움직여도 같은 쿼리 키(캐시)를 쓰게 한다
const BOUNDS_GRID = 0.005;

function snap(value: number, round: (x: number) => number): number {
  return Number((round(value / BOUNDS_GRID) * BOUNDS_GRID).toFixed(3));
}

function viewBounds(map: naver.maps.Map): MapBounds | null {
  if (map.getZoom() < PUBLIC_ZONE_MIN_ZOOM) return null;
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
  const { data: publicZoneData } = usePublicZonesWithin(bounds);
  const isLoaded = useNaverMapLoader();
  const t = useTranslations("map");

  // 지도 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: 생성 시점 center/zoom만 사용, 이후 변경은 아래 panTo/setZoom effect가 처리
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const newMap = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(center.lat, center.lng),
      zoom,
    });
    setMap(newMap);
  }, [isLoaded]);

  // 중심 좌표 변경
  useEffect(() => {
    if (!map) return;
    map.panTo(new naver.maps.LatLng(center.lat, center.lng));
  }, [map, center.lat, center.lng]);

  // 줌 변경
  useEffect(() => {
    if (!map) return;
    map.setZoom(zoom);
  }, [map, zoom]);

  // 이동·확대가 끝날 때마다 화면 범위 갱신. 격자가 같으면 이전 객체를 유지해 다시 그리지 않는다
  useEffect(() => {
    if (!map) return;
    const update = () =>
      setBounds((prev) => {
        const next = viewBounds(map);
        return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
      });
    update();
    const listener = naver.maps.Event.addListener(map, "idle", update);
    return () => naver.maps.Event.removeListener(listener);
  }, [map]);

  // 공공데이터 실외 금연구역 점 마커. bounds 대신 확대 여부만 의존해, 이동할 때는 새 데이터가 왔을 때 한 번만 다시 그린다
  const zoomedIn = bounds !== null;
  // shortcut: 범위가 바뀌면 전부 지우고 다시 만든다. 확대 상태라 수백 개 수준이며, 끊김이 보이면 id로 차이만 반영한다
  useEffect(() => {
    if (!map || !zoomedIn || !showNonSmoking || !publicZoneData) return;

    const markers: naver.maps.Marker[] = [];
    const tasks = publicZoneData.data.map((zone) => () => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(zone.latitude, zone.longitude),
        icon: {
          content: createMarkerContent("NON_SMOKING_ZONE"),
          anchor: new naver.maps.Point(20, 20),
        },
        title: zone.name,
        map,
      });
      naver.maps.Event.addListener(marker, "click", () =>
        selectAddress(publicZoneToAddress(zone)),
      );
      markers.push(marker);
    });

    let cancelled = false;
    runInChunks(tasks, () => cancelled);
    return () => {
      cancelled = true;
      for (const marker of markers) marker.setMap(null);
    };
  }, [map, zoomedIn, showNonSmoking, publicZoneData, selectAddress]);

  // 마커 및 폴리곤 렌더링 (직접 그린 구역)
  useEffect(() => {
    if (!map) return;

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
    addresses,
    apartments,
    showNonSmoking,
    showSmoking,
    showApartments,
    selectAddress,
    selectApartment,
  ]);

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  // NAVER 내부 컨트롤의 z-index가 시트·다이얼로그 위로 새지 않도록 쌓임 맥락을 가둔다
  return (
    <>
      <div ref={mapRef} className="isolate h-full w-full" />
      {/* 필터 칩(top-2, 높이 약 3.5rem) 바로 아래. 공공데이터 점은 PUBLIC_ZONE_MIN_ZOOM 이상에서만 그린다 */}
      {map && !zoomedIn && showNonSmoking && (
        <p
          role="status"
          className="pointer-events-none absolute top-16 left-1/2 z-20 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-foreground text-sm shadow-md"
        >
          <ZoomIn aria-hidden className="size-4" />
          {t("zoomInHint")}
        </p>
      )}
    </>
  );
}
