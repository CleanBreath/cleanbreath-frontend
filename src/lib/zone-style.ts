import {
  Building2,
  Bus,
  Cigarette,
  CigaretteOff,
  DoorClosed,
  Footprints,
  type LucideIcon,
  RectangleHorizontal,
  School,
  Trees,
} from "lucide-react";
import type { PublicZoneType } from "@/types";

export type ZoneGroup = "nonSmoking" | "smoking" | "apartment";

// 화면 라벨은 messages map.zoneTypes / map.zoneGroups (키는 ZoneType / ZoneGroup)
export interface ZoneStyle {
  group: ZoneGroup;
  /** 지도 폴리곤 fill (낮은 불투명도로 사용) */
  fill: string;
  /** 지도 폴리곤 stroke, 흰 지도 대비 3:1 이상 */
  stroke: string;
  /** 암묵적(비공식) 구역은 점선 테두리로 구분 */
  dashed: boolean;
  /** 지도 마커·범례 아이콘. 흡연구역 하위 유형은 색만으로 구분하지 않도록 아이콘도 다르게 둔다 */
  icon: LucideIcon;
}

// 지도·범례·칩이 함께 쓰는 구역 스타일. 색 값은 styles/global.css의 --zone-* 변수와 맞춘다
export const ZONE_STYLES = {
  NON_SMOKING_ZONE: {
    group: "nonSmoking",
    fill: "#22C55E",
    stroke: "#16A34A",
    dashed: false,
    icon: CigaretteOff,
  },
  SMOKING_ZONE_OPEN: {
    group: "smoking",
    fill: "#F97316",
    stroke: "#EA580C",
    dashed: false,
    icon: Cigarette,
  },
  SMOKING_ZONE_OPEN_IMPLICIT: {
    group: "smoking",
    fill: "#FB923C",
    // 기존 #F97316은 흰 지도 대비 2.8:1이라 같은 색상각에서 명도만 낮춤
    stroke: "#EE6812",
    dashed: true,
    icon: Cigarette,
  },
  SMOKING_ZONE_CLOSE: {
    group: "smoking",
    fill: "#EF4444",
    stroke: "#DC2626",
    dashed: false,
    icon: DoorClosed,
  },
  SMOKING_ZONE_CLOSE_IMPLICIT: {
    group: "smoking",
    fill: "#F87171",
    stroke: "#EF4444",
    dashed: true,
    icon: DoorClosed,
  },
  SMOKING_ZONE_LINE: {
    group: "smoking",
    fill: "#A855F7",
    stroke: "#9333EA",
    dashed: false,
    icon: RectangleHorizontal,
  },
  SMOKING_ZONE_LINE_IMPLICIT: {
    group: "smoking",
    fill: "#C084FC",
    stroke: "#A855F7",
    dashed: true,
    icon: RectangleHorizontal,
  },
  APARTMENT: {
    group: "apartment",
    fill: "#3B82F6",
    stroke: "#2563EB",
    dashed: false,
    icon: Building2,
  },
} as const satisfies Record<string, ZoneStyle>;

export type ZoneType = keyof typeof ZONE_STYLES;

/** 알 수 없는 divisionArea는 기존 동작대로 폐쇄형 흡연구역 스타일 */
export function getZoneStyle(divisionArea: string): ZoneStyle {
  return (
    ZONE_STYLES[divisionArea as ZoneType] ?? ZONE_STYLES.SMOKING_ZONE_CLOSE
  );
}

// 필터 칩·범례 그룹용. ink는 흰 글자/배경 모두 4.5:1 이상인 텍스트용 색 (--zone-*-ink)
export const ZONE_GROUPS = {
  nonSmoking: { ink: "#15803D", icon: CigaretteOff },
  smoking: { ink: "#DC2626", icon: Cigarette },
  apartment: { ink: "#2563EB", icon: Building2 },
} as const satisfies Record<ZoneGroup, { ink: string; icon: LucideIcon }>;

// 공공데이터 실외 금연구역 유형별 아이콘(지도 마커·범례). 색은 NON_SMOKING_ZONE. 시설경계는 대부분 학교·어린이집 주변이다
export const PUBLIC_ZONE_ICONS = {
  TRANSIT: Bus,
  PARK: Trees,
  STREET: Footprints,
  BOUNDARY: School,
} as const satisfies Record<PublicZoneType, LucideIcon>;
