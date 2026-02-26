/**
 * 데이터 업데이트 스케줄러
 * 매월 말 자동으로 최신 데이터를 확인하고 업데이트
 */

import { checkUpdateDate, isUpdateNeeded } from "@/api/address";
import { getAllAddress } from "@/api/address";
import { getAllApartments } from "@/api/apartment";
import {
  getMetadata,
  setMetadata,
  saveAddresses,
  saveApartments,
  clearExpiredData,
} from "./indexeddb";

/**
 * 최신 데이터 확인 및 업데이트
 */
export async function checkForUpdates(): Promise<boolean> {
  try {
    // 1. 만료된 데이터 삭제
    await clearExpiredData();

    // 2. 현재 저장된 updateAt 조회
    const currentUpdateAt = await getMetadata("addresses_updateAt");

    // 3. updateAt이 없으면 초기 로드 (스케줄러가 아닌 훅에서 처리)
    if (!currentUpdateAt) {
      return false;
    }

    // 4. API로 최신 데이터 확인
    const response = await checkUpdateDate(String(currentUpdateAt));

    // 5. 업데이트가 필요한지 확인
    if (!isUpdateNeeded(response)) {
      console.log("데이터가 최신 상태입니다.");
      await setMetadata("lastChecked", Date.now());
      return false;
    }

    // 6. 새 데이터 저장
    console.log("새 데이터 발견, 업데이트 중...");
    await saveAddresses(response.data, response.updateAt);

    // 7. 아파트 데이터도 함께 업데이트
    const apartments = await getAllApartments();
    await saveApartments(apartments);

    await setMetadata("lastChecked", Date.now());
    console.log("데이터 업데이트 완료");

    return true;
  } catch (error) {
    console.error("데이터 업데이트 확인 실패:", error);
    return false;
  }
}

/**
 * 다음 월말까지 남은 시간 계산 (밀리초)
 */
function getTimeUntilEndOfMonth(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // 다음 달 1일 00:00:00
  const nextMonth = new Date(year, month + 1, 1, 0, 0, 0);

  // 현재 달 마지막 날 23:59:59
  const endOfMonth = new Date(nextMonth.getTime() - 1000);

  return endOfMonth.getTime() - now.getTime();
}

/**
 * 매월 말 자동 업데이트 스케줄링
 */
export function scheduleMonthlyUpdate(onUpdate?: () => void): () => void {
  let timeoutId: NodeJS.Timeout | null = null;

  const scheduleNext = () => {
    const delay = getTimeUntilEndOfMonth();

    console.log(
      `다음 업데이트 예정: ${new Date(Date.now() + delay).toLocaleString()}`,
    );

    timeoutId = setTimeout(async () => {
      const updated = await checkForUpdates();

      // 업데이트가 있었으면 콜백 실행 (React Query 무효화 등)
      if (updated && onUpdate) {
        onUpdate();
      }

      // 다음 달 스케줄링
      scheduleNext();
    }, delay);
  };

  // 초기 스케줄링
  scheduleNext();

  // 클린업 함수 반환
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}

/**
 * 앱 시작 시 즉시 업데이트 확인 (선택적)
 */
export async function checkOnStartup(onUpdate?: () => void): Promise<void> {
  // 마지막 확인 시간 조회
  const lastChecked = await getMetadata("lastChecked");

  // 마지막 확인이 24시간 이상 지났으면 확인
  if (!lastChecked || typeof lastChecked !== "number") {
    const updated = await checkForUpdates();
    if (updated && onUpdate) {
      onUpdate();
    }
    return;
  }

  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  if (lastChecked < oneDayAgo) {
    const updated = await checkForUpdates();
    if (updated && onUpdate) {
      onUpdate();
    }
  }
}
