"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useNaverMapLoader } from "@/hooks/use-naver-map-loader";
import { getZoneStyle } from "@/lib/zone-style";
import type { SmokingAreaPath } from "@/types";

interface DetailNaverMapProps {
  latitude: number;
  longitude: number;
  paths: SmokingAreaPath[];
}

export function DetailNaverMap({
  latitude,
  longitude,
  paths,
}: DetailNaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const isLoaded = useNaverMapLoader();
  const t = useTranslations("map");

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const newMap = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(latitude, longitude),
      zoom: 18,
    });
    setMap(newMap);
  }, [isLoaded, latitude, longitude]);

  // 폴리곤 렌더링
  useEffect(() => {
    if (!map || paths.length === 0) return;

    const polygons: naver.maps.Polygon[] = [];

    paths.forEach((pathItem) => {
      const lats = pathItem.pathLat.split(",").map((s) => parseFloat(s.trim()));
      const lngs = pathItem.pathLng.split(",").map((s) => parseFloat(s.trim()));

      if (lats.length !== lngs.length || lats.length < 3) return;

      const polygonPath = lats.map(
        (lat, i) => new naver.maps.LatLng(lat, lngs[i]),
      );

      const colors = getZoneStyle(pathItem.divisionArea);

      const polygon = new naver.maps.Polygon({
        paths: [polygonPath],
        // 메인 지도(naver-map)와 같은 테두리: 불투명 3px, 비공식 구역은 점선
        strokeWeight: 3,
        strokeColor: colors.stroke,
        strokeOpacity: 1,
        strokeStyle: colors.dashed ? "shortdash" : "solid",
        fillColor: colors.fill,
        fillOpacity: 0.4,
        map,
      });

      polygons.push(polygon);
    });

    return () => {
      polygons.forEach((p) => {
        p.setMap(null);
      });
    };
  }, [map, paths]);

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full rounded-lg" />;
}
