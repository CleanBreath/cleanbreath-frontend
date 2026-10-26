/**
 * Address API (금연/흡연구역)
 */

import type {
  AddressItem,
  AllAddressResponse,
  MapBounds,
  PublicZoneListResponse,
  UpdateDateRequest,
  UpdateDateResponse,
  UpdateNotNeededResponse,
} from "@/types";
import { apiGet, apiPost } from "./client";

/** 전체 구역 조회 */
export async function getAllAddress(): Promise<AllAddressResponse> {
  return apiGet<AllAddressResponse>("/allAddress");
}

/** 좌표로 구역 검색 */
export async function getAddressByCoords(
  lat: number,
  lng: number,
): Promise<AddressItem> {
  return apiGet<AddressItem>("/address", {
    params: { lat, lng },
  });
}

/** 화면 사각형 안의 공공데이터 실외 금연구역 (최대 3000건) */
export async function getPublicZonesWithin(
  bounds: MapBounds,
): Promise<PublicZoneListResponse> {
  return apiGet<PublicZoneListResponse>("/publicZone/within", {
    params: bounds,
  });
}

/** 데이터 업데이트 확인 */
export async function checkUpdateDate(
  updateDate: string,
): Promise<UpdateDateResponse | UpdateNotNeededResponse> {
  const request: UpdateDateRequest = { updateDate };
  return apiPost<
    UpdateDateResponse | UpdateNotNeededResponse,
    UpdateDateRequest
  >("/updateDate", request);
}

/** 업데이트 응답 타입 가드 */
export function isUpdateNeeded(
  response: UpdateDateResponse | UpdateNotNeededResponse,
): response is UpdateDateResponse {
  return "data" in response && Array.isArray(response.data);
}
