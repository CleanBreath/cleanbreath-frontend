/**
 * Apartment API (공동주택 금연구역)
 */

import { apiGet } from "./client";
import type { ApartmentListResponse } from "@/types";

/** 전체 공동주택 조회 */
export async function getAllApartments(): Promise<ApartmentListResponse> {
  return apiGet<ApartmentListResponse>("/apartment");
}

/** 지역별 공동주택 조회 */
export async function getApartmentsByRegion(
  region: string
): Promise<ApartmentListResponse> {
  return apiGet<ApartmentListResponse>("/region", {
    params: { r: region },
  });
}
