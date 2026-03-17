"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  useSmokingAreaDetail,
  useSmokingAreaVote,
} from "@/hooks/use-smoking-area";
import { DetailKakaoMap } from "@/components/map/detail-kakao-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

function categoryVariant(category: string) {
  return category === "SMOKING"
    ? ("destructive" as const)
    : ("default" as const);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-4">
        <p className="text-muted-foreground">데이터를 찾을 수 없습니다.</p>
        <Button variant="outline" asChild>
          <Link href="/board">목록으로</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      {/* 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" asChild>
              <Link href="/board">
                <ArrowLeft size={18} />
              </Link>
            </Button>
            <div className="flex-1 space-y-1">
              <CardTitle className="text-lg">
                {data.addressName}
                {data.buildingName && ` ${data.buildingName}`}
              </CardTitle>
              <Badge variant={categoryVariant(data.category)}>
                {categoryLabel(data.category)}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 지도 */}
      <Card>
        <CardContent className="p-0 overflow-hidden rounded-xl">
          <div className="h-80 w-full">
            <DetailKakaoMap
              latitude={data.latitude}
              longitude={data.longitude}
              paths={data.paths}
            />
          </div>
        </CardContent>
      </Card>

      {/* 투표 */}
      <Card>
        <CardContent className="flex items-center justify-center gap-4 py-6">
          <Button
            variant="outline"
            className="flex items-center gap-2 min-w-28"
            onClick={() => handleVote(true)}
            disabled={voteMutation.isPending}
          >
            <ThumbsUp size={16} className="text-green-500" />
            사실이에요
            <span className="font-semibold">{data.truthCount}</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 min-w-28"
            onClick={() => handleVote(false)}
            disabled={voteMutation.isPending}
          >
            <ThumbsDown size={16} className="text-red-500" />
            아니에요
            <span className="font-semibold">{data.untruthCount}</span>
          </Button>
        </CardContent>
      </Card>

      {/* 목록으로 */}
      <div className="flex justify-center">
        <Button variant="ghost" asChild>
          <Link href="/board">
            <ArrowLeft size={16} />
            목록으로
          </Link>
        </Button>
      </div>
    </div>
  );
}
