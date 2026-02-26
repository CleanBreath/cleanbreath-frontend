import { useEffect, useState } from "react";

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY || "";

interface UseKakaoMapLoaderOptions {
  libraries?: string[];
}

/**
 * 카카오맵 스크립트를 로드하는 훅
 * @param options - 로드할 라이브러리 옵션 (기본값: services, clusterer)
 * @returns 카카오맵 로드 완료 여부
 */
export function useKakaoMapLoader(
  options: UseKakaoMapLoaderOptions = {},
): boolean {
  const { libraries = ["services", "clusterer"] } = options;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 이미 로드된 경우
    if (window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }

    // 스크립트 생성 및 로드
    const script = document.createElement("script");
    const librariesParam =
      libraries.length > 0 ? `&libraries=${libraries.join(",")}` : "";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false${librariesParam}`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => setIsLoaded(true));
    };
    document.head.appendChild(script);
  }, [libraries]);

  return isLoaded;
}
