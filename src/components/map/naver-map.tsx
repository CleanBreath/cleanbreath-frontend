"use client";

import { Building2, Cigarette, CigaretteOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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

function createMarkerContent(divisionArea: string): string {
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

  return renderToString(icon);
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
  const overlaysRef = useRef<naver.maps.Marker[]>([]);
  const polygonsRef = useRef<naver.maps.Polygon[]>([]);

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
  const renderMarkers = useCallback(() => {
    if (!map) return;

    // 기존 오버레이/폴리곤 제거
    overlaysRef.current.forEach((overlay) => {
      overlay.setMap(null);
    });
    polygonsRef.current.forEach((polygon) => {
      polygon.setMap(null);
    });
    overlaysRef.current = [];
    polygonsRef.current = [];

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

          polygonsRef.current.push(polygon);

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

          overlaysRef.current.push(overlay);
        });
      });
    }

    // 아파트 마커 렌더링
    if (apartments.length > 0 && showApartments) {
      apartments.forEach((apartment) => {
        apartment.path.forEach((pathItem) => {
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

          polygonsRef.current.push(polygon);

          // 마커 생성 (폴리곤 중심에)
          const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
          const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

          const overlay = new naver.maps.Marker({
            position: new naver.maps.LatLng(centerLat, centerLng),
            icon: {
              content: renderToString(
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-lg">
                  <Building2 size={20} className="text-white" />
                </div>,
              ),
              anchor: new naver.maps.Point(20, 20),
            },
            map,
          });

          naver.maps.Event.addListener(overlay, "click", () =>
            selectApartment(apartment),
          );

          overlaysRef.current.push(overlay);
        });
      });
    }
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

  useEffect(() => {
    renderMarkers();
  }, [renderMarkers]);

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p className="text-muted-foreground">지도를 불러오는 중...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full" />;
}
