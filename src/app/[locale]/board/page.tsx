"use client";

import {
  ChevronLeft,
  ChevronRight,
  Cigarette,
  CigaretteOff,
  ClipboardList,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSmokingAreaList } from "@/hooks/use-smoking-area";
import { Link } from "@/i18n/navigation";

/** 카테고리 뱃지: 색 + 아이콘 + 라벨 (zone ink 토큰은 흰 글자 대비 4.5:1 이상) */
function CategoryBadge({ category }: { category: string }) {
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

export default function BoardPage() {
  const t = useTranslations("board");
  const tc = useTranslations("common");
  const [page, setPage] = useState(0);
  const size = 10;
  const { data, isLoading } = useSmokingAreaList(page, size);

  const items = data?.content ?? [];
  const pageInfo = data?.page;
  const totalPages = pageInfo?.totalPages ?? 0;

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <PageHeader
        title={t("list.title")}
        description={t("list.description")}
        icon={<ClipboardList />}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base">
        <PageSection title={t("list.sectionTitle")}>
          {isLoading ? (
            <p role="status" className="py-8 text-center text-muted-foreground">
              {tc("loading")}
            </p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              {t("list.empty")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="w-16 pr-4 pb-2 font-medium">
                      {t("list.columns.id")}
                    </th>
                    <th className="pr-4 pb-2 font-medium">
                      {t("list.columns.title")}
                    </th>
                    <th className="w-28 pb-2 text-center font-medium">
                      {t("list.columns.category")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b transition-colors last:border-b-0 hover:bg-muted/50"
                    >
                      <td className="pr-4 text-sm text-muted-foreground tabular-nums">
                        {item.id}
                      </td>
                      <td className="pr-4">
                        <Link
                          href={`/board/${item.id}`}
                          className="flex min-h-12 items-center py-2 font-medium hover:underline"
                        >
                          {/* 백엔드 원문 데이터라 en/ja 화면에서도 한국어로 읽히게 */}
                          <span lang="ko">
                            {item.addressName}
                            {item.buildingName && ` ${item.buildingName}`}
                          </span>
                        </Link>
                      </td>
                      <td className="text-center">
                        <CategoryBadge category={item.category} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav
              aria-label={t("list.pagination")}
              className="flex items-center justify-center gap-3 pt-6"
            >
              <Button
                variant="outline"
                size="touch"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft aria-hidden />
                {tc("previous")}
              </Button>

              <span className="px-2 text-sm text-muted-foreground tabular-nums">
                {page + 1} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="touch"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                {tc("next")}
                <ChevronRight aria-hidden />
              </Button>
            </nav>
          )}
        </PageSection>

        {/* 홈으로 돌아가기 */}
        <div className="flex justify-center">
          <Button variant="ghost" size="touch" asChild>
            <Link href="/">{tc("backHome")}</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
