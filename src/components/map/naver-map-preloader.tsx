import { useLocale } from "next-intl";
import {
  naverMapPreloadSnippet,
  naverMapScriptUrl,
} from "@/lib/naver-map-script";

/**
 * 지도 페이지(홈) 전용: 하이드레이션을 기다리지 않고 maps.js 로드를 시작한다.
 * SSR HTML의 인라인 스크립트로만 동작하고(클라이언트 이동 시에는 React가 실행하지 않음),
 * 그 경우에는 useNaverMapLoader가 평소처럼 로드한다. 지도가 없는 페이지에는 넣지 않는다
 */
export function NaverMapPreloader() {
  const locale = useLocale();
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: 고정 코드와 JSON.stringify한 스크립트 주소만 들어가 사용자 입력 없음
      dangerouslySetInnerHTML={{
        __html: naverMapPreloadSnippet(naverMapScriptUrl(locale)),
      }}
    />
  );
}
