/**
 * 서버 상태 확인 API
 */

import { apiGet } from "./client";

export interface HealthCheckResponse {
  status: string;
}

export async function checkServerHealth(): Promise<HealthCheckResponse> {
  return apiGet("/health");
}
