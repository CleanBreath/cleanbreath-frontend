"use client";

import { useState, useEffect, useRef } from "react";
import * as motion from "motion/react-client";
import Link from "next/link";
import {
  ArrowLeft,
  Cigarette,
  CigaretteOff,
  Send,
  CheckCircle,
  Trash2,
  MousePointer2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { addSmokingArea } from "@/api";
import type { AddressCategory } from "@/types";
import { cn } from "@/lib/utils";

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY || "";
const DEFAULT_CENTER = { lat: 37.394329, lng: 126.956939 };

interface PathPoint {
  lat: number;
  lng: number;
}

export default function RegisterPage() {
  const [category, setCategory] = useState<AddressCategory>("NON_SMOKING");
  const [addressName, setAddressName] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pathPoints, setPathPoints] = useState<PathPoint[]>([]);
  const [centerPoint, setCenterPoint] = useState<PathPoint | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polygonRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const isDrawingRef = useRef(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // isDrawing 상태를 ref에 동기화
  useEffect(() => {
    isDrawingRef.current = isDrawing;
  }, [isDrawing]);

  // 카카오맵 로드
  useEffect(() => {
    if (window.kakao?.maps) {
      setIsMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => setIsMapLoaded(true));
    };
    document.head.appendChild(script);
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(
        DEFAULT_CENTER.lat,
        DEFAULT_CENTER.lng
      ),
      level: 3,
    };

    const map = new window.kakao.maps.Map(mapRef.current, options);
    mapInstanceRef.current = map;

    // 클릭 이벤트 등록
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.kakao.maps.event.addListener(map, "click", (mouseEvent: any) => {
      if (!isDrawingRef.current) return;
      const lat = mouseEvent.latLng.getLat();
      const lng = mouseEvent.latLng.getLng();
      setPathPoints((prev) => [...prev, { lat, lng }]);
    });
  }, [isMapLoaded]);

  // 폴리곤 및 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 기존 폴리곤 제거
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }

    if (pathPoints.length === 0) {
      setCenterPoint(null);
      return;
    }

    // 마커 생성
    pathPoints.forEach((point, index) => {
      const marker = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(point.lat, point.lng),
        content: `<div style="width:24px;height:24px;background:${
          category === "SMOKING" ? "#EF4444" : "#22C55E"
        };border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.2);">${
          index + 1
        }</div>`,
        yAnchor: 0.5,
        xAnchor: 0.5,
      });
      marker.setMap(mapInstanceRef.current);
      markersRef.current.push(marker);
    });

    // 폴리곤 생성 (3개 이상의 점이 있을 때)
    if (pathPoints.length >= 3) {
      const polygonPath = pathPoints.map(
        (point) => new window.kakao.maps.LatLng(point.lat, point.lng)
      );

      const polygon = new window.kakao.maps.Polygon({
        path: polygonPath,
        strokeWeight: 3,
        strokeColor: category === "SMOKING" ? "#DC2626" : "#16A34A",
        strokeOpacity: 0.9,
        fillColor: category === "SMOKING" ? "#EF4444" : "#22C55E",
        fillOpacity: 0.4,
      });

      polygon.setMap(mapInstanceRef.current);
      polygonRef.current = polygon;

      // 중심점 계산
      const centerLat =
        pathPoints.reduce((sum, p) => sum + p.lat, 0) / pathPoints.length;
      const centerLng =
        pathPoints.reduce((sum, p) => sum + p.lng, 0) / pathPoints.length;
      setCenterPoint({ lat: centerLat, lng: centerLng });
    }
  }, [pathPoints, category]);

  const handleClearPath = () => {
    setPathPoints([]);
    setCenterPoint(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressName || pathPoints.length < 3 || !centerPoint) return;

    setIsSubmitting(true);
    try {
      await addSmokingArea({
        updateAt: new Date().toISOString().replace("T", " ").slice(0, 19),
        addressName,
        buildingName,
        latitude: centerPoint.lat,
        longitude: centerPoint.lng,
        category,
        paths: [
          {
            divisionArea:
              category === "SMOKING" ? "SMOKING_ZONE_OPEN" : "NON_SMOKING_ZONE",
            pathLat: pathPoints.map((p) => p.lat.toString()).join(","),
            pathLng: pathPoints.map((p) => p.lng.toString()).join(","),
          },
        ],
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("구역 등록 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="w-full max-w-md text-center">
            <CardContent className="py-12">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="mb-2 text-xl font-bold">등록 요청 완료!</h2>
              <p className="mb-6 text-muted-foreground">
                제안해주신 구역은 검토 후 반영됩니다.
              </p>
              <Button asChild>
                <Link href="/">홈으로 돌아가기</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      {/* 사이드 패널 */}
      <div className="w-full border-b lg:w-96 lg:border-b-0 lg:border-r">
        {/* 헤더 */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
          <div className="flex h-14 items-center gap-4 px-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft size={20} />
              </Link>
            </Button>
            <h1 className="font-semibold">새 구역 등록 요청</h1>
          </div>
        </header>

        <div className="p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4 border-0 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  지도에서 영역을 클릭하여 구역을 지정해주세요. 최소 3개 이상의
                  점을 찍어야 합니다.
                </p>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 구역 타입 선택 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">구역 타입</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCategory("NON_SMOKING")}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all",
                        category === "NON_SMOKING"
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : "border-muted hover:border-green-300"
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                        <CigaretteOff size={20} className="text-white" />
                      </div>
                      <span className="text-sm font-medium">금연구역</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory("SMOKING")}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all",
                        category === "SMOKING"
                          ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                          : "border-muted hover:border-red-300"
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
                        <Cigarette size={20} className="text-white" />
                      </div>
                      <span className="text-sm font-medium">흡연구역</span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* 위치 정보 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">위치 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      주소 <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressName}
                      onChange={(e) => setAddressName(e.target.value)}
                      placeholder="예: 경기도 안양시 동안구 평촌동"
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      건물명
                    </label>
                    <input
                      type="text"
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                      placeholder="예: 평촌역 광장"
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 영역 그리기 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">영역 지정</CardTitle>
                    <Badge variant="secondary">{pathPoints.length}개 점</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={isDrawing ? "default" : "outline"}
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => setIsDrawing(!isDrawing)}
                    >
                      <MousePointer2 size={14} />
                      {isDrawing ? "그리기 중..." : "영역 그리기"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearPath}
                      disabled={pathPoints.length === 0}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  {pathPoints.length > 0 && pathPoints.length < 3 && (
                    <p className="text-xs text-amber-600">
                      최소 3개 이상의 점을 찍어주세요 ({3 - pathPoints.length}개
                      더 필요)
                    </p>
                  )}
                  {pathPoints.length >= 3 && (
                    <p className="text-xs text-green-600">
                      ✓ 영역이 지정되었습니다
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* 제출 버튼 */}
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isSubmitting || !addressName || pathPoints.length < 3}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    등록 중...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    구역 등록 요청
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="relative flex-1">
        <div ref={mapRef} className="h-[50vh] w-full lg:h-full" />
        {isDrawing && (
          <div className="absolute left-4 top-4 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-lg">
            지도를 클릭하여 영역을 지정하세요
          </div>
        )}
      </div>
    </div>
  );
}
