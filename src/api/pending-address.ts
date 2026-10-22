/**
 * Pending Address API (신규 구역 제안)
 */

import type {
  MessageResponse,
  PendingAddressListResponse,
  PendingAddressPageResponse,
  SmokingAreaAddRequest,
} from "@/types";
import { apiGet, apiPost } from "./client";

/** 제안된 구역 전체 조회 */
export async function getAllPendingAddresses(): Promise<PendingAddressListResponse> {
  return apiGet<PendingAddressListResponse>("/allRequestAddress");
}

/** 제안된 구역 페이징 조회 */
export async function getPendingAddressesPage(
  page = 0,
  size = 20,
): Promise<PendingAddressPageResponse> {
  return apiGet<PendingAddressPageResponse>("/allRequestAddressPage", {
    params: { page, size },
  });
}

/** 신규 흡연구역 제안 */
export async function addSmokingArea(
  data: SmokingAreaAddRequest,
): Promise<MessageResponse> {
  return apiPost<MessageResponse, SmokingAreaAddRequest>(
    "/smokingArea/add",
    data,
  );
}
