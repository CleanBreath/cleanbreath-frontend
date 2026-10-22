---
name: naver-maps
description: 네이버 클라우드 플랫폼(NCP) Maps API 공식 문서 기반 가이드. Dynamic Map(NAVER Maps JavaScript API v3), Static Map, Geocoding, Reverse Geocoding, Directions 5/15의 엔드포인트·인증 헤더·쿼리 파라미터·응답 필드·오류 코드를 담고 있다. 네이버 지도를 띄우거나, 마커·폴리곤·지도 이벤트를 다루거나, 좌표↔주소 변환, 정적 지도 이미지, 자동차 경로 탐색을 구현하거나, `naver.maps.*` 코드나 `use-naver-map-loader`·`naver-map.tsx`를 수정하거나, 401/429 같은 Maps API 오류나 지도 인증 실패를 디버깅하거나, Kakao Map 코드를 네이버로 옮길 때는 사용자가 "문서"를 직접 언급하지 않아도 반드시 이 skill을 사용할 것.
---

# NAVER Maps (NCP)

`references/`에 NCP 공식 문서 원문이 API별로 들어 있다. 아래 요약으로 답이 안 나올 때만 해당 파일을 읽는다. 파일이 길면(300줄 이상) `^#` 헤딩을 grep해서 필요한 섹션만 읽는다.

| API | 쓰는 곳 | 참조 파일 |
| --- | --- | --- |
| Dynamic Map | 브라우저 인터랙티브 지도 (JS v3, 모바일 SDK) | `references/dynamic-map.md` |
| Static Map | 지도 이미지 한 장 (`<img>`, 썸네일, OG 이미지) | `references/static-map.md` |
| Geocoding | 주소 문자열 → 좌표 | `references/geocoding.md` |
| Reverse Geocoding | 좌표 → 법정동/행정동/지번/도로명 주소 | `references/reverse-geocoding.md` |
| Directions 5 / 15 | 자동차 경로·소요 시간·요금 (경유지 최대 5 / 15개) | `references/directions.md` |
| 공통 | Base URL, 인증 헤더, 공통 오류 코드 | `references/overview.md` |

## 이 프로젝트 현황

- Dynamic Map과 Reverse Geocoding만 콘솔에서 활성화되어 있다. 다른 API를 쓰려면 먼저 콘솔 Application의 **[수정]**에서 해당 API를 선택해야 한다. 선택하지 않으면 429 (Quota Exceeded)가 난다.
- 지도는 `src/components/map/naver-map.tsx`(메인), `detail-naver-map.tsx`(게시판 상세), `src/app/register/page.tsx`(구역 그리기 + 역지오코딩)에 있다.
- 스크립트는 `useNaverMapLoader()`(`src/hooks/use-naver-map-loader.ts`)가 `geocoder` 서브모듈과 함께 한 번만 로드한다. 새 지도 컴포넌트도 이 훅을 쓴다.
- 타입은 `@types/navermaps`가 제공한다(전역 `naver.maps`).
- 환경변수는 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`(Client ID)이다.

## 인증: 두 가지 방식이 있다

헷갈리기 쉬운 부분이라 먼저 정한다.

1. **브라우저 (Referer 인증)**: JS v3 스크립트의 `ncpKeyId=<Client ID>`, Static Map의 `/raster-cors?...&X-NCP-APIGW-API-KEY-ID=<Client ID>`가 여기에 해당한다. Client ID만 쓰고, 콘솔의 Web 서비스 URL에 등록된 도메인에서만 동작한다. 브라우저에서 좌표↔주소 변환이 필요하면 REST 대신 JS `geocoder` 서브모듈(`naver.maps.Service`)을 쓴다.
2. **서버 (ID-KEY 인증)**: REST 호출에 헤더 `x-ncp-apigw-api-key-id: <Client ID>`와 `x-ncp-apigw-api-key: <Client Secret>`를 넣는다. **Client Secret은 비밀이다.** `NEXT_PUBLIC_*`에 넣거나 클라이언트 번들에서 호출하지 말고, Next.js Route Handler나 백엔드에서만 호출한다. Geocoding, Reverse Geocoding, Directions는 문서에 이 헤더 인증 방식만 나와 있다.

## REST 공통

| API | Base URL | 메서드·URI |
| --- | --- | --- |
| Static Map | `https://maps.apigw.ntruss.com/map-static/v2` | `GET /raster` (ID-KEY), `GET /raster-cors` (Referer) |
| Geocoding | `https://maps.apigw.ntruss.com/map-geocode/v2` | `GET /geocode` (`Accept: application/json` 필수) |
| Reverse Geocoding | `https://maps.apigw.ntruss.com/map-reversegeocode/v2` | `GET /gc` |
| Directions 5 | `https://maps.apigw.ntruss.com/map-direction/v1` | `GET /driving` |
| Directions 15 | `https://maps.apigw.ntruss.com/map-direction-15/v1` | `GET /driving` |

공통 오류: 401(인증 실패/권한 없음), 429(할당량 초과, 콘솔에서 API 미선택, 너무 잦은 요청), 413(10MB 초과), 503/504(엔드포인트 오류/타임아웃). 자세한 코드표는 `references/overview.md`에 있다.

## 자주 틀리는 것

- **좌표 순서**: REST 파라미터(`coords`, `center`, `start`, `goal`, `waypoints`)와 Static Map `markers`의 `pos`는 모두 **경도,위도** 순서다(`pos`는 공백으로 구분). 반면 JS의 `new naver.maps.LatLng(위도, 경도)`는 반대다. 응답의 `x`는 경도, `y`는 위도다. Geocoding 응답의 `x`/`y`는 문자열이다.
- **Reverse Geocoding**: 기본 응답이 **XML**이다. JSON이 필요하면 `output=json`을 넣는다. `orders` 기본값은 `legalcode,admcode`라서 지번/도로명 주소가 필요하면 `orders=addr,roadaddr`를 명시한다. 결과가 없으면 HTTP 200에 `status.code: 3`이 온다. 바다나 신규 택지는 `addr`/`roadaddr` 결과가 비어 있을 수 있다. 건물명은 `roadaddr` 결과의 `land.addition0.value`, 우편번호는 `addition1.value`에 있다.
- **Geocoding**: 결과가 없어도 200이고 `meta.totalCount: 0`으로 온다. `count`는 최대 100이다.
- **Static Map**: `center`+`level`을 쓰거나 `markers`를 쓴다(둘 다 없으면 오류). `w`/`h`는 1~1024px, `scale=2`는 레티나용이다. `markers`는 최대 20개이며 값은 URL 인코딩한다.
- **Directions**: `duration`은 **밀리초**, `distance`는 미터다. `option`은 `:`로 최대 3개(`trafast`, `tracomfort`, `traoptimal`(기본), `traavoidtoll`, `traavoidcaronly`)를 지정하고, 응답은 `route.<option>[]`에 담긴다. `goal`은 `:`로 최대 10개를 넣을 수 있고, 그중 가장 싸게 도달하는 곳의 경로가 돌아온다. `waypoints`는 `|`로 구분한다. 실시간 교통을 반영하므로 같은 요청이라도 결과가 달라질 수 있다.
- **JS 지도**: `Polygon`은 `paths: [path]`(배열의 배열)이고, 클릭을 받으려면 `clickable: true`가 필요하다. HTML 마커 `icon.anchor`의 기본값은 좌상단 (0,0)이다. 서브모듈 API는 `onJSContentLoaded` 이후에 쓴다. 자세한 내용과 Kakao 대응표는 `references/dynamic-map.md`에 있다.

## 문서 갱신

원문은 `https://api.ncloud-docs.com/docs/application-maps-<overview|dynamic|static|geocoding|reversegeocoding|directions5|directions15>.md`에서 마크다운으로 받을 수 있다. 전체 목록은 `https://api.ncloud-docs.com/llms.txt`에 있다. 각 참조 파일 첫 줄에 출처와 원문 업데이트 날짜가 적혀 있다.
