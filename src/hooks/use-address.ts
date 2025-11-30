/**
 * Address API React Query 훅
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllAddress } from "@/api";
import type { AllAddressResponse } from "@/types";

export const addressKeys = {
  all: ["address"] as const,
  list: () => [...addressKeys.all, "list"] as const,
};

export function useAddressList() {
  return useQuery<AllAddressResponse>({
    queryKey: addressKeys.list(),
    queryFn: getAllAddress,
  });
}
