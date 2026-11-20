"use client";

import { useParams } from "next/navigation";
import { BoardDetail } from "@/components/board/board-detail";
import { BoardList } from "@/components/board/board-list";
import { BOARD_PAGE_SIZE, parseBoardId } from "@/lib/board-zone";

// 서버 렌더링이 예기치 않게 실패한 경우의 안전망: 기존처럼 클라이언트에서 상세를 불러온다
export default function BoardDetailError() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = parseBoardId(rawId ?? "");
  if (id === null) return <BoardList size={BOARD_PAGE_SIZE} />;
  return <BoardDetail id={id} />;
}
