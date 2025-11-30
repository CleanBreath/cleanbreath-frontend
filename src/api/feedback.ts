/**
 * Feedback API (피드백)
 */

import type {
  FeedbackAddRequest,
  FeedbackDetail,
  FeedbackListResponse,
  FeedbackUpdateRequest,
  MessageResponse,
} from "@/types";
import { apiGet, apiPost, apiPut, apiDelete } from "./client";

/** 피드백 목록 조회 */
export async function getFeedbackList(): Promise<FeedbackListResponse> {
  return apiGet<FeedbackListResponse>("/feedback-list");
}

/** 피드백 상세 조회 */
export async function getFeedbackById(id: number): Promise<FeedbackDetail> {
  return apiGet<FeedbackDetail>(`/feedback/${id}`);
}

/** 피드백 등록 */
export async function addFeedback(
  data: FeedbackAddRequest
): Promise<MessageResponse> {
  return apiPost<MessageResponse, FeedbackAddRequest>("/feedback/add", data);
}

/** 피드백 수정 */
export async function updateFeedback(
  id: number,
  data: FeedbackUpdateRequest
): Promise<MessageResponse> {
  return apiPut<MessageResponse, FeedbackUpdateRequest>(
    `/feedback/${id}`,
    data
  );
}

/** 피드백 삭제 */
export async function deleteFeedback(id: number): Promise<MessageResponse> {
  return apiDelete<MessageResponse>(`/feedback/${id}`);
}
