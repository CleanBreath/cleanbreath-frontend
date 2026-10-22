import { useEffect, useState } from "react";
import { preconnect } from "react-dom";

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || "";

const MAP_SCRIPT_URL = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`;
// maps.js가 submodules=geocoder일 때 본 스크립트 뒤에 붙여 로드하는 파일과 동일 (naver.maps 로드 후 실행돼야 함)
const GEOCODER_SCRIPT_URL =
  "https://oapi.map.naver.com/openapi/v3/maps-geocoder.js";

// 여러 지도 컴포넌트가 마운트돼도 스크립트별로 한 번만 로드
const loadPromises = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  let promise = loadPromises.get(src);
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        loadPromises.delete(src);
        reject(new Error("네이버 지도 스크립트 로드 실패"));
      };
      document.head.appendChild(script);
    });
    loadPromises.set(src, promise);
  }
  return promise;
}

/**
 * 네이버 지도 스크립트를 로드하는 훅
 * @param options.geocoder 역지오코딩(naver.maps.Service)이 필요할 때만 true
 * @returns 네이버 지도(및 요청한 서브모듈) 로드 완료 여부
 */
export function useNaverMapLoader({ geocoder = false } = {}): boolean {
  const [isLoaded, setIsLoaded] = useState(false);

  // 렌더 중 호출해 SSR HTML <head>에 연결 힌트만 넣음 (maps.js preload는 FCP를 늦춰서 제외)
  preconnect("https://oapi.map.naver.com");
  // HTTPS에서 타일·스타일 호스트 (HTTP에서는 nrbe.map.naver.net), 타일 img는 crossOrigin="anonymous"로 요청됨
  preconnect("https://nrbe.pstatic.net", { crossOrigin: "anonymous" });

  useEffect(() => {
    loadScript(MAP_SCRIPT_URL)
      .then(() => (geocoder ? loadScript(GEOCODER_SCRIPT_URL) : undefined))
      .then(() => setIsLoaded(true))
      .catch(console.error);
  }, [geocoder]);

  return isLoaded;
}
