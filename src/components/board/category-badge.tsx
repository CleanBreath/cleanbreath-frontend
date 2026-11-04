import { Cigarette, CigaretteOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

/** 카테고리 뱃지: 색 + 아이콘 + 라벨 (zone ink 토큰은 흰 글자 대비 4.5:1 이상) */
export function CategoryBadge({ category }: { category: string }) {
  const t = useTranslations("board.category");
  const isSmoking = category === "SMOKING";
  const Icon = isSmoking ? Cigarette : CigaretteOff;
  return (
    <Badge
      className={
        isSmoking
          ? "bg-zone-smoking-ink text-white"
          : "bg-zone-non-smoking-ink text-white"
      }
    >
      <Icon aria-hidden />
      {/* 모르는 카테고리 값은 원문 그대로 */}
      {category === "SMOKING" || category === "NON_SMOKING"
        ? t(category)
        : category}
    </Badge>
  );
}
