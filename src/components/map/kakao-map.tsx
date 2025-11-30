"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { renderToString } from "react-dom/server";
import { Cigarette, CigaretteOff } from "lucide-react";
import type { AddressItem } from "@/types";

interface KakaoMapProps {
  center: { lat: number; lng: number };
  level?: number;
  addresses?: AddressItem[];
  showNonSmoking?: boolean;
  showSmoking?: boolean;
  onMarkerClick?: (address: AddressItem) => void;
}

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY || "";

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

export function KakaoMap({
  center,
  level = 3,
  addresses = [],
  showNonSmoking = true,
  showSmoking = false,
  onMarkerClick,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overlaysRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polygonsRef = useRef<any[]>([]);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    if (window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services,clusterer`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => setIsLoaded(true));
    };
    document.head.appendChild(script);
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),
      level,
    };

    const newMap = new window.kakao.maps.Map(mapRef.current, options);
    setMap(newMap);
  }, [isLoaded]);

  // 중심 좌표 변경
  useEffect(() => {
    if (!map) return;
    map.panTo(new window.kakao.maps.LatLng(center.lat, center.lng));
  }, [map, center.lat, center.lng]);

  // 레벨 변경
  useEffect(() => {
    if (!map) return;
    map.setLevel(level);
  }, [map, level]);

  // 마커 및 폴리곤 렌더링
  const renderMarkers = useCallback(() => {
    if (!map) return;

    // 기존 오버레이/폴리곤 제거
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    polygonsRef.current.forEach((polygon) => polygon.setMap(null));
    overlaysRef.current = [];
    polygonsRef.current = [];

    if (!addresses.length) return;

    addresses.forEach((address) => {
      // 각 path의 divisionArea를 확인하여 흡연/금연 구역 판단
      const hasSmokingZone = address.path.some((p) =>
        isSmokingZone(p.divisionArea)
      );
      const hasNonSmokingZone = address.path.some(
        (p) => p.divisionArea === "NON_SMOKING_ZONE"
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
          (lat, i) => new window.kakao.maps.LatLng(lat, lngs[i])
        );

        const colors = getZoneColor(pathItem.divisionArea);

        const polygon = new window.kakao.maps.Polygon({
          path: polygonPath,
          strokeWeight: 2,
          strokeColor: colors.stroke,
          strokeOpacity: 0.9,
          fillColor: colors.fill,
          fillOpacity: 0.4,
          map,
        });

        window.kakao.maps.event.addListener(polygon, "click", () => {
          onMarkerClick?.(address);
        });

        polygonsRef.current.push(polygon);

        // 마커 생성 (폴리곤 중심에)
        const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        const markerPosition = new window.kakao.maps.LatLng(
          centerLat,
          centerLng
        );

        const content = document.createElement("div");
        content.innerHTML = createMarkerContent(pathItem.divisionArea);
        content.style.cursor = "pointer";
        content.onclick = () => onMarkerClick?.(address);

        const overlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content,
          yAnchor: 0.5,
          xAnchor: 0.5,
        });

        overlay.setMap(map);
        overlaysRef.current.push(overlay);
      });
    });
  }, [map, addresses, showNonSmoking, showSmoking, onMarkerClick]);

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
