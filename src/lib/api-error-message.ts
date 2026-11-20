import { useLocale, useTranslations } from "next-intl";
import { ApiError } from "@/api";

/**
 * API 오류를 화면에 보여 줄 문구로 바꾸는 함수를 돌려주는 훅.
 * 한국어는 지금처럼 백엔드 message를 그대로 쓰고, 영어·일본어는 상태 코드별 errors 문구를 쓴다
 * (백엔드 message가 한국어라서). 응답이 없는 네트워크 실패(status 0)는 모든 언어에서 errors.network
 * @example const apiErrorMessage = useApiErrorMessage(); setError(apiErrorMessage(error, t("submitFailed")));
 */
export function useApiErrorMessage() {
  const locale = useLocale();
  const t = useTranslations("errors");

  /** @param fallback ApiError가 아닌 오류(코드 버그 등)에 보여 줄 문구. 생략하면 errors.generic */
  return (error: unknown, fallback?: string): string => {
    if (!(error instanceof ApiError)) return fallback ?? t("generic");
    const { status } = error;
    // 응답이 없으면(네트워크 실패) 한국어도 연결 오류 문구를 쓴다
    if (status === 0) return t("network");
    if (locale === "ko") return error.message;

    if (status === 400) return t("badRequest");
    if (status === 401 || status === 403) return t("unauthorized");
    if (status === 404) return t("notFound");
    if (status === 429) return t("tooManyRequests");
    if (status >= 500) return t("server");
    return t("generic");
  };
}
