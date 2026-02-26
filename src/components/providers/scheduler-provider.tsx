/**
 * 데이터 업데이트 스케줄러 Provider
 * 앱 시작 시 자동으로 스케줄러를 초기화하고 매월 말 업데이트 확인
 */

"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { scheduleMonthlyUpdate, checkOnStartup } from "@/lib/scheduler";
import { addressKeys } from "@/hooks/use-address";
import { apartmentKeys } from "@/hooks/use-apartment";

export function SchedulerProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 업데이트 시 React Query 캐시 무효화
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      queryClient.invalidateQueries({ queryKey: apartmentKeys.list() });
      console.log("데이터 업데이트 완료, 캐시 무효화됨");
    };

    // 앱 시작 시 즉시 확인 (24시간마다)
    checkOnStartup(handleUpdate);

    // 매월 말 자동 업데이트 스케줄링
    const cleanup = scheduleMonthlyUpdate(handleUpdate);

    // 컴포넌트 언마운트 시 스케줄러 정리
    return cleanup;
  }, [queryClient]);

  return <>{children}</>;
}
