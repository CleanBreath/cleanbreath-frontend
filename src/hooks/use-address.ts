/**
 * Address API React Query 훅
 * IndexedDB 캐시를 우선 조회하고, 없으면 API 호출
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllAddress } from "@/api";
import {
  getAddresses,
  saveAddresses,
  getMetadata,
  isDataExpired,
} from "@/lib/indexeddb";
import type { AllAddressResponse } from "@/types";

export const addressKeys = {
  all: ["address"] as const,
  list: () => [...addressKeys.all, "list"] as const,
};

/**
 * IndexedDB 우선 조회 후 API fallback
 */
async function fetchAddressesWithCache(): Promise<AllAddressResponse> {
  // 1. IndexedDB에서 데이터 조회
  const cachedAddresses = await getAddresses();
  const cachedUpdateAt = await getMetadata("addresses_updateAt");

  // 2. 캐시가 있고 만료되지 않았으면 반환
  if (cachedAddresses && cachedUpdateAt && !(await isDataExpired())) {
    return {
      count: cachedAddresses.length,
      updateAt: String(cachedUpdateAt),
      data: cachedAddresses,
    };
  }

  // 3. 캐시가 없거나 만료되었으면 API 호출
  try {
    const response = await getAllAddress();

    // 4. API 응답을 IndexedDB에 저장
    await saveAddresses(response.data, response.updateAt);

    return response;
  } catch (error) {
    // 5. API 호출 실패 시 캐시된 데이터라도 반환 (fallback)
    if (cachedAddresses && cachedUpdateAt) {
      console.warn("API 호출 실패, 캐시된 데이터 사용:", error);
      return {
        count: cachedAddresses.length,
        updateAt: String(cachedUpdateAt),
        data: cachedAddresses,
      };
    }

    // 6. 캐시도 없고 API도 실패하면 에러 throw
    throw error;
  }
}

export function useAddressList() {
  return useQuery<AllAddressResponse>({
    queryKey: addressKeys.list(),
    queryFn: fetchAddressesWithCache,
    staleTime: 1000 * 60 * 60, // 1시간 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 유지
  });
}
