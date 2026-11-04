"use client";

import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CategoryBadge } from "@/components/board/category-badge";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import { useSmokingAreaList } from "@/hooks/use-smoking-area";
import { Link } from "@/i18n/navigation";
import { getZoneLabel } from "@/lib/board-zone";
import type { SmokingAreaPageResponse } from "@/types";

interface BoardListProps {
  /** 서버에서 받아둔 첫 페이지. 없으면(야간 DB 중지 등) 기존처럼 클라이언트에서만 불러온다 */
  initialFirstPage?: SmokingAreaPageResponse;
  /** 목록 한 페이지 크기 (서버에서 받은 첫 페이지와 같은 값) */
  size: number;
}

export function BoardList({ initialFirstPage, size }: BoardListProps) {
  const t = useTranslations("board");
  const tc = useTranslations("common");
  const [page, setPage] = useState(0);
  const { data: fetched, isLoading } = useSmokingAreaList(page, size);

  // 서버 첫 페이지는 쿼리 캐시에 넣지 않고 화면에만 쓴다.
  // SSR의 QueryClient가 요청 사이에 공유되는 싱글턴이라 initialData로 넣으면 이전 렌더 값이 남을 수 있다.
  // 클라이언트 조회가 끝나면(또는 실패하면) 그 결과 / 서버 값 순으로 보여준다
  const data = fetched ?? (page === 0 ? initialFirstPage : undefined);

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
          {isLoading && !data ? (
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
                          <span lang="ko">{getZoneLabel(item)}</span>
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
