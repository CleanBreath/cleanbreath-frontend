"use client";

import {
  CheckCircle,
  Cigarette,
  CigaretteOff,
  Crosshair,
  MapPin,
  MousePointer2,
  Send,
  SquarePlus,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { addSmokingArea } from "@/api";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { MapPlaceholder } from "@/components/map/map-placeholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNaverMapLoader } from "@/hooks/use-naver-map-loader";
import { Link } from "@/i18n/navigation";
import { useApiErrorMessage } from "@/lib/api-error-message";
import { cn } from "@/lib/utils";
import { ZONE_GROUPS, ZONE_STYLES } from "@/lib/zone-style";
import type { AddressCategory } from "@/types";

const DEFAULT_CENTER = { lat: 37.394329, lng: 126.956939 };

// 그리는 중 미리보기 색. 흡연구역은 기존처럼 빨강(폐쇄형) 계열로 표시
const ZONE_COLORS = {
  SMOKING: ZONE_STYLES.SMOKING_ZONE_CLOSE,
  NON_SMOKING: ZONE_STYLES.NON_SMOKING_ZONE,
} as const;

// 제출 버튼 아이콘 교차 페이드 (Send ↔ 스피너). 두 레이어를 겹쳐 두고 상태에 따라 보이는 쪽만 바꾼다
const ICON_LAYER =
  "[grid-area:1/1] transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:scale-100 motion-reduce:blur-[0px]";
const ICON_SHOWN = "scale-100 opacity-100 blur-[0px]";
const ICON_HIDDEN = "scale-[0.25] opacity-0 blur-[4px]";

interface PathPoint {
  lat: number;
  lng: number;
}

// 같은 자리로 보는 좌표 차이 (약 1cm). 같은 자리 점은 넓이 0인 영역을 만든다
const SAME_POINT_EPSILON = 1e-7;
const isSamePoint = (a: PathPoint, b: PathPoint) =>
  Math.abs(a.lat - b.lat) < SAME_POINT_EPSILON &&
  Math.abs(a.lng - b.lng) < SAME_POINT_EPSILON;

// 지도에 포커스가 있을 때 방향키 이동 방향 [경도, 위도]. 한 번에 화면의 1/4씩
const ARROW_STEPS: Record<string, [number, number]> = {
  ArrowUp: [0, 1],
  ArrowDown: [0, -1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

export default function RegisterPage() {
  const t = useTranslations("register");
  const tc = useTranslations("common");
  const tm = useTranslations("map");
  const apiErrorMessage = useApiErrorMessage();
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
  // 모두 지우기 직전의 점들. 되돌리기로 복원한다
  const [clearedPoints, setClearedPoints] = useState<PathPoint[] | null>(null);
  // 역지오코딩 실패·결과 없음이면 주소 직접 입력 안내를 보여 준다
  const [geocodeFailed, setGeocodeFailed] = useState(false);
  // 제출을 한 번 시도한 뒤부터 빈 필드를 오류로 표시
  const [showErrors, setShowErrors] = useState(false);
  // '지도 가운데에 점 찍기'를 지도를 옮기지 않고 다시 누르면 같은 자리라 찍지 않고 안내한다
  const [samePointHint, setSamePointHint] = useState(false);

  const addressInputRef = useRef<HTMLInputElement>(null);
  const drawButtonRef = useRef<HTMLButtonElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const polygonRef = useRef<naver.maps.Polygon | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const isDrawingRef = useRef(false);
  const isPinModeRef = useRef(false);
  const { isLoaded: isMapLoaded, isError: isMapError } = useNaverMapLoader({
    geocoder: true,
  });

  const addressInvalid = showErrors && !addressName.trim();
  const areaInvalid = showErrors && pathPoints.length < 3;

  // 성공 화면으로 바뀌면 폼이 언마운트되므로 새 화면의 제목으로 포커스를 옮긴다
  useEffect(() => {
    if (isSuccess) successHeadingRef.current?.focus();
  }, [isSuccess]);

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
          // 결과 없음(바다·공원·신규 택지)은 status OK + 빈 주소로 온다
          const address =
            status === naver.maps.Service.Status.OK && response
              ? response.v2.address
              : null;
          if (!address?.roadAddress && !address?.jibunAddress) {
            setGeocodeFailed(true);
            return;
          }
          setGeocodeFailed(false);

          // 도로명 주소 우선, 없으면 지번 주소
          const { roadAddress, jibunAddress } = address;
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
      // 키보드 이동은 지도 컨테이너의 onKeyDown(handleMapKeyDown)이 직접 처리한다 (NAVER 단축키 동작에 기대지 않고, 두 번 이동하지 않게)
      keyboardShortcuts: false,
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
      setSamePointHint(false);
      setPathPoints((prev) => {
        // 이미 찍은 자리는 다시 찍지 않는다 (넓이 0인 영역 방지)
        if (prev.some((p) => isSamePoint(p, { lat, lng }))) return prev;
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
      // 흰 숫자 아래 배경은 fill이 아니라 ink (흰 글자 대비 4.5:1↑)
      const ink = ZONE_GROUPS[colors.group].ink;
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(point.lat, point.lng),
        icon: {
          content: `<div style="width:24px;height:24px;background:${ink};border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.2);">${
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

  // lg 미만에서는 지도가 폼 아래에 있어, 그리기/핀 모드를 켜면 지도를 화면으로 가져온다
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
    setClearedPoints(pathPoints);
    setPathPoints([]);
    setCenterPoint(null);
    setSamePointHint(false);
    // 지우기 버튼은 곧바로 disabled가 되므로 포커스를 그리기 버튼으로 옮긴다
    drawButtonRef.current?.focus();
  };

  // 키보드·단일 포인터 경로: 기존 지도 click 핸들러를 현재 중심 좌표로 재사용 (점 추가·첫 점 역지오코딩·핀 모드 로직을 한 곳에 유지)
  const handleAddCenterPoint = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const center = map.getCenter() as naver.maps.LatLng;
    // 지도를 옮기지 않고 다시 누르면 같은 자리라 찍지 않고, 지도를 먼저 옮기라고 안내한다
    if (
      pathPoints.some((p) =>
        isSamePoint(p, { lat: center.lat(), lng: center.lng() }),
      )
    ) {
      setSamePointHint(true);
      return;
    }
    naver.maps.Event.trigger(map, "click", { coord: center });
  };

  // 지도 컨테이너에 포커스가 있을 때 방향키로 지도를 옮기고 +/-로 확대·축소한다.
  // 이동량은 화면 범위 기준 위경도로 계산해 방향이 뒤집힐 일이 없다
  const handleMapKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // 지도 안 NAVER 로고·저작권 링크 등 자식 요소의 키 입력은 건드리지 않는다
    if (e.target !== e.currentTarget) return;
    const map = mapInstanceRef.current;
    if (!map) return;
    if (e.key === "+" || e.key === "=" || e.key === "-") {
      e.preventDefault();
      map.setZoom(map.getZoom() + (e.key === "-" ? -1 : 1));
      return;
    }
    const step = ARROW_STEPS[e.key];
    if (!step) return;
    e.preventDefault();
    const bounds = map.getBounds() as naver.maps.LatLngBounds;
    const center = map.getCenter() as naver.maps.LatLng;
    const target = new naver.maps.LatLng(
      center.lat() +
        (step[1] * (bounds.getNE().lat() - bounds.getSW().lat())) / 4,
      center.lng() +
        (step[0] * (bounds.getNE().lng() - bounds.getSW().lng())) / 4,
    );
    // 동작 줄이기 설정이면 애니메이션 없이 바로 이동 (revealMap과 같은 방식)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      map.setCenter(target);
    else map.panTo(target);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // aria-disabled는 Enter 제출을 막지 않으므로 전송 중 중복 제출은 여기서 막는다
    if (isSubmitting) return;
    if (!addressName.trim() || pathPoints.length < 3 || !centerPoint) {
      setShowErrors(true);
      // 첫 번째로 빠진 항목으로 포커스를 보낸다
      (addressName.trim()
        ? drawButtonRef.current
        : addressInputRef.current
      )?.focus();
      return;
    }

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
      setSubmitError(apiErrorMessage(error, t("submitFailed")));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-dvh flex-col bg-muted/40">
        <PageHeader
          title={t("header.title")}
          description={t("header.description")}
          icon={<SquarePlus />}
        />
        <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center p-4">
          <PageSection className="w-full max-w-md text-center">
            <div className="py-6">
              <div
                aria-hidden
                className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <CheckCircle size={40} strokeWidth={2.5} />
              </div>
              <h2
                ref={successHeadingRef}
                tabIndex={-1}
                className="mb-2 text-lg font-semibold"
              >
                {t("success.title")}
              </h2>
              <p className="mb-6 text-base text-muted-foreground">
                {t("success.description")}
              </p>
              <div className="flex flex-col gap-2">
                <Button size="touch" asChild>
                  <Link href="/board">{t("success.viewBoard")}</Link>
                </Button>
                <Button size="touch" variant="outline" asChild>
                  <Link href="/">{tc("goHome")}</Link>
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
      {/* 사이드 패널. lg 미만에서는 contents로 풀어 DOM 순서(헤더 → 폼 → 지도) 그대로 배치 */}
      <div className="max-lg:contents lg:w-96 lg:border-r">
        <PageHeader
          title={t("header.title")}
          description={t("header.description")}
          icon={<SquarePlus />}
          inPanel
        />

        <main className="p-4 text-base">
          <div>
            <div className="mb-4 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-muted-foreground">
              <p>{t("guide.draw")}</p>
              <p className="text-sm">{t("guide.publish")}</p>
            </div>

            <form noValidate onSubmit={handleSubmit} className="space-y-4">
              {/* 구역 타입 선택 */}
              <PageSection title={t("category.title")}>
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
                    <span className="font-medium">
                      {t("category.NON_SMOKING")}
                    </span>
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
                    <span className="font-medium">{t("category.SMOKING")}</span>
                  </button>
                </div>
              </PageSection>

              {/* 위치 정보 */}
              <PageSection
                title={t("location.title")}
                action={
                  <Button
                    type="button"
                    variant={isPinMode ? "default" : "outline"}
                    size="icon-touch"
                    aria-label={t("location.pinMode")}
                    aria-pressed={isPinMode}
                    title={t("location.pinMode")}
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
                      {t("location.address")}{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="register-address"
                      ref={addressInputRef}
                      type="text"
                      value={addressName}
                      onChange={(e) => {
                        setAddressName(e.target.value);
                        setGeocodeFailed(false);
                      }}
                      placeholder={t("location.addressPlaceholder")}
                      className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base aria-invalid:border-destructive"
                      required
                      aria-invalid={addressInvalid || undefined}
                      aria-describedby={
                        [
                          addressInvalid && "register-address-error",
                          geocodeFailed && "register-address-hint",
                        ]
                          .filter(Boolean)
                          .join(" ") || undefined
                      }
                    />
                    {addressInvalid && (
                      <p
                        id="register-address-error"
                        className="mt-1.5 text-sm text-destructive"
                      >
                        {t("location.addressRequired")}
                      </p>
                    )}
                    <div aria-live="polite">
                      {geocodeFailed && (
                        <p
                          id="register-address-hint"
                          className="mt-1.5 text-sm text-muted-foreground"
                        >
                          {t("location.geocodeFailed")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="register-building"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      {t("location.building")}
                    </label>
                    <input
                      id="register-building"
                      type="text"
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                      placeholder={t("location.buildingPlaceholder")}
                      className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
                    />
                  </div>
                </div>
              </PageSection>

              {/* 영역 그리기 */}
              <PageSection
                title={t("area.title")}
                action={
                  <Badge variant="secondary" className="tabular-nums">
                    {t("area.pointCount", { count: pathPoints.length })}
                  </Badge>
                }
              >
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      ref={drawButtonRef}
                      type="button"
                      variant={isDrawing ? "default" : "outline"}
                      size="touch"
                      className="flex-1"
                      aria-pressed={isDrawing}
                      aria-describedby={
                        areaInvalid ? "register-area-error" : undefined
                      }
                      onClick={() => {
                        if (!isDrawing) revealMap();
                        setIsDrawing(!isDrawing);
                        setSamePointHint(false);
                        // 그리기와 핀 모드는 동시에 켜지지 않는다
                        setIsPinMode(false);
                      }}
                    >
                      <MousePointer2 aria-hidden />
                      {isDrawing ? t("area.drawing") : t("area.draw")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-touch"
                      aria-label={t("area.clear")}
                      onClick={handleClearPath}
                      disabled={pathPoints.length === 0}
                    >
                      <Trash2 aria-hidden />
                    </Button>
                  </div>
                  {isDrawing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="touch"
                      className="w-full"
                      onClick={handleAddCenterPoint}
                    >
                      <Crosshair aria-hidden />
                      {t("area.addCenter")}
                    </Button>
                  )}
                  <div aria-live="polite">
                    {samePointHint && (
                      <p className="text-sm text-muted-foreground">
                        {t("area.samePoint")}
                      </p>
                    )}
                    {clearedPoints && pathPoints.length === 0 && (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        {t("area.cleared")}
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => {
                            setPathPoints(clearedPoints);
                            setClearedPoints(null);
                            // 되돌리기 버튼이 사라지므로 포커스를 그리기 버튼으로 옮긴다
                            drawButtonRef.current?.focus();
                          }}
                        >
                          {t("area.undo")}
                        </Button>
                      </p>
                    )}
                    {(pathPoints.length > 0 || areaInvalid) &&
                      pathPoints.length < 3 && (
                        <p
                          id="register-area-error"
                          className={cn(
                            "text-sm",
                            areaInvalid
                              ? "text-destructive"
                              : "text-muted-foreground",
                          )}
                        >
                          {t("area.needMore", {
                            remaining: 3 - pathPoints.length,
                          })}
                        </p>
                      )}
                    {pathPoints.length >= 3 && (
                      <p className="flex items-center gap-1.5 text-sm font-medium">
                        <CheckCircle size={16} aria-hidden />
                        {t("area.done")}
                      </p>
                    )}
                  </div>
                </div>
              </PageSection>

              <p className="text-sm text-muted-foreground">
                {t.rich("privacyNotice", {
                  link: (chunks) => (
                    <Link
                      href="/privacy"
                      className="font-medium text-foreground underline underline-offset-4"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>

              {/* 제출 버튼 */}
              <Button
                type="submit"
                size="touch"
                className="w-full"
                aria-disabled={isSubmitting || undefined}
              >
                <span aria-hidden className="grid size-4 place-items-center">
                  <Send
                    className={cn(
                      ICON_LAYER,
                      isSubmitting ? ICON_HIDDEN : ICON_SHOWN,
                    )}
                  />
                  <span
                    className={cn(
                      ICON_LAYER,
                      "size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent",
                      isSubmitting ? ICON_SHOWN : ICON_HIDDEN,
                    )}
                  />
                </span>
                {isSubmitting ? t("submitting") : t("submit")}
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
      {/* lg에서는 높이를 화면에 고정하고 sticky로 두어, 폼을 스크롤해도 그리기 표면과 안내가 보이게 한다 */}
      {/* 이름은 아래 지도 컨테이너(role="application")에만 둔다. 감싸는 요소에도 같은 이름을 주면 두 번 읽힌다 */}
      <div className="relative lg:sticky lg:top-0 lg:h-dvh lg:flex-1">
        {/* 스크립트 로드 전·실패 시 빈 상자 대신 안내. 문구가 바뀌어 읽히도록 live region은 항상 렌더한다 */}
        <div role="status">
          {!isMapLoaded && (
            <MapPlaceholder
              label={isMapError ? tm("loadError") : tm("loading")}
              isError={isMapError}
            />
          )}
        </div>
        {/* 방향키로 지도를 옮겨 가운데 점을 찍을 수 있도록 지도 컨테이너를 포커스 가능하게 둔다.
            방향키는 handleMapKeyDown이 처리하고, 스크린 리더 탐색 모드가 방향키를 가로채지 않도록 role="application".
            포커스 링은 화면 가장자리에 붙은 지도에서 잘리지 않게 안쪽으로 그린다 */}
        <div
          ref={mapRef}
          role="application"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: 방향키로 지도를 옮겨 가운데 점을 찍기 위한 키보드 접근
          tabIndex={0}
          aria-label={t("map.label")}
          onKeyDown={handleMapKeyDown}
          className="peer h-[45svh] min-h-72 w-full focus-visible:-outline-offset-2 lg:h-full"
        />
        {/* 지도 타일 레이어(positioned)가 컨테이너 안쪽 외곽선을 덮을 수 있어, 같은 링을 지도 위 겹침 요소에도 그린다 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 hidden outline-2 outline-ring -outline-offset-2 peer-focus-visible:block"
        />
        {isDrawing && (
          <Crosshair
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 z-10 size-6 -translate-1/2 text-primary"
          />
        )}
        <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex flex-col items-start gap-2">
          {isDrawing && (
            <div className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-md">
              {t("map.drawingHint")}
            </div>
          )}
          {isPinMode && (
            <div className="rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background shadow-md">
              {t("map.pinHint")}
            </div>
          )}
          {/* lg 미만에서는 주소 칸이 지도 위쪽(대개 화면 밖)이라 역지오코딩 실패 안내를 지도에도 띄운다.
              읽기는 주소 칸 아래 live region이 맡으므로 aria-hidden */}
          {geocodeFailed && (
            <div
              aria-hidden
              className="rounded-lg bg-card px-3 py-1.5 text-sm text-foreground shadow-md lg:hidden"
            >
              {t("location.geocodeFailed")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
