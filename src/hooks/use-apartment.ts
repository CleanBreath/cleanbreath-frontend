/**
 * Apartment API React Query 훅
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllApartments } from "@/api";
import type { ApartmentListResponse } from "@/types";

export const apartmentKeys = {
  all: ["apartment"] as const,
  list: () => [...apartmentKeys.all, "list"] as const,
};

export function useApartmentList() {
  return useQuery<ApartmentListResponse>({
    queryKey: apartmentKeys.list(),
    queryFn: getAllApartments,
  });
}
