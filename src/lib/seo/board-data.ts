/**
 * 게시판(흡연구역 제안) 서버 전용 조회 함수.
 * 운영 DB가 매일 밤(23:00~08:30 KST) 꺼지므로 실패를 예외 대신 결과값으로 돌려준다.
 * Next fetch 데이터 캐시(next.revalidate)를 쓰려고 axios(src/api) 대신 fetch를 쓴다.
 * 200 응답만 캐시되므로 오류 응답이 캐시에 남지 않는다
 */

import { cache } from "react";
import type { SmokingAreaDetail, SmokingAreaPageResponse } from "@/types";
import { withDeadline } from "./deadline";

// src/api/client.ts와 같은 기본값
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1";

/**
 * 백엔드가 응답하지 않을 때(DB 중지로 연결 대기 등) 렌더링을 오래 붙잡지 않도록.
 * 오래된 캐시 재검증에서는 signal이 빠지므로 withDeadline으로도 끊는다
 */
const REQUEST_TIMEOUT_MS = 5000;

/** 게시판 데이터 캐시 주기(초). 페이지의 `export const revalidate`와 맞출 것 */
export const BOARD_REVALIDATE_SECONDS = 300;

/** 데이터 캐시 태그. 필요하면 revalidateTag로 한 번에 갱신할 수 있다 */
export const BOARD_CACHE_TAG = "smoking-area";

export type BoardFetchResult<T> =
  | { status: "ok"; data: T; fetchedAt: number }
  | { status: "not-found" }
  | { status: "error" };

async function fetchBoardJson<T>(
  path: string,
  revalidate: number,
): Promise<BoardFetchResult<T>> {
  try {
    const load = async (): Promise<BoardFetchResult<T>> => {
      const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: { Accept: "application/json" },
        next: { revalidate, tags: [BOARD_CACHE_TAG] },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      // 백엔드는 없는 id에 404, 숫자가 아닌 id에 400을 준다
      if (res.status === 404 || res.status === 400)
        return { status: "not-found" };
      if (!res.ok) return { status: "error" };
      return {
        status: "ok",
        data: (await res.json()) as T,
        fetchedAt: Date.now(),
      };
    };
    return await withDeadline(load(), REQUEST_TIMEOUT_MS, `GET ${path}`);
  } catch {
    // 네트워크 실패·타임아웃·JSON 파싱 실패 (야간 DB 중지 포함)
    return { status: "error" };
  }
}

/** 등록 요청된 구역 목록 한 페이지. 목록에는 404가 없으므로 not-found도 오류로 본다 */
export async function fetchBoardListPage(
  page: number,
  size: number,
  revalidate = BOARD_REVALIDATE_SECONDS,
): Promise<BoardFetchResult<SmokingAreaPageResponse>> {
  const result = await fetchBoardJson<SmokingAreaPageResponse>(
    `/allRequestAddressPage?page=${page}&size=${size}`,
    revalidate,
  );
  if (result.status === "not-found") return { status: "error" };
  if (result.status === "ok" && !Array.isArray(result.data?.content)) {
    return { status: "error" };
  }
  return result;
}

/**
 * 구역 상세 조회. generateMetadata와 페이지가 같은 요청 안에서 한 번만 부르도록 cache로 감싼다
 */
export const fetchBoardDetail = cache(
  async (id: number): Promise<BoardFetchResult<SmokingAreaDetail>> => {
    const result = await fetchBoardJson<SmokingAreaDetail>(
      `/smokingArea/${id}`,
      BOARD_REVALIDATE_SECONDS,
    );
    if (result.status === "ok" && typeof result.data?.id !== "number") {
      return { status: "error" };
    }
    return result;
  },
);

/**
 * 운영 서버의 ISR 재생성 중 API가 실패하면 예외를 던져 마지막으로 성공한 페이지를 계속 내보낸다.
 * 빌드(next build)와 개발 서버에서는 던지지 않고 데이터 없이 렌더링한다 (빌드가 API 상태에 묶이지 않게)
 */
export function shouldKeepLastGoodPage(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build"
  );
}
