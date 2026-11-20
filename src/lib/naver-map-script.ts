const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || "";

// language: 지도 라벨 언어. 공식 지원값 ko·en·ja·zh가 앱 언어 코드와 같아 그대로 넘긴다
export const naverMapScriptUrl = (language: string) =>
  `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}&language=${language}`;

// maps.js가 submodules=geocoder일 때 본 스크립트 뒤에 붙여 로드하는 파일과 동일 (naver.maps 로드 후 실행돼야 함)
export const GEOCODER_SCRIPT_URL =
  "https://oapi.map.naver.com/openapi/v3/maps-geocoder.js";

/**
 * maps.js 로드 상태를 담는 전역 키. 홈 HTML의 인라인 스크립트(NaverMapPreloader)와
 * useNaverMapLoader가 같은 값을 보고, 먼저 시작한 쪽의 로드를 이어받는다 (중복 로드 방지)
 */
export const NAVER_MAP_LOAD_KEY = "__cleanbreathNaverMaps";

export interface NaverMapLoad {
  src: string;
  promise: Promise<void>;
}

declare global {
  interface Window {
    [NAVER_MAP_LOAD_KEY]?: NaverMapLoad;
  }
}

/**
 * 하이드레이션 전에 maps.js 로드를 시작하는 인라인 스크립트 본문.
 * 첫 페인트를 늦추지 않도록 다음 프레임 뒤에 async(낮은 우선순위)로 넣고,
 * 그 사이 훅이 먼저 로드를 시작했으면 아무것도 하지 않는다
 */
export function naverMapPreloadSnippet(src: string): string {
  const args = [NAVER_MAP_LOAD_KEY, src].map((v) =>
    JSON.stringify(v).replace(/</g, "\\u003c"),
  );
  return `(function(k,s){function go(){if(window[k])return;var e=document.createElement("script");e.src=s;e.async=true;var p=new Promise(function(r,j){e.onload=function(){r()};e.onerror=function(){j(new Error("naver maps script failed"))}});p.catch(function(){});window[k]={src:s,promise:p};document.head.appendChild(e)}requestAnimationFrame(function(){setTimeout(go,0)})})(${args.join(",")})`;
}
