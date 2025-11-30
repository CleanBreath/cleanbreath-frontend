/**
 * Feedback API 관련 타입 정의
 */

export interface FeedbackListItem {
  feedbackId: number;
  createAt: string;
  title: string;
}

export interface FeedbackDetail {
  id: number;
  createAt: string;
  title: string;
  content: string;
}

export interface FeedbackAddRequest {
  title: string;
  content: string;
}

export interface FeedbackUpdateRequest {
  updateAt: string;
  title: string;
  content: string;
}

export type FeedbackListResponse = FeedbackListItem[];
