/** 제한 시간 초과(withDeadline 또는 AbortSignal.timeout)로 끝난 오류인지 */
export function isTimeoutError(error: unknown): boolean {
  return (error as { name?: string } | null)?.name === "TimeoutError";
}

/**
 * 서버 조회의 전체 제한 시간.
 * Next는 데이터 캐시의 오래된(stale) 항목을 다시 받을 때 fetch의 signal을 넘기지 않으므로
 * (next/dist/server/lib/patch-fetch.js "don't pass through signal when revalidating")
 * AbortSignal.timeout만으로는 야간 DB 중지 중 재생성이 백엔드 응답을 끝없이 기다릴 수 있다.
 * 그래서 타이머로 기다림 자체를 끊는다 (요청은 백그라운드에서 끝나고 결과는 버려진다)
 */
export async function withDeadline<T>(
  work: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () =>
        reject(
          Object.assign(new Error(`${label}: ${ms}ms 안에 응답이 없습니다`), {
            name: "TimeoutError",
          }),
        ),
      ms,
    );
  });
  // 제한 시간 뒤에 끝난 요청의 거부가 처리되지 않은 거부로 남지 않게 한다
  work.catch(() => {});
  try {
    return await Promise.race([work, timeout]);
  } finally {
    clearTimeout(timer);
  }
}
