"use client";

import { BoardList } from "@/components/board/board-list";
import { BOARD_PAGE_SIZE } from "@/lib/board-zone";

// 이전에 성공한 페이지가 없는데 서버 조회가 실패한 경우의 안전망: 기존처럼 클라이언트에서 목록을 불러온다
export default function BoardError() {
  return <BoardList size={BOARD_PAGE_SIZE} />;
}
