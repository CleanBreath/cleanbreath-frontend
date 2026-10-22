"use client";

import {
  ArrowLeft,
  Cigarette,
  CigaretteOff,
  MapPin,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { DetailNaverMap } from "@/components/map/detail-naver-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useSmokingAreaDetail,
  useSmokingAreaVote,
} from "@/hooks/use-smoking-area";
import { getClientToken } from "@/lib/client-token";

/** 카테고리 한글 라벨 */
function categoryLabel(category: string) {
  switch (category) {
    case "NON_SMOKING":
      return "금연구역";
    case "SMOKING":
      return "흡연구역";
    default:
      return category;
  }
}

/** 카테고리 뱃지: 색 + 아이콘 + 라벨 (zone ink 토큰은 흰 글자 대비 4.5:1 이상) */
function CategoryBadge({ category }: { category: string }) {
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
      {categoryLabel(category)}
    </Badge>
  );
}

export default function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = use(params);
  const id = Number(idStr);
  const { data, isLoading } = useSmokingAreaDetail(id);
  const voteMutation = useSmokingAreaVote();

  /** 투표 핸들러 */
  function handleVote(isTruth: boolean) {
    const clientToken = getClientToken();
    voteMutation.mutate({ id, data: { clientToken, isTruth } });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      {/* 상세 데이터는 클라이언트에서 받아오므로 h1은 고정 문구로 서버 HTML에 둔다 */}
      <PageHeader
        title="구역 상세 정보"
        description="등록 요청된 구역의 위치와 투표 현황"
        icon={<MapPin />}
        backHref="/board"
        backLabel="목록으로"
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base">
        {isLoading ? (
          <p role="status" className="py-16 text-center text-muted-foreground">
            불러오는 중...
          </p>
        ) : !data ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <p className="text-muted-foreground">데이터를 찾을 수 없습니다.</p>
            <Button variant="outline" size="touch" asChild>
              <Link href="/board">목록으로</Link>
            </Button>
          </div>
        ) : (
          <>
            <PageSection
              title={
                <>
                  {data.addressName}
                  {data.buildingName && ` ${data.buildingName}`}
                </>
              }
            >
              <CategoryBadge category={data.category} />
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
            <PageSection title="이 정보가 사실인가요?">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="touch"
                  className="gap-1.5"
                  onClick={() => handleVote(true)}
                  disabled={voteMutation.isPending}
                >
                  <ThumbsUp aria-hidden className="text-primary" />
                  사실이에요
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
                  아니에요
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
                  목록으로
                </Link>
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
