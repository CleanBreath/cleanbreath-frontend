import { useEffect, useState } from "react";

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || "";

// 여러 지도 컴포넌트가 마운트돼도 스크립트는 한 번만 로드
let loadPromise: Promise<void> | null = null;

function loadNaverMapScript(): Promise<void> {
  loadPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}&submodules=geocoder`;
    script.async = true;
    // geocoder 서브모듈은 본 스크립트 이후에 로드되므로 onJSContentLoaded로 완료 시점을 받음
    script.onload = () => {
      naver.maps.onJSContentLoaded = () => resolve();
    };
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("네이버 지도 스크립트 로드 실패"));
    };
    document.head.appendChild(script);
  });
  return loadPromise;
}

/**
 * 네이버 지도 스크립트(geocoder 서브모듈 포함)를 로드하는 훅
 * @returns 네이버 지도 로드 완료 여부
 */
export function useNaverMapLoader(): boolean {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadNaverMapScript()
      .then(() => setIsLoaded(true))
      .catch(console.error);
  }, []);

  return isLoaded;
}
