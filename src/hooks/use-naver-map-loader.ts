import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { preconnect } from "react-dom";
import {
  GEOCODER_SCRIPT_URL,
  NAVER_MAP_LOAD_KEY,
  naverMapScriptUrl,
} from "@/lib/naver-map-script";

// 여러 지도 컴포넌트가 마운트돼도 스크립트별로 한 번만 로드
const loadPromises = new Map<string, Promise<void>>();

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("네이버 지도 스크립트 로드 실패"));
    document.head.appendChild(script);
  });
}

// maps.js는 홈 HTML의 인라인 스크립트(NaverMapPreloader)가 먼저 시작했을 수 있어 전역 상태를 이어받는다.
// 반대로 훅이 먼저 시작하면 전역에 기록해, 뒤늦게 실행된 인라인 스크립트가 다시 넣지 않게 한다
function startMainScript(src: string): Promise<void> {
  const current = window[NAVER_MAP_LOAD_KEY];
  if (current?.src === src) return current.promise;
  const promise = injectScript(src);
  window[NAVER_MAP_LOAD_KEY] = { src, promise };
  return promise;
}

function loadScript(src: string, main = false): Promise<void> {
  let promise = loadPromises.get(src);
  if (!promise) {
    promise = (main ? startMainScript(src) : injectScript(src)).catch(
      (error: unknown) => {
        // 실패한 로드는 기록을 지워 다음 마운트에서 다시 시도한다
        loadPromises.delete(src);
        if (window[NAVER_MAP_LOAD_KEY]?.src === src)
          delete window[NAVER_MAP_LOAD_KEY];
        throw error;
      },
    );
    loadPromises.set(src, promise);
  }
  return promise;
}

/**
 * 네이버 지도 스크립트를 로드하는 훅
 * @param options.geocoder 역지오코딩(naver.maps.Service)이 필요할 때만 true
 * @returns isLoaded: 네이버 지도(및 요청한 서브모듈) 로드 완료 여부,
 *   isError: 스크립트 로드 실패 여부 (차단·오프라인. 실패한 로드는 캐시에서 지워져 새로고침하면 다시 시도한다)
 */
export function useNaverMapLoader({ geocoder = false } = {}): {
  isLoaded: boolean;
  isError: boolean;
} {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  // 언어 전환은 전체 페이지 이동(locale-switcher)이라 한 페이지에서 locale이 바뀌지 않는다
  const locale = useLocale();

  // 렌더 중 호출해 SSR HTML <head>에 연결 힌트만 넣음 (maps.js preload는 FCP를 늦춰서 제외,
  // 홈은 NaverMapPreloader가 첫 페인트 뒤에 낮은 우선순위로 미리 로드한다)
  preconnect("https://oapi.map.naver.com");
  // HTTPS에서 타일·스타일 호스트 (HTTP에서는 nrbe.map.naver.net), 타일 img는 crossOrigin="anonymous"로 요청됨
  preconnect("https://nrbe.pstatic.net", { crossOrigin: "anonymous" });

  useEffect(() => {
    loadScript(naverMapScriptUrl(locale), true)
      .then(() => (geocoder ? loadScript(GEOCODER_SCRIPT_URL) : undefined))
      .then(() => setStatus("ready"))
      .catch((error: unknown) => {
        console.error(error);
        setStatus("error");
      });
  }, [geocoder, locale]);

  return { isLoaded: status === "ready", isError: status === "error" };
}
