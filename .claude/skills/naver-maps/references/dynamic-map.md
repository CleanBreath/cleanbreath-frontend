> 출처: https://api.ncloud-docs.com/docs/application-maps-dynamic.md
> NCP 문서의 Dynamic Map 페이지는 아래 공식 가이드 링크만 제공한다. 이 파일은 그 가이드(NAVER Maps JavaScript API v3)에서 이 프로젝트가 실제로 쓰는 부분을 정리한 것이다.
> 여기 없는 API는 Context7 `/websites/navermaps_github_io_maps_js_ncp` 또는 https://navermaps.github.io/maps.js.ncp/docs/ 에서 확인한다.

# Dynamic Map

| 종류 | 문서 |
| --- | --- |
| Web Dynamic Map (JS API v3) | [API 가이드](https://navermaps.github.io/maps.js.ncp/docs/) · [예제](https://navermaps.github.io/maps.js.ncp/docs/tutorial-digest.example.html) |
| Android SDK | [가이드](https://navermaps.github.io/android-map-sdk/guide-ko) · [API](https://navermaps.github.io/android-map-sdk/reference) · [예제](https://github.com/navermaps/android-map-sdk) |
| iOS SDK | [가이드](https://navermaps.github.io/ios-map-sdk/guide-ko) · [API](https://navermaps.github.io/ios-map-sdk/reference) · [예제](https://github.com/navermaps/ios-map-sdk) |

## 스크립트 로드와 인증

```html
<script src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=YOUR_CLIENT_ID&submodules=geocoder"></script>
```

- `ncpKeyId`에는 **Client ID만** 넣는다. Client Secret은 필요 없고 브라우저에 노출하면 안 된다.
- 인증은 HTTP Referer로 한다. 콘솔 Application의 **Web 서비스 URL**에 `http://localhost:3000`과 배포 도메인을 등록하지 않으면 인증에 실패한다.
- 인증에 실패하면 전역 함수 `window.navermap_authFailure`가 호출된다. 사용자에게 안내하려면 이 함수를 정의한다.
- `submodules`는 쉼표로 여러 개를 지정한다(`geocoder`, `panorama`, `drawing`, `visualization`).
- 서브모듈은 본 스크립트 다음에 비동기로 로드된다. `naver.maps.Service` 등 서브모듈 API는 `naver.maps.onJSContentLoaded` 콜백 이후에 사용한다.
- `geocoder` 서브모듈은 Client Secret 없이 브라우저에서 Geocoding / Reverse Geocoding을 호출한다. 그래도 콘솔에서 해당 API를 선택해야 하고, 사용량도 그 API로 집계된다.

이 프로젝트의 로더는 `src/hooks/use-naver-map-loader.ts`(`useNaverMapLoader()`)이며, 환경변수는 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`이다.

## TypeScript

`@types/navermaps`(devDependency)가 전역 `naver.maps` 네임스페이스를 제공한다. `window.naver`가 아니라 `naver.maps.Map`처럼 바로 쓴다. 객체 타입도 `naver.maps.Map`, `naver.maps.Marker`, `naver.maps.Polygon`처럼 그대로 쓰면 되므로 `any`가 필요 없다.

## 핵심 API

```ts
const map = new naver.maps.Map(element, {
  center: new naver.maps.LatLng(lat, lng), // LatLng는 (위도, 경도) 순서
  zoom: 17,
});
map.panTo(latlng);
map.setZoom(17);
map.fitBounds(naver.maps.LatLngBounds.bounds(sw, ne));

// 폴리곤: paths는 "경로 배열의 배열"이다. 이벤트를 받으려면 clickable: true가 필요하다.
const polygon = new naver.maps.Polygon({
  map,
  paths: [latlngs],
  fillColor: "#22C55E", fillOpacity: 0.4,
  strokeColor: "#16A34A", strokeOpacity: 0.9, strokeWeight: 2,
  clickable: true,
});

// HTML 마커: anchor 기본값은 (0,0), 즉 좌상단이다. 중앙 정렬하려면 크기의 절반을 지정한다.
const marker = new naver.maps.Marker({
  map,
  position: latlng,
  icon: { content: "<div>…</div>", anchor: new naver.maps.Point(20, 20) },
});

naver.maps.Event.addListener(polygon, "click", handler);
naver.maps.Event.addListener(map, "click", (e: naver.maps.PointerEvent) => {
  const lat = e.coord.y; // coord는 x=경도, y=위도
  const lng = e.coord.x;
});

overlay.setMap(null); // 지도에서 제거
```

## 역지오코딩 (geocoder 서브모듈)

```ts
naver.maps.Service.reverseGeocode(
  {
    coords: new naver.maps.LatLng(lat, lng),
    orders: [naver.maps.Service.OrderType.ADDR, naver.maps.Service.OrderType.ROAD_ADDR].join(","),
  },
  (status, response) => {
    if (status !== naver.maps.Service.Status.OK || !response) return;
    const { roadAddress, jibunAddress } = response.v2.address; // 사람이 읽는 주소 문자열
    const road = response.v2.results.find((r) => r.name === "roadaddr");
    const buildingName = road?.land?.addition0?.value; // addition0 = building
  },
);
```

`naver.maps.Service.geocode({ query }, cb)`도 같은 방식으로 쓰고, 결과는 `response.v2.addresses[]`(`x`=경도, `y`=위도, 문자열)에 들어 있다. 응답 필드는 `geocoding.md`, `reverse-geocoding.md`의 REST 응답과 같다.

## Kakao Map에서 옮길 때 대응표

| Kakao | NAVER |
| --- | --- |
| `kakao.maps.load(cb)` + `autoload=false` | 스크립트 onload, 서브모듈은 `naver.maps.onJSContentLoaded` |
| `level` (작을수록 확대, 1~14) | `zoom` (클수록 확대). 대략 `zoom ≈ 20 - level` (이 프로젝트는 level 3 → zoom 17, level 2 → zoom 18) |
| `setLevel` / `getLevel` | `setZoom` / `getZoom` |
| `LatLng.getLat()` / `getLng()` | `lat()` / `lng()` (또는 `.y` / `.x`) |
| `CustomOverlay({ content, xAnchor, yAnchor })` | `Marker({ icon: { content, anchor: Point(px, px) } })` |
| `Polygon({ path })` | `Polygon({ paths: [path], clickable: true })` |
| `kakao.maps.event.addListener` | `naver.maps.Event.addListener` |
| 지도 click의 `mouseEvent.latLng` | `e.coord` |
| `services.Geocoder().coord2Address(lng, lat, cb)` | `naver.maps.Service.reverseGeocode({ coords, orders }, cb)` |
| `road_address.address_name` / `building_name` | `v2.address.roadAddress` / roadaddr 결과의 `land.addition0.value` |
