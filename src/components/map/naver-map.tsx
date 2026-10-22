"use client";

import { Building2, Cigarette, CigaretteOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { useNaverMapLoader } from "@/hooks/use-naver-map-loader";
import { useMapStore } from "@/store/map-store";
import type { AddressItem, ApartmentItem } from "@/types";

interface NaverMapProps {
  zoom?: number;
  addresses?: AddressItem[];
  apartments?: ApartmentItem[];
}

// 구역 타입별 색상 정의
const ZONE_COLORS = {
  NON_SMOKING_ZONE: {
    fill: "#22C55E",
    stroke: "#16A34A",
    markerBg: "bg-green-500",
  },
  SMOKING_ZONE_OPEN: {
    fill: "#F97316",
    stroke: "#EA580C",
    markerBg: "bg-orange-500",
  },
  SMOKING_ZONE_OPEN_IMPLICIT: {
    fill: "#FB923C",
    stroke: "#F97316",
    markerBg: "bg-orange-400",
  },
  SMOKING_ZONE_CLOSE: {
    fill: "#EF4444",
    stroke: "#DC2626",
    markerBg: "bg-red-500",
  },
  SMOKING_ZONE_CLOSE_IMPLICIT: {
    fill: "#F87171",
    stroke: "#EF4444",
    markerBg: "bg-red-400",
  },
  SMOKING_ZONE_LINE: {
    fill: "#A855F7",
    stroke: "#9333EA",
    markerBg: "bg-purple-500",
  },
  SMOKING_ZONE_LINE_IMPLICIT: {
    fill: "#C084FC",
    stroke: "#A855F7",
    markerBg: "bg-purple-400",
  },
} as const;

type ZoneType = keyof typeof ZONE_COLORS;

function getZoneColor(divisionArea: string) {
  return (
    ZONE_COLORS[divisionArea as ZoneType] || ZONE_COLORS.SMOKING_ZONE_CLOSE
  );
}

function isSmokingZone(divisionArea: string): boolean {
  return divisionArea.startsWith("SMOKING_ZONE");
}

// renderToString은 비싸므로 마커마다 호출하지 않고 구역 타입별로 한 번만 생성
const markerContentCache = new Map<string, string>();

function createMarkerContent(divisionArea: string): string {
  const cached = markerContentCache.get(divisionArea);
  if (cached) return cached;

  const isSmoking = isSmokingZone(divisionArea);
  const colors = getZoneColor(divisionArea);

  const icon = isSmoking ? (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white ${colors.markerBg} shadow-lg`}
    >
      <Cigarette size={20} className="text-white" />
    </div>
  ) : (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white ${colors.markerBg} shadow-lg`}
    >
      <CigaretteOff size={20} className="text-white" />
    </div>
  );

  const content = renderToString(icon);
  markerContentCache.set(divisionArea, content);
  return content;
}

let apartmentMarkerContent: string | undefined;

function getApartmentMarkerContent(): string {
  apartmentMarkerContent ??= renderToString(
    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-lg">
      <Building2 size={20} className="text-white" />
    </div>,
  );
  return apartmentMarkerContent;
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
  const isLoaded = useNaverMapLoader();

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

  // 마커 및 폴리곤 렌더링
  // 수백 개를 한 번에 만들면 긴 작업(long task)이 되므로 경로별 작업으로 모아 ~10ms씩 나눠 실행
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

            const colors = getZoneColor(pathItem.divisionArea);

            // 클릭된 구역의 divisionArea를 기반으로 카테고리 결정
            const handleClick = () =>
              selectAddress({
                ...address,
                category: isSmoking ? "SMOKING" : "NON_SMOKING",
              });

            const polygon = new naver.maps.Polygon({
              paths: [polygonPath],
              strokeWeight: 2,
              strokeColor: colors.stroke,
              strokeOpacity: 0.9,
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

            // 아파트는 파란색 계열로 표시
            const polygon = new naver.maps.Polygon({
              paths: [polygonPath],
              strokeWeight: 2,
              strokeColor: "#2563EB",
              strokeOpacity: 0.9,
              fillColor: "#3B82F6",
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
                content: getApartmentMarkerContent(),
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
    (async () => {
      let deadline = performance.now() + 10;
      for (const task of tasks) {
        if (performance.now() > deadline) {
          await yieldToMain();
          if (cancelled) return;
          deadline = performance.now() + 10;
        }
        task();
      }
    })();

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
        <p className="text-muted-foreground">지도를 불러오는 중...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full" />;
}
