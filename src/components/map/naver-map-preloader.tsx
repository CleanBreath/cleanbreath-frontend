import { useLocale } from "next-intl";
import { useSyncExternalStore } from "react";
import {
  naverMapPreloadSnippet,
  naverMapScriptUrl,
} from "@/lib/naver-map-script";

const noopSubscribe = () => () => {};

/**
 * 서버 렌더링과 그 HTML을 하이드레이션하는 동안만 true.
 * 하이드레이션 중에는 getServerSnapshot 값을 쓰므로 서버 HTML과 일치하고,
 * 클라이언트 이동으로 새로 마운트될 때는 getSnapshot(false)을 쓴다
 */
function useIsServerOrHydrating() {
  return useSyncExternalStore(
    noopSubscribe,
    () => false,
    () => true,
  );
}

/**
 * 지도 페이지(홈) 전용: 하이드레이션을 기다리지 않고 maps.js 로드를 시작한다.
 * SSR HTML의 인라인 스크립트로만 동작한다. 클라이언트 이동으로 홈에 올 때는 React가 스크립트를 실행하지 않고
 * 개발 모드에서 경고("Encountered a script tag ...")만 내므로 아예 그리지 않으며, 그때는 useNaverMapLoader가 평소처럼 로드한다.
 * 하이드레이션 직후 다시 그릴 때 이 요소는 빠지지만 이미 실행된 뒤라 영향이 없다. 지도가 없는 페이지에는 넣지 않는다
 */
export function NaverMapPreloader() {
  const locale = useLocale();
  const isServerOrHydrating = useIsServerOrHydrating();
  if (!isServerOrHydrating) return null;
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: 고정 코드와 JSON.stringify한 스크립트 주소만 들어가 사용자 입력 없음
      dangerouslySetInnerHTML={{
        __html: naverMapPreloadSnippet(naverMapScriptUrl(locale)),
      }}
    />
  );
}
