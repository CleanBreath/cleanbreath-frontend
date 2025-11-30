/**
 * Address API (금연/흡연구역)
 */

import { apiGet, apiPost } from "./client";
import type {
  AllAddressResponse,
  AddressItem,
  UpdateDateRequest,
  UpdateDateResponse,
  UpdateNotNeededResponse,
} from "@/types";

/** 전체 구역 조회 */
export async function getAllAddress(): Promise<AllAddressResponse> {
  return apiGet<AllAddressResponse>("/allAddress");
}

/** 좌표로 구역 검색 */
export async function getAddressByCoords(
  lat: number,
  lng: number
): Promise<AddressItem> {
  return apiGet<AddressItem>("/address", {
    params: { lat, lng },
  });
}

/** 데이터 업데이트 확인 */
export async function checkUpdateDate(
  updateDate: string
): Promise<UpdateDateResponse | UpdateNotNeededResponse> {
  const request: UpdateDateRequest = { updateDate };
  return apiPost<
    UpdateDateResponse | UpdateNotNeededResponse,
    UpdateDateRequest
  >("/updateDate", request);
}

/** 업데이트 응답 타입 가드 */
export function isUpdateNeeded(
  response: UpdateDateResponse | UpdateNotNeededResponse
): response is UpdateDateResponse {
  return "data" in response && Array.isArray(response.data);
}
