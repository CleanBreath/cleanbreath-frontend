import {
  Building2,
  Cigarette,
  CigaretteOff,
  type LucideIcon,
} from "lucide-react";

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
  icon: LucideIcon;
  /** 지도 마커 배경 Tailwind 클래스 (fill과 같은 색) */
  markerBg: string;
}

// 지도·범례·칩이 함께 쓰는 구역 스타일. 색 값은 styles/global.css의 --zone-* 변수와 맞춘다
export const ZONE_STYLES = {
  NON_SMOKING_ZONE: {
    group: "nonSmoking",
    fill: "#22C55E",
    stroke: "#16A34A",
    dashed: false,
    icon: CigaretteOff,
    markerBg: "bg-green-500",
  },
  SMOKING_ZONE_OPEN: {
    group: "smoking",
    fill: "#F97316",
    stroke: "#EA580C",
    dashed: false,
    icon: Cigarette,
    markerBg: "bg-orange-500",
  },
  SMOKING_ZONE_OPEN_IMPLICIT: {
    group: "smoking",
    fill: "#FB923C",
    // 기존 #F97316은 흰 지도 대비 2.8:1이라 같은 색상각에서 명도만 낮춤
    stroke: "#EE6812",
    dashed: true,
    icon: Cigarette,
    markerBg: "bg-orange-400",
  },
  SMOKING_ZONE_CLOSE: {
    group: "smoking",
    fill: "#EF4444",
    stroke: "#DC2626",
    dashed: false,
    icon: Cigarette,
    markerBg: "bg-red-500",
  },
  SMOKING_ZONE_CLOSE_IMPLICIT: {
    group: "smoking",
    fill: "#F87171",
    stroke: "#EF4444",
    dashed: true,
    icon: Cigarette,
    markerBg: "bg-red-400",
  },
  SMOKING_ZONE_LINE: {
    group: "smoking",
    fill: "#A855F7",
    stroke: "#9333EA",
    dashed: false,
    icon: Cigarette,
    markerBg: "bg-purple-500",
  },
  SMOKING_ZONE_LINE_IMPLICIT: {
    group: "smoking",
    fill: "#C084FC",
    stroke: "#A855F7",
    dashed: true,
    icon: Cigarette,
    markerBg: "bg-purple-400",
  },
  APARTMENT: {
    group: "apartment",
    fill: "#3B82F6",
    stroke: "#2563EB",
    dashed: false,
    icon: Building2,
    markerBg: "bg-blue-500",
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
