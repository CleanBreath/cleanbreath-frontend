---
name: cleanbreath-backend-api
description: CleanBreath 백엔드 REST API(Spring, base `/v1`) 명세와 이 프론트엔드에서 API를 호출·추가하는 방법. 금연/흡연구역(address), 공동주택(apartment), 피드백(feedback), 신규 구역 제안(pending address), 흡연구역 게시판·투표(smoking area), health 엔드포인트의 요청/응답 형식을 담고 있다. 백엔드 API를 호출하거나, 새 엔드포인트용 함수·타입·React Query 훅을 추가하거나, 응답 필드명을 확인하거나, API 에러·400/404/500을 디버깅하거나, `src/api`, `src/types`, `src/hooks`를 수정할 때는 사용자가 "API 문서"를 직접 언급하지 않아도 반드시 이 skill을 사용할 것.
---

# CleanBreath 백엔드 API

백엔드 엔드포인트 전체 요청/응답 예시는 `references/endpoints.md`에 있다. 필드명이나 응답 형태를 확인해야 할 때 해당 섹션만 읽으면 된다. 아래 표만으로 충분하면 읽지 않아도 된다.

## Base URL

`src/api/client.ts`의 axios 인스턴스가 `NEXT_PUBLIC_API_URL`(기본값 `http://localhost:8080/v1`)을 baseURL로 쓴다. 그래서 코드에서는 `/v1`을 빼고 `"/allAddress"`처럼 경로만 넘긴다.

## 엔드포인트 ↔ 기존 함수

새로 만들기 전에 이미 있는 함수인지 먼저 확인한다. 모두 `@/api`에서 export 된다.

| Method | 경로 | 함수 (`src/api/*.ts`) | 응답 타입 (`@/types`) |
|---|---|---|---|
| GET | `/allAddress` | `getAllAddress` | `AllAddressResponse` |
| GET | `/address?lat&lng` | `getAddressByCoords(lat, lng)` | `AddressItem` |
| GET | `/address/within?swLat&swLng&neLat&neLng` | (프론트 함수 없음) | `AllAddressResponse` 형식 |
| GET | `/address/contains?lat&lng` | (프론트 함수 없음) | `AllAddressResponse` 형식 |
| GET | `/publicZone/within?swLat&swLng&neLat&neLng` | `getPublicZonesWithin(bounds)` + 훅 `usePublicZonesWithin` | `PublicZoneListResponse` |
| POST | `/updateDate` | `checkUpdateDate(updateDate)` + 타입가드 `isUpdateNeeded` | `UpdateDateResponse \| UpdateNotNeededResponse` |
| GET | `/apartment` | `getAllApartments` | `ApartmentListResponse` |
| GET | `/region?r` | `getApartmentsByRegion(region)` | `ApartmentListResponse` |
| POST | `/feedback/add` | `addFeedback(data)` | `MessageResponse` |
| GET | `/allRequestAddress` | `getAllPendingAddresses` | `PendingAddressListResponse` |
| GET | `/allRequestAddressPage?page&size` | `getPendingAddressesPage(page=0, size=20)` / 게시판용 `getSmokingAreaList(page=0, size=10)` | `PendingAddressPageResponse` / `SmokingAreaPageResponse` |
| POST | `/smokingArea/add` | `addSmokingArea(data)` | `MessageResponse` |
| GET | `/smokingArea/{id}` | `getSmokingAreaDetail(id)` | `SmokingAreaDetail` |
| POST | `/smokingArea/{id}/vote` | `voteSmokingArea(id, data)` | `void` |
| GET | `/health` | `checkServerHealth` | `HealthCheckResponse` |

## 새 엔드포인트 추가 순서

이 프로젝트는 레이어가 나뉘어 있다. 순서를 지켜야 타입이 끊기지 않는다.

1. **타입**: `src/types/<도메인>.d.ts`에 요청/응답 interface를 추가하고 `src/types/index.ts`에서 re-export 한다. 작업 결과만 돌려주는 API는 새 타입 대신 `MessageResponse`를 재사용한다.
2. **API 함수**: `src/api/<도메인>.ts`에 `apiGet` / `apiPost` / `apiPut` / `apiDelete`(`./client`)로 함수를 만든다. axios를 직접 쓰지 않는다. 그래야 에러가 `ApiError`로 통일된다. 쿼리스트링은 `{ params: { ... } }`로 넘기고, 함수 위에 `/** 한국어 한 줄 설명 */` 주석을 단다. 그다음 `src/api/index.ts`에 export를 추가한다.
3. **React Query 훅** (컴포넌트에서 조회할 때): `src/hooks/use-<도메인>.ts`의 키 팩토리(`smokingAreaKeys` 등)에 키를 추가하고 `useQuery` / `useMutation` 훅을 만든다. 파일 맨 위에 `"use client"`가 있어야 한다. mutation은 `onSuccess`에서 관련 쿼리를 `invalidateQueries` 한다. 참고 예시는 `src/hooks/use-smoking-area.ts`다.
   - 현재 feedback, pending address, health는 훅 없이 컴포넌트(`feedback-modal.tsx`, `app/health/page.tsx`)에서 API 함수를 직접 호출한다. 기존 코드를 고칠 때는 그 방식을 유지해도 된다.

## 주의할 점 (백엔드 응답이 일관되지 않은 부분)

- **좌표 경로 필드명이 API마다 다르다.**
  - address: `path[]`에 `pathsLatitude` / `pathsLongitude`
  - apartment: `path[]`에 `pathsLat` / `pathsLng`
  - pending/smokingArea: `paths[]`(복수형)에 `pathLat` / `pathLng`

  하나로 합치거나 다른 API 타입을 재사용하지 말고, 각 타입 정의를 따른다.
- **경로 좌표는 문자열**(`"37.401234"`), 중심 좌표 `latitude` / `longitude`는 숫자다. 지도에 넘길 때 `Number()`로 바꿔야 한다.
- **날짜 형식이 요청마다 다르다.** `/updateDate`는 `"2024-01-01T12:00:00.000000"`(마이크로초), `/smokingArea/add`의 `updateAt`은 `"2024-01-01 12:00:00"`(공백 구분), 응답은 대부분 `"2024-01-01T12:00:00"`이다.
- **`/updateDate`는 응답이 두 종류다.** 업데이트가 필요하면 목록 전체(`data` 배열)를, 아니면 `{ message }`만 온다. 반드시 `isUpdateNeeded`로 구분한다.
- **피드백 관리 API는 관리자 전용이다.** `GET /feedback-list`, `GET·PUT·DELETE /feedback/{id}`는 `Authorization: Bearer <ADMIN_TOKEN>`이 없으면 401이다. 토큰을 브라우저에 넣으면 노출되므로 프론트엔드에 이 함수들을 만들지 않는다. 공개 API는 `POST /feedback/add`뿐이다.
- **피드백 등록**은 `title`·`content`가 비어 있으면 400이다.
- **`/allRequestAddressPage`의 `size` 최대값은 2000**이다.
- **투표 `clientToken`**은 `src/lib`의 `getClientToken()`으로 만든 브라우저별 익명 토큰을 쓴다.
- **에러**: 백엔드는 400/404/500 모두 `{ message }`로 응답한다. `handleError`가 이를 `ApiError(status, message)`로 바꿔 던지므로, UI에서는 `error instanceof ApiError`로 확인하고 `error.message`를 보여준다.

## 이 명세의 출처

이 skill이 API 명세의 유일한 문서다(이전 `.kiro/steering/backend-api-document.md`를 옮겨옴). smokingArea 상세·투표, health는 원본에 없어서 코드 기준으로 보강했다. 백엔드 실제 동작과 다르면 코드(`src/api`, `src/types`)를 우선 믿고 이 skill을 갱신한다.
