"use client";

import { ArrowLeft, Info, MapPin, ThumbsDown, ThumbsUp } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const { data: fetched, isLoading } = useSmokingAreaDetail(id);
  const voteMutation = useSmokingAreaVote();

  // 서버 값은 쿼리 캐시에 넣지 않고 화면에만 쓴다 (SSR QueryClient가 요청 간 공유 싱글턴).
  // 투표 후 invalidate로 다시 받은 값이 있으면 그 값을 우선한다
  const data = fetched ?? initialDetail;

  /** 투표 핸들러 */
  function handleVote(isTruth: boolean) {
    const clientToken = getClientToken();
    voteMutation.mutate({ id, data: { clientToken, isTruth } });
  }

  const showBuilding = data ? hasBuildingName(data) : false;

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      {/* 데이터가 있으면 구역 이름을 h1로, 아직 없으면 고정 문구 */}
      <PageHeader
        title={
          data ? <span lang="ko">{getZoneName(data)}</span> : t("detail.title")
        }
        description={
          data && showBuilding ? (
            <span lang="ko">{data.addressName}</span>
          ) : (
            t("detail.description")
          )
        }
        icon={<MapPin />}
        backHref="/board"
        backLabel={t("backToList")}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base">
        {isLoading && !data ? (
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
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="touch"
                  className="gap-1.5"
                  onClick={() => handleVote(true)}
                  disabled={voteMutation.isPending}
                >
                  <ThumbsUp aria-hidden className="text-primary" />
                  {t("detail.voteTrue")}
                  <span className="font-semibold tabular-nums">
                    {data.truthCount}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="touch"
                  className="gap-1.5"
                  onClick={() => handleVote(false)}
                  disabled={voteMutation.isPending}
                >
                  <ThumbsDown aria-hidden className="text-destructive" />
                  {t("detail.voteFalse")}
                  <span className="font-semibold tabular-nums">
                    {data.untruthCount}
                  </span>
                </Button>
              </div>
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
