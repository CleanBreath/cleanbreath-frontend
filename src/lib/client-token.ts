/**
 * 클라이언트 토큰 유틸리티
 * 최초 방문 시 UUID를 생성하여 localStorage에 저장하고, 이후 방문 시 재사용
 */

const STORAGE_KEY = "cleanbreath_client_token";

/** 클라이언트 고유 토큰 반환 (없으면 생성) */
export function getClientToken(): string {
  if (typeof window === "undefined") return "";

  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const token = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, token);
  return token;
}
