"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useSmokingAreaList } from "@/hooks/use-smoking-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

/** 카테고리 뱃지 variant */
function categoryVariant(category: string) {
  return category === "SMOKING"
    ? ("destructive" as const)
    : ("default" as const);
}

export default function BoardPage() {
  const [page, setPage] = useState(0);
  const size = 10;
  const { data, isLoading } = useSmokingAreaList(page, size);

  const items = data?.content ?? [];
  const pageInfo = data?.page;
  const totalPages = pageInfo?.totalPages ?? 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" asChild>
              <Link href="/">
                <ArrowLeft size={18} />
              </Link>
            </Button>
            <CardTitle className="text-xl">등록된 구역 게시판</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">
              불러오는 중...
            </p>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              등록된 구역이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 w-16">번호</th>
                    <th className="pb-2 pr-4">제목</th>
                    <th className="pb-2 w-24 text-center">카테고리</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 pr-4 text-muted-foreground">
                        {item.id}
                      </td>
                      <td className="py-3 pr-4">
                        <Link
                          href={`/board/${item.id}`}
                          className="hover:underline font-medium"
                        >
                          {item.addressName}
                          {item.buildingName && ` ${item.buildingName}`}
                        </Link>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant={categoryVariant(item.category)}>
                          {categoryLabel(item.category)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft size={16} />
                이전
              </Button>

              <span className="text-sm text-muted-foreground px-2">
                {page + 1} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
                <ChevronRight size={16} />
              </Button>
            </div>
          )}

          {/* 홈으로 돌아가기 */}
          <div className="flex justify-center pt-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">홈으로</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
