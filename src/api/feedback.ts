/**
 * Feedback API (피드백)
 * 목록·상세·수정·삭제는 관리자 토큰이 필요해 브라우저에서 호출하지 않는다.
 */

import type { FeedbackAddRequest, MessageResponse } from "@/types";
import { apiPost } from "./client";

/** 피드백 등록 */
export async function addFeedback(
  data: FeedbackAddRequest,
): Promise<MessageResponse> {
  return apiPost<MessageResponse, FeedbackAddRequest>("/feedback/add", data);
}
