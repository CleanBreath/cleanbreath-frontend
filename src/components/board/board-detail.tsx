"use client";

import { ArrowLeft, Info, MapPin, ThumbsDown, ThumbsUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { ApiError } from "@/api";
import { CategoryBadge } from "@/components/board/category-badge";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { DetailNaverMap } from "@/components/map/detail-naver-map";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useSmokingAreaDetail,
  useSmokingAreaVote,
} from "@/hooks/use-smoking-area";
import { Link } from "@/i18n/navigation";
import { useApiErrorMessage } from "@/lib/api-error-message";
import { getZoneName, hasBuildingName } from "@/lib/board-zone";
import { getClientToken } from "@/lib/client-token";
import type { SmokingAreaDetail } from "@/types";

interface BoardDetailProps {
  id: number;
  /** 서버에서 받아둔 상세 데이터. 없으면(야간 DB 중지 등) 클라이언트에서만 불러온다 */
  initialDetail?: SmokingAreaDetail;
}

export function BoardDetail({ id, initialDetail }: BoardDetailProps) {
  const t = useTranslations("board");
  const tc = useTranslations("common");
  const {
    data: fetched,
    isLoading,
    isError,
    error,
    errorUpdatedAt,
    refetch,
  } = useSmokingAreaDetail(id);
  const voteMutation = useSmokingAreaVote();
  const apiErrorMessage = useApiErrorMessage();
  // v5는 데이터 없는 쿼리를 다시 가져오면 status를 'pending'으로 되돌려 isError가 곧바로 false가 된다.
  // 재시도 중임을 따로 기억해 실패 화면(누른 다시 시도 버튼)을 그대로 둔다
  const [retrying, setRetrying] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // 백엔드는 없는 id에 404, 형식이 틀린 id에 400을 준다 (lib/seo/board-data와 같은 기준).
  // 그 밖의 실패(야간 DB 정지 등)는 '찾을 수 없음'이 아니라 불러오기 실패로 보여 준다
  const isNotFound =
    error instanceof ApiError && (error.status === 404 || error.status === 400);

  // 서버 값은 쿼리 캐시에 넣지 않고 화면에만 쓴다 (SSR QueryClient가 요청 간 공유 싱글턴).
  // 투표 후 invalidate로 다시 받은 값이 있으면 그 값을 우선한다
  const data = fetched ?? initialDetail;
  const failed = !data && ((isError && !isNotFound) || retrying);

  const retry = async () => {
    // aria-disabled는 클릭을 막지 않으므로 재시도 중 중복 요청은 여기서 막는다
    if (retrying) return;
    setRetrying(true);
    try {
      const result = await refetch();
      // 성공하면 누른 버튼이 상세 내용으로 바뀌어 사라지므로 본문으로 포커스를 옮긴다
      if (!result.isError) mainRef.current?.focus();
    } finally {
      setRetrying(false);
    }
  };

  /** 투표 핸들러 */
  function handleVote(isTruth: boolean) {
    // aria-disabled는 클릭을 막지 않으므로 전송 중 중복 투표는 여기서 막는다
    if (voteMutation.isPending) return;
    const clientToken = getClientToken();
    voteMutation.mutate({ id, data: { clientToken, isTruth } });
  }

  const showBuilding = data ? hasBuildingName(data) : false;

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      {/* 데이터가 있으면 구역 이름을 h1로, 아직 없으면 고정 문구 */}
      <PageHeader
        title={
          data ? (
            <span lang="ko" className="break-keep">
              {getZoneName(data)}
            </span>
          ) : (
            t("detail.title")
          )
        }
        description={
          data && showBuilding ? (
            <span lang="ko" className="break-keep">
              {data.addressName}
            </span>
          ) : (
            t("detail.description")
          )
        }
        icon={<MapPin />}
        backHref="/board"
        backLabel={t("backToList")}
      />

      {/* 재시도 성공 후 포커스를 받는 자리 (tabIndex=-1) */}
      <main
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base"
      >
        {failed ? (
          <div className="flex flex-col items-center gap-4 py-16">
            {/* 실패할 때마다 다시 삽입해 같은 문구라도 다시 읽히게 한다 */}
            <p
              key={errorUpdatedAt}
              role="alert"
              className="text-center text-muted-foreground"
            >
              {t("detail.loadFailed")}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                size="touch"
                // 누른 버튼에 포커스가 남도록 disabled 대신 aria-disabled와 핸들러 가드로 막는다
                aria-disabled={retrying || undefined}
                onClick={retry}
              >
                {retrying ? tc("loading") : tc("retry")}
              </Button>
              <Button variant="ghost" size="touch" asChild>
                <Link href="/board">{t("backToList")}</Link>
              </Button>
            </div>
          </div>
        ) : isLoading && !data ? (
          <p role="status" className="py-16 text-center text-muted-foreground">
            {tc("loading")}
          </p>
        ) : !data ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <p className="text-muted-foreground">{t("detail.notFound")}</p>
            <Button variant="outline" size="touch" asChild>
              <Link href="/board">{t("backToList")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <PageSection title={t("detail.infoTitle")}>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
                <dt className="text-sm text-muted-foreground">
                  {t("detail.fields.category")}
                </dt>
                <dd>
                  <CategoryBadge category={data.category} />
                </dd>
                <dt className="text-sm text-muted-foreground">
                  {t("detail.fields.address")}
                </dt>
                <dd lang="ko" className="break-keep">
                  {data.addressName}
                </dd>
                {showBuilding && (
                  <>
                    <dt className="text-sm text-muted-foreground">
                      {t("detail.fields.building")}
                    </dt>
                    <dd lang="ko" className="break-keep">
                      {data.buildingName}
                    </dd>
                  </>
                )}
              </dl>
              <p className="mt-4 flex gap-2 text-sm text-muted-foreground">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                {t("detail.pendingNotice")}
              </p>
            </PageSection>

            {/* 지도 */}
            <Card className="gap-0 overflow-hidden py-0 shadow-none">
              <div className="h-80 w-full">
                <DetailNaverMap
                  latitude={data.latitude}
                  longitude={data.longitude}
                  paths={data.paths}
                />
              </div>
            </Card>

            {/* 투표 */}
            <PageSection title={t("detail.voteTitle")}>
              {/* 들어가면 한 줄에 같은 폭, 좁으면 전체 폭으로 쌓는다 (버튼이 nowrap이라 2열 그리드는 320px에서 넘침) */}
              <div className="flex flex-wrap gap-3">
                {/* 전송 중에도 누른 버튼에 포커스가 남도록 disabled 대신 aria-disabled */}
                <Button
                  variant="outline"
                  size="touch"
                  className="flex-1 gap-1.5"
                  onClick={() => handleVote(true)}
                  aria-disabled={voteMutation.isPending || undefined}
                >
                  <ThumbsUp aria-hidden />
                  {t("detail.voteTrue")}
                  <span className="font-semibold tabular-nums">
                    {data.truthCount}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="touch"
                  className="flex-1 gap-1.5"
                  onClick={() => handleVote(false)}
                  aria-disabled={voteMutation.isPending || undefined}
                >
                  <ThumbsDown aria-hidden />
                  {t("detail.voteFalse")}
                  <span className="font-semibold tabular-nums">
                    {data.untruthCount}
                  </span>
                </Button>
              </div>
              {/* 투표 전에도 렌더해 스크린 리더가 이 live region을 미리 알게 한다 */}
              <p role="status" className="sr-only">
                {voteMutation.isSuccess ? t("detail.voteDone") : ""}
              </p>
              {voteMutation.isError && (
                <p
                  role="alert"
                  className="mt-3 text-center text-sm text-destructive"
                >
                  {apiErrorMessage(voteMutation.error)}
                </p>
              )}
            </PageSection>

            {/* 목록으로 */}
            <div className="flex justify-center">
              <Button variant="ghost" size="touch" asChild>
                <Link href="/board">
                  <ArrowLeft aria-hidden />
                  {t("backToList")}
                </Link>
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
