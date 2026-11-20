"use client";

import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { CategoryBadge } from "@/components/board/category-badge";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import { useSmokingAreaList } from "@/hooks/use-smoking-area";
import { Link } from "@/i18n/navigation";
import { getZoneLabel } from "@/lib/board-zone";
import { cn } from "@/lib/utils";
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
  const {
    data: fetched,
    isLoading,
    isError,
    isPlaceholderData,
    errorUpdatedAt,
    refetch,
  } = useSmokingAreaList(page, size);
  // v5는 데이터 없는 쿼리를 다시 가져오면 status를 'pending'으로 되돌려 isError가 곧바로 false가 된다.
  // 재시도 중임을 따로 기억해 실패 화면(누른 다시 시도 버튼)을 그대로 둔다.
  // 재시도 중에도 페이지네이션이 남아 있으므로 어느 페이지의 재시도인지 함께 기억한다
  const [retryingPage, setRetryingPage] = useState<number | null>(null);
  const retrying = retryingPage === page;
  const mainRef = useRef<HTMLElement>(null);
  // 재시도가 끝났을 때 사용자가 아직 그 페이지에 있는지 확인하는 용도
  const pageRef = useRef(page);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  // 서버 첫 페이지는 쿼리 캐시에 넣지 않고 화면에만 쓴다.
  // SSR의 QueryClient가 요청 사이에 공유되는 싱글턴이라 initialData로 넣으면 이전 렌더 값이 남을 수 있다.
  // 클라이언트 조회가 끝나면(또는 실패하면) 그 결과 / 서버 값 순으로 보여준다
  const data = fetched ?? (page === 0 ? initialFirstPage : undefined);
  // 이 페이지 조회가 실패했는지. 재시도 중 keepPreviousData로 돌아온 이전 페이지 행은 이 페이지 데이터로 보지 않는다
  const failed = (isError || retrying) && (!data || isPlaceholderData);

  const items = data?.content ?? [];
  const pageInfo = data?.page;
  // 마지막으로 안 전체 페이지 수. 어떤 페이지 조회가 실패해 data가 비어도 페이지네이션(누른 버튼)을 유지해 이전 페이지로 돌아갈 수 있게 한다
  const [knownTotalPages, setKnownTotalPages] = useState(
    initialFirstPage?.page.totalPages ?? 0,
  );
  if (pageInfo && pageInfo.totalPages !== knownTotalPages)
    setKnownTotalPages(pageInfo.totalPages);
  const totalPages = pageInfo?.totalPages ?? knownTotalPages;

  const retry = async () => {
    // aria-disabled는 클릭을 막지 않으므로 재시도 중 중복 요청은 여기서 막는다
    if (retrying) return;
    const target = page;
    setRetryingPage(target);
    try {
      const result = await refetch();
      // 성공하면 누른 버튼이 목록으로 바뀌어 사라지므로 본문으로 포커스를 옮긴다 (그사이 다른 페이지로 갔으면 건드리지 않음)
      if (!result.isError && pageRef.current === target)
        mainRef.current?.focus();
    } finally {
      setRetryingPage((p) => (p === target ? null : p));
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <PageHeader
        title={t("list.title")}
        description={t("list.description")}
        icon={<ClipboardList />}
      />

      {/* 재시도 성공 후 포커스를 받는 자리 (tabIndex=-1) */}
      <main
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base"
      >
        <PageSection title={t("list.sectionTitle")}>
          {/* 항상 렌더되는 live region. 문구만 바뀌어야 스크린 리더가 로딩을 읽는다.
              다음 페이지를 불러오는 동안(이전 페이지 행을 흐리게 보여 줄 때)도 같은 문구를 읽힌다 */}
          <div role="status">
            {!failed && isLoading && !data && (
              <p className="py-8 text-center text-muted-foreground">
                {tc("loading")}
              </p>
            )}
            {!failed && isPlaceholderData && (
              <p className="sr-only">{tc("loading")}</p>
            )}
          </div>
          {failed ? (
            // 조회 실패(야간 DB 정지 등)는 빈 목록이 아니라 실패로 알리고 다시 시도할 수 있게 한다
            <div className="flex flex-col items-center gap-4 py-8">
              {/* 실패할 때마다 다시 삽입해 같은 문구라도 다시 읽히게 한다 */}
              <p
                key={errorUpdatedAt}
                role="alert"
                className="text-center text-muted-foreground"
              >
                {t("list.loadFailed")}
              </p>
              <Button
                variant="outline"
                size="touch"
                // 누른 버튼에 포커스가 남도록 disabled 대신 aria-disabled와 핸들러 가드로 막는다
                aria-disabled={retrying || undefined}
                onClick={retry}
              >
                {retrying ? tc("loading") : tc("retry")}
              </Button>
            </div>
          ) : isLoading && !data ? null : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <p className="text-center text-muted-foreground">
                {t("list.empty")}
              </p>
              <Button variant="outline" size="touch" asChild>
                <Link href="/register">{t("list.emptyAction")}</Link>
              </Button>
            </div>
          ) : (
            // 다음 페이지를 불러오는 동안 보이는 행은 이전 페이지 것이라 흐리게 하고 aria-busy로 알린다
            <div
              aria-busy={isPlaceholderData || undefined}
              className={cn(
                "overflow-x-auto transition-opacity motion-reduce:transition-none",
                isPlaceholderData && "opacity-60",
              )}
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    {/* 좁은 화면에서는 DB 번호 열을 숨겨 제목 열에 폭을 준다 */}
                    <th className="w-16 pr-4 pb-2 font-medium max-sm:hidden">
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
                      <td className="pr-4 text-sm text-muted-foreground tabular-nums max-sm:hidden">
                        {item.id}
                      </td>
                      <td className="pr-4">
                        <Link
                          href={`/board/${item.id}`}
                          className="flex min-h-12 items-center py-2 font-medium hover:underline"
                        >
                          {/* 백엔드 원문 데이터라 en/ja 화면에서도 한국어로 읽히게 */}
                          <span lang="ko" className="break-keep">
                            {getZoneLabel(item)}
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
              className="flex flex-wrap items-center justify-center gap-3 pt-6"
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

              {/* 계속 마운트된 채 바뀐 페이지 번호를 알린다 */}
              <span
                aria-live="polite"
                className="px-2 text-sm text-muted-foreground tabular-nums"
              >
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
