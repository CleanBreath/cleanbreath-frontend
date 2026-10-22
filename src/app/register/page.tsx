"use client";

import {
  CheckCircle,
  Cigarette,
  CigaretteOff,
  MapPin,
  MousePointer2,
  Send,
  SquarePlus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ApiError, addSmokingArea } from "@/api";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNaverMapLoader } from "@/hooks/use-naver-map-loader";
import { cn } from "@/lib/utils";
import { ZONE_STYLES } from "@/lib/zone-style";
import type { AddressCategory } from "@/types";

const DEFAULT_CENTER = { lat: 37.394329, lng: 126.956939 };

// 그리는 중 미리보기 색. 흡연구역은 기존처럼 빨강(폐쇄형) 계열로 표시
const ZONE_COLORS = {
  SMOKING: ZONE_STYLES.SMOKING_ZONE_CLOSE,
  NON_SMOKING: ZONE_STYLES.NON_SMOKING_ZONE,
} as const;

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPinMode, setIsPinMode] = useState(false);
  const [pathPoints, setPathPoints] = useState<PathPoint[]>([]);
  const [centerPoint, setCenterPoint] = useState<PathPoint | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const polygonRef = useRef<naver.maps.Polygon | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const isDrawingRef = useRef(false);
  const isPinModeRef = useRef(false);
  const isMapLoaded = useNaverMapLoader({ geocoder: true });

  // isDrawing 상태를 ref에 동기화
  useEffect(() => {
    isDrawingRef.current = isDrawing;
  }, [isDrawing]);

  // isPinMode 상태를 ref에 동기화
  useEffect(() => {
    isPinModeRef.current = isPinMode;
  }, [isPinMode]);

  // 지도 초기화
  useEffect(() => {
    // 역지오코딩으로 주소/건물명 자동 입력
    const reverseGeocode = (lat: number, lng: number) => {
      naver.maps.Service.reverseGeocode(
        {
          coords: new naver.maps.LatLng(lat, lng),
          orders: [
            naver.maps.Service.OrderType.ADDR,
            naver.maps.Service.OrderType.ROAD_ADDR,
          ].join(","),
        },
        (status, response) => {
          if (status !== naver.maps.Service.Status.OK || !response) return;

          // 도로명 주소 우선, 없으면 지번 주소
          const { roadAddress, jibunAddress } = response.v2.address;
          // 건물명은 도로명 결과의 addition0(building)에 담겨 옴
          const roadResult = response.v2.results.find(
            (r) => r.name === "roadaddr",
          );

          if (roadAddress) {
            setAddressName(roadAddress);
            setBuildingName(roadResult?.land?.addition0?.value || "");
          } else if (jibunAddress) {
            setAddressName(jibunAddress);
            setBuildingName("");
          }
        },
      );
    };

    if (!isMapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
      zoom: 17,
    });
    mapInstanceRef.current = map;

    // 클릭 이벤트 등록
    naver.maps.Event.addListener(map, "click", (e: naver.maps.PointerEvent) => {
      // coord는 위경도 좌표계라 y가 위도, x가 경도
      const lat = e.coord.y;
      const lng = e.coord.x;

      // 핀 모드: 주소/건물명만 자동 입력 후 모드 종료
      if (isPinModeRef.current) {
        reverseGeocode(lat, lng);
        setIsPinMode(false);
        return;
      }

      if (!isDrawingRef.current) return;
      setPathPoints((prev) => {
        // 첫 번째 핀을 찍을 때 역지오코딩으로 주소 자동 입력
        if (prev.length === 0) {
          reverseGeocode(lat, lng);
        }
        return [...prev, { lat, lng }];
      });
    });
  }, [isMapLoaded]);

  // 폴리곤 및 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
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
      const colors = ZONE_COLORS[category];
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(point.lat, point.lng),
        icon: {
          content: `<div style="width:24px;height:24px;background:${colors.fill};border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.2);">${
            index + 1
          }</div>`,
          anchor: new naver.maps.Point(12, 12),
        },
      });
      marker.setMap(mapInstanceRef.current);
      markersRef.current.push(marker);
    });

    // 폴리곤 생성 (3개 이상의 점이 있을 때)
    if (pathPoints.length >= 3) {
      const polygonPath = pathPoints.map(
        (point) => new naver.maps.LatLng(point.lat, point.lng),
      );

      const colors = ZONE_COLORS[category];
      const polygon = new naver.maps.Polygon({
        paths: [polygonPath],
        strokeWeight: 3,
        strokeColor: colors.stroke,
        strokeOpacity: 0.9,
        fillColor: colors.fill,
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

  // lg 미만에서는 지도가 폼 위에 있어, 폼을 내려 본 상태에서 그리기/핀 모드를 켜면 지도를 다시 화면에 가져온다
  const revealMap = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    mapRef.current?.scrollIntoView({
      block: "center",
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const handleClearPath = () => {
    setPathPoints([]);
    setCenterPoint(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressName || pathPoints.length < 3 || !centerPoint) return;

    setIsSubmitting(true);
    setSubmitError(null);
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
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "구역 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-dvh flex-col bg-muted/40">
        <PageHeader
          title="새 구역 등록 요청"
          description="지도에서 흡연·금연구역을 지정해 제안해주세요"
          icon={<SquarePlus />}
        />
        <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center p-4">
          <PageSection className="w-full max-w-md text-center">
            <div className="py-6">
              <div
                aria-hidden
                className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <CheckCircle size={40} />
              </div>
              <h2 role="status" className="mb-2 text-xl font-bold">
                등록 요청 완료!
              </h2>
              <p className="mb-6 text-base text-muted-foreground">
                제안해주신 구역은 게시판에 공개됩니다. &lsquo;사실이에요&rsquo;
                투표가 20표 이상 모이면 매일 새벽 3시에 지도에 자동 반영됩니다.
              </p>
              <div className="flex flex-col gap-2">
                <Button size="touch" asChild>
                  <Link href="/board">게시판에서 확인하기</Link>
                </Button>
                <Button size="touch" variant="outline" asChild>
                  <Link href="/">홈으로 돌아가기</Link>
                </Button>
              </div>
            </div>
          </PageSection>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      {/* 사이드 패널. lg 미만에서는 contents로 풀어 헤더 → 지도 → 폼 순서로 배치 */}
      <div className="max-lg:contents lg:w-96 lg:border-r">
        <PageHeader
          title="새 구역 등록 요청"
          description="지도에서 흡연·금연구역을 지정해 제안해주세요"
          icon={<SquarePlus />}
        />

        <main className="p-4 text-base max-lg:order-1">
          <div>
            <div className="mb-4 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-muted-foreground">
              <p>
                &lsquo;영역 그리기&rsquo;를 누른 뒤 지도에서 3개 이상의 점을
                찍어 구역을 지정해주세요.
              </p>
              <p className="text-sm">
                등록한 구역은 게시판에 공개되고, &lsquo;사실이에요&rsquo; 투표가
                20표 이상 모이면 매일 새벽 3시에 지도에 자동 반영됩니다.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 구역 타입 선택 */}
              <PageSection title="구역 타입">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    aria-pressed={category === "NON_SMOKING"}
                    onClick={() => setCategory("NON_SMOKING")}
                    className={cn(
                      "flex min-h-11 flex-col items-center gap-2 rounded-xl border-2 p-3 transition-colors",
                      category === "NON_SMOKING"
                        ? "border-zone-non-smoking-ink bg-zone-non-smoking/10"
                        : "border-border hover:border-zone-non-smoking",
                    )}
                  >
                    <span
                      aria-hidden
                      className="flex size-10 items-center justify-center rounded-full bg-zone-non-smoking-ink text-white"
                    >
                      <CigaretteOff size={20} />
                    </span>
                    <span className="font-medium">금연구역</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={category === "SMOKING"}
                    onClick={() => setCategory("SMOKING")}
                    className={cn(
                      "flex min-h-11 flex-col items-center gap-2 rounded-xl border-2 p-3 transition-colors",
                      category === "SMOKING"
                        ? "border-zone-smoking-ink bg-zone-smoking/10"
                        : "border-border hover:border-zone-smoking",
                    )}
                  >
                    <span
                      aria-hidden
                      className="flex size-10 items-center justify-center rounded-full bg-zone-smoking-ink text-white"
                    >
                      <Cigarette size={20} />
                    </span>
                    <span className="font-medium">흡연구역</span>
                  </button>
                </div>
              </PageSection>

              {/* 위치 정보 */}
              <PageSection
                title="위치 정보"
                action={
                  <Button
                    type="button"
                    variant={isPinMode ? "default" : "outline"}
                    size="icon-touch"
                    aria-label="지도를 클릭하여 위치 자동 입력"
                    aria-pressed={isPinMode}
                    title="지도를 클릭하여 위치 자동 입력"
                    onClick={() => {
                      if (!isPinMode) revealMap();
                      setIsPinMode((prev) => !prev);
                      if (isDrawing) setIsDrawing(false);
                    }}
                  >
                    <MapPin aria-hidden />
                  </Button>
                }
              >
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="register-address"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      주소 <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="register-address"
                      type="text"
                      value={addressName}
                      onChange={(e) => setAddressName(e.target.value)}
                      placeholder="예: 경기도 안양시 동안구 평촌동"
                      className="h-11 w-full rounded-lg border bg-background px-3 text-base"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="register-building"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      건물명
                    </label>
                    <input
                      id="register-building"
                      type="text"
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                      placeholder="예: 평촌역 광장"
                      className="h-11 w-full rounded-lg border bg-background px-3 text-base"
                    />
                  </div>
                </div>
              </PageSection>

              {/* 영역 그리기 */}
              <PageSection
                title="영역 지정"
                action={
                  <Badge variant="secondary" className="tabular-nums">
                    {pathPoints.length}개 점
                  </Badge>
                }
              >
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={isDrawing ? "default" : "outline"}
                      size="touch"
                      className="flex-1"
                      aria-pressed={isDrawing}
                      onClick={() => {
                        if (!isDrawing) revealMap();
                        setIsDrawing(!isDrawing);
                      }}
                    >
                      <MousePointer2 aria-hidden />
                      {isDrawing ? "그리기 중..." : "영역 그리기"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-touch"
                      aria-label="찍은 점 모두 지우기"
                      onClick={handleClearPath}
                      disabled={pathPoints.length === 0}
                    >
                      <Trash2 aria-hidden />
                    </Button>
                  </div>
                  <div aria-live="polite">
                    {pathPoints.length > 0 && pathPoints.length < 3 && (
                      <p className="text-sm text-muted-foreground">
                        최소 3개 이상의 점을 찍어주세요 ({3 - pathPoints.length}
                        개 더 필요)
                      </p>
                    )}
                    {pathPoints.length >= 3 && (
                      <p className="flex items-center gap-1.5 text-sm font-medium text-zone-non-smoking-ink">
                        <CheckCircle size={16} aria-hidden />
                        영역이 지정되었습니다
                      </p>
                    )}
                  </div>
                </div>
              </PageSection>

              <p className="text-sm text-muted-foreground">
                등록 요청 시 구역 위치·주소·건물명·구역 구분 등 입력한 정보가
                전송되며 게시판에 공개됩니다. 자세한 내용은{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  개인정보처리방침
                </Link>
                을 확인해주세요.
              </p>

              {/* 제출 버튼 */}
              <Button
                type="submit"
                size="touch"
                className="w-full"
                disabled={isSubmitting || !addressName || pathPoints.length < 3}
              >
                {isSubmitting ? (
                  <>
                    <div
                      aria-hidden
                      className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"
                    />
                    등록 중...
                  </>
                ) : (
                  <>
                    <Send aria-hidden />
                    구역 등록 요청
                  </>
                )}
              </Button>
              {submitError && (
                <p
                  role="alert"
                  className="text-center text-sm text-destructive"
                >
                  {submitError}
                </p>
              )}
            </form>
          </div>
        </main>
      </div>

      {/* 지도 영역 */}
      <section aria-label="위치 선택 지도" className="relative lg:flex-1">
        <div ref={mapRef} className="h-[45svh] min-h-72 w-full lg:h-full" />
        {isDrawing && (
          <div className="absolute top-4 left-4 z-10 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-md">
            지도를 클릭하여 영역을 지정하세요
          </div>
        )}
        {isPinMode && (
          <div className="absolute top-4 left-4 z-10 rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background shadow-md">
            지도를 클릭하면 주소가 자동 입력됩니다
          </div>
        )}
      </section>
    </div>
  );
}
