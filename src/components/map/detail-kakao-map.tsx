"use client";

import { useEffect, useRef, useState } from "react";
import { useKakaoMapLoader } from "@/hooks/use-kakao-map-loader";
import type { SmokingAreaPath } from "@/types";

// 구역 타입별 색상 정의 (기존 kakao-map.tsx 패턴 동일)
const ZONE_COLORS = {
  NON_SMOKING_ZONE: { fill: "#22C55E", stroke: "#16A34A" },
  SMOKING_ZONE_OPEN: { fill: "#F97316", stroke: "#EA580C" },
  SMOKING_ZONE_OPEN_IMPLICIT: { fill: "#FB923C", stroke: "#F97316" },
  SMOKING_ZONE_CLOSE: { fill: "#EF4444", stroke: "#DC2626" },
  SMOKING_ZONE_CLOSE_IMPLICIT: { fill: "#F87171", stroke: "#EF4444" },
  SMOKING_ZONE_LINE: { fill: "#A855F7", stroke: "#9333EA" },
  SMOKING_ZONE_LINE_IMPLICIT: { fill: "#C084FC", stroke: "#A855F7" },
} as const;

type ZoneType = keyof typeof ZONE_COLORS;

function getZoneColor(divisionArea: string) {
  return (
    ZONE_COLORS[divisionArea as ZoneType] || ZONE_COLORS.SMOKING_ZONE_CLOSE
  );
}

interface DetailKakaoMapProps {
  latitude: number;
  longitude: number;
  paths: SmokingAreaPath[];
}

export function DetailKakaoMap({
  latitude,
  longitude,
  paths,
}: DetailKakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null);
  const isLoaded = useKakaoMapLoader();

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: 2,
    };

    const newMap = new window.kakao.maps.Map(mapRef.current, options);
    setMap(newMap);
  }, [isLoaded, latitude, longitude]);

  // 폴리곤 렌더링
  useEffect(() => {
    if (!map || paths.length === 0) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const polygons: any[] = [];

    paths.forEach((pathItem) => {
      const lats = pathItem.pathLat.split(",").map((s) => parseFloat(s.trim()));
      const lngs = pathItem.pathLng.split(",").map((s) => parseFloat(s.trim()));

      if (lats.length !== lngs.length || lats.length < 3) return;

      const polygonPath = lats.map(
        (lat, i) => new window.kakao.maps.LatLng(lat, lngs[i]),
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

      polygons.push(polygon);
    });

    return () => {
      polygons.forEach((p) => p.setMap(null));
    };
  }, [map, paths]);

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">지도를 불러오는 중...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full rounded-lg" />;
}
