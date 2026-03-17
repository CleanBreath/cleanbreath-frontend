/**
 * 흡연구역 게시판 API
 */

import { apiGet, apiPost } from "./client";
import type {
  SmokingAreaPageResponse,
  SmokingAreaDetail,
  SmokingAreaVoteRequest,
} from "@/types";

/** 등록된 구역 페이징 목록 조회 */
export async function getSmokingAreaList(
  page = 0,
  size = 10,
): Promise<SmokingAreaPageResponse> {
  return apiGet<SmokingAreaPageResponse>("/allRequestAddressPage", {
    params: { page, size },
  });
}

/** 흡연구역 상세 조회 */
export async function getSmokingAreaDetail(
  id: number,
): Promise<SmokingAreaDetail> {
  return apiGet<SmokingAreaDetail>(`/smokingArea/${id}`);
}

/** 흡연구역 투표 */
export async function voteSmokingArea(
  id: number,
  data: SmokingAreaVoteRequest,
): Promise<void> {
  return apiPost<void, SmokingAreaVoteRequest>(`/smokingArea/${id}/vote`, data);
}
