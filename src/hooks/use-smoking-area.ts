/**
 * 흡연구역 게시판 React Query 훅
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSmokingAreaList,
  getSmokingAreaDetail,
  voteSmokingArea,
} from "@/api";
import type {
  SmokingAreaPageResponse,
  SmokingAreaDetail,
  SmokingAreaVoteRequest,
} from "@/types";

export const smokingAreaKeys = {
  all: ["smoking-area"] as const,
  list: (page: number, size: number) =>
    [...smokingAreaKeys.all, "list", page, size] as const,
  detail: (id: number) => [...smokingAreaKeys.all, "detail", id] as const,
};

/** 등록된 구역 페이징 목록 조회 */
export function useSmokingAreaList(page = 0, size = 10) {
  return useQuery<SmokingAreaPageResponse>({
    queryKey: smokingAreaKeys.list(page, size),
    queryFn: () => getSmokingAreaList(page, size),
  });
}

/** 흡연구역 상세 조회 (id가 있을 때만 실행) */
export function useSmokingAreaDetail(id: number | undefined) {
  return useQuery<SmokingAreaDetail>({
    queryKey: smokingAreaKeys.detail(id!),
    queryFn: () => getSmokingAreaDetail(id!),
    enabled: id !== undefined,
  });
}

/** 흡연구역 투표 뮤테이션 */
export function useSmokingAreaVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SmokingAreaVoteRequest }) =>
      voteSmokingArea(id, data),
    onSuccess: (_result, variables) => {
      // 투표 후 상세 데이터 갱신
      queryClient.invalidateQueries({
        queryKey: smokingAreaKeys.detail(variables.id),
      });
    },
  });
}
