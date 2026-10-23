/**
 * API 클라이언트 기본 설정 (axios)
 */

import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    // 응답 자체가 없으면(네트워크 실패) 0. 영어·일본어 화면에서 연결 오류 문구를 고르는 데 쓴다
    const status = axiosError.response?.status ?? 0;
    const message =
      axiosError.response?.data?.message || "요청 처리 중 오류가 발생했습니다.";
    throw new ApiError(status, message);
  }
  throw error;
}

export async function apiGet<T>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response = await apiClient.get<T>(endpoint, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function apiPost<T, D = unknown>(
  endpoint: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response = await apiClient.post<T>(endpoint, data, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function apiPut<T, D = unknown>(
  endpoint: string,
  data: D,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response = await apiClient.put<T>(endpoint, data, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function apiDelete<T>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response = await apiClient.delete<T>(endpoint, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export { apiClient };
