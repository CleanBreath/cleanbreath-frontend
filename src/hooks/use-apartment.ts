/**
 * Apartment API React Query 훅
 * IndexedDB 캐시를 우선 조회하고, 없으면 API 호출
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllApartments } from "@/api";
import { getApartments, saveApartments, isDataExpired } from "@/lib/indexeddb";
import type { ApartmentListResponse } from "@/types";

export const apartmentKeys = {
  all: ["apartment"] as const,
  list: () => [...apartmentKeys.all, "list"] as const,
};

/**
 * IndexedDB 우선 조회 후 API fallback
 */
async function fetchApartmentsWithCache(): Promise<ApartmentListResponse> {
  // 1. IndexedDB에서 데이터 조회
  const cachedApartments = await getApartments();

  // 2. 캐시가 있고 만료되지 않았으면 반환
  if (cachedApartments && !(await isDataExpired())) {
    return cachedApartments;
  }

  // 3. 캐시가 없거나 만료되었으면 API 호출
  try {
    const response = await getAllApartments();

    // 4. API 응답을 IndexedDB에 저장
    await saveApartments(response);

    return response;
  } catch (error) {
    // 5. API 호출 실패 시 캐시된 데이터라도 반환 (fallback)
    if (cachedApartments) {
      console.warn("API 호출 실패, 캐시된 데이터 사용:", error);
      return cachedApartments;
    }

    // 6. 캐시도 없고 API도 실패하면 에러 throw
    throw error;
  }
}

export function useApartmentList() {
  return useQuery<ApartmentListResponse>({
    queryKey: apartmentKeys.list(),
    queryFn: fetchApartmentsWithCache,
    staleTime: 1000 * 60 * 60, // 1시간 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 유지
  });
}
