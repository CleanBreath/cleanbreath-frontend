import type { ZoneGroup } from "@/lib/zone-style";
import type { AddressCategory } from "@/types";

// 목록·선택 카드용 구역 그룹 클래스. 흰 글자는 -ink 배경에만, 옅은 칩은 흰 배경 + ink 글자 (둘 다 4.5:1 이상)
export const ZONE_TONE: Record<ZoneGroup, { solid: string; soft: string }> = {
  nonSmoking: {
    solid: "bg-zone-non-smoking-ink text-white",
    soft: "border-zone-non-smoking/50 bg-background text-zone-non-smoking-ink",
  },
  smoking: {
    solid: "bg-zone-smoking-ink text-white",
    soft: "border-zone-smoking/50 bg-background text-zone-smoking-ink",
  },
  apartment: {
    solid: "bg-zone-apartment-ink text-white",
    soft: "border-zone-apartment/50 bg-background text-zone-apartment-ink",
  },
};

export function categoryGroup(category: AddressCategory): ZoneGroup {
  return category === "SMOKING" ? "smoking" : "nonSmoking";
}
