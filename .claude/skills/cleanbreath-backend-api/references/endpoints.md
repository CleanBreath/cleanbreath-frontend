# CleanBreath 백엔드 API 상세 명세

> 원본: 이전 `.kiro/steering/backend-api-document.md` (삭제됨, 이 파일로 대체) + 코드(`src/api`, `src/types`)에만 있던 엔드포인트 보강

## 목차

- Base URL
- Address API (금연/흡연구역): `/allAddress`, `/address`, `/address/within`, `/address/contains`, `/updateDate`
- Apartment API (공동주택): `/apartment`, `/region`
- Feedback API: `/feedback/add` (공개), `/feedback-list`·`/feedback/{id}` (GET/PUT/DELETE, 관리자 토큰 필요)
- Pending Address API (신규 구역 제안): `/allRequestAddress`, `/allRequestAddressPage`, `/smokingArea/add`
- Smoking Area API (게시판/투표): `/smokingArea/{id}`, `/smokingArea/{id}/vote`
- Health API: `/health`
- 공통 응답 형식 / 에러 응답

## 📚 API 문서

### Base URL

```
http://localhost:8080/v1
```

---

### 🏢 Address API (금연/흡연구역)

#### 1. 전체 구역 조회

```http
GET /v1/allAddress
```

**Response**

```json
{
  "count": 100,
  "updateAt": "2024-01-01T12:00:00",
  "data": [
    {
      "id": 1,
      "addressName": "안양역 광장",
      "buildingName": "안양역",
      "latitude": 37.401234,
      "longitude": 126.921234,
      "category": "NON_SMOKING",
      "path": [
        {
          "divisionArea": "AREA_A",
          "pathsLatitude": "37.401234",
          "pathsLongitude": "126.921234"
        }
      ]
    }
  ]
}
```

#### 2. 좌표로 구역 검색

```http
GET /v1/address?lat={latitude}&lng={longitude}
```

**Parameters**

- `lat` (required): 위도
- `lng` (required): 경도

**Response**

```json
{
  "id": 1,
  "addressName": "안양역 광장",
  "buildingName": "안양역",
  "latitude": 37.401234,
  "longitude": 126.921234,
  "category": "NON_SMOKING",
  "path": [
    {
      "divisionArea": "AREA_A",
      "pathsLatitude": "37.401234",
      "pathsLongitude": "126.921234"
    }
  ]
}
```

#### 2-1. 사각형 범위 안의 구역 (공간 인덱스)

```http
GET /v1/address/within?swLat={남서 위도}&swLng={남서 경도}&neLat={북동 위도}&neLng={북동 경도}
```

대표 좌표(`latitude`, `longitude`)가 사각형 안에 있는 구역을 반환한다. 지도 화면 영역만 불러올 때 쓴다. 응답 형식은 `/allAddress`와 같다(`count`, `updateAt`, `data[]`). 좌표가 범위를 벗어나거나 파라미터가 빠지면 `400`.

#### 2-2. 이 좌표를 포함하는 구역 (공간 인덱스)

```http
GET /v1/address/contains?lat={latitude}&lng={longitude}
```

구역 다각형이 이 점을 포함하는 구역을 반환한다. "지금 위치가 금연·흡연 구역인가?"에 쓴다. 응답 형식은 `/allAddress`와 같고, 해당 구역이 없으면 `count: 0`, `data: []`. 좌표가 범위를 벗어나면 `400`.

#### 3. 데이터 업데이트 확인

```http
POST /v1/updateDate
```

**Request Body**

```json
{
  "updateDate": "2024-01-01T12:00:00.000000"
}
```

**Response (업데이트 필요시)**

```json
{
  "count": 100,
  "updateAt": "2024-01-31T12:00:00",
  "data": [...]
}
```

**Response (업데이트 불필요시)**

```json
{
  "message": "아직 업데이트 시기가 아닙니다."
}
```

---

### 🏘 Apartment API (공동주택 금연구역)

#### 1. 전체 공동주택 조회

```http
GET /v1/apartment
```

**Response**

```json
[
  {
    "id": 1,
    "region": "동안구",
    "designationNumber": "2024-001",
    "apartmentName": "평촌 아파트",
    "address": "경기도 안양시 동안구 평촌동",
    "numberOfBuilding": 10,
    "numberOfHouseholds": 500,
    "designationDate": "2024-01-01",
    "path": [
      {
        "hallway": "DESIGNATED",
        "stairs": "DESIGNATED",
        "elevator": "DESIGNATED",
        "undergroundParkingLot": "NOT_DESIGNATED",
        "latitude": 37.401234,
        "longitude": 126.921234,
        "pathsLat": "37.401234",
        "pathsLng": "126.921234"
      }
    ]
  }
]
```

#### 2. 지역별 공동주택 조회

```http
GET /v1/region?r={region}
```

**Parameters**

- `r` (required): 지역명 (예: "동안구", "만안구")

**Response**: 전체 공동주택 조회와 동일

---

### 💬 Feedback API (피드백)

> 등록(`POST /feedback/add`)을 뺀 나머지는 관리자 전용이다. `Authorization: Bearer <ADMIN_TOKEN>` 헤더가 없거나 틀리면 `401`을 돌려준다. 서버에 토큰이 설정되지 않았어도 모두 거부한다. 프론트엔드(브라우저)에서는 호출하지 않는다.

#### 1. 피드백 목록 조회 (관리자)

```http
GET /v1/feedback-list
Authorization: Bearer <ADMIN_TOKEN>
```

**Response**

```json
[
  {
    "feedbackId": 1,
    "createAt": "2024-01-01T12:00:00",
    "title": "서비스 개선 제안"
  }
]
```

#### 2. 피드백 등록

```http
POST /v1/feedback/add
```

**Request Body**

```json
{
  "title": "서비스 개선 제안",
  "content": "지도 UI를 개선해주세요."
}
```

`title`, `content`는 필수이며 비어 있으면 `400`을 돌려준다.

**Response**

```json
{
  "message": "피드백 저장 성공"
}
```

#### 3. 피드백 상세 조회 (관리자)

```http
GET /v1/feedback/{id}
Authorization: Bearer <ADMIN_TOKEN>
```

**Response**

```json
{
  "id": 1,
  "createAt": "2024-01-01T12:00:00",
  "title": "서비스 개선 제안",
  "content": "지도 UI를 개선해주세요."
}
```

#### 4. 피드백 수정 (관리자)

```http
PUT /v1/feedback/{id}
Authorization: Bearer <ADMIN_TOKEN>
```

**Request Body**

```json
{
  "updateAt": "2024-01-02T12:00:00",
  "title": "수정된 제목",
  "content": "수정된 내용"
}
```

**Response**

```json
{
  "message": "업데이트 성공"
}
```

#### 5. 피드백 삭제 (관리자)

```http
DELETE /v1/feedback/{id}
Authorization: Bearer <ADMIN_TOKEN>
```

**Response**

```json
{
  "message": "피드백 삭제 완료"
}
```

---

### 📍 Pending Address API (신규 구역 제안)

#### 1. 제안된 구역 전체 조회

```http
GET /v1/allRequestAddress
```

**Response**

```json
[
  {
    "id": 1,
    "addressName": "평촌역 광장",
    "buildingName": "평촌역",
    "latitude": 37.401234,
    "longitude": 126.921234,
    "category": "SMOKING",
    "paths": [
      {
        "divisionArea": "AREA_A",
        "pathLat": "37.401234",
        "pathLng": "126.921234"
      }
    ]
  }
]
```

#### 2. 제안된 구역 페이징 조회

```http
GET /v1/allRequestAddressPage?page={page}&size={size}
```

**Parameters**

- `page` (optional): 페이지 번호 (기본값: 0)
- `size` (optional): 페이지 크기 (기본값: 20, 최대: 2000)

**Response**

```json
{
  "content": [...],
  "page": {
    "size": 20,
    "number": 0,
    "totalElements": 100,
    "totalPages": 5
  }
}
```

#### 3. 신규 흡연구역 제안

```http
POST /v1/smokingArea/add
```

**Request Body**

```json
{
  "updateAt": "2024-01-01 12:00:00",
  "addressName": "평촌역 광장",
  "buildingName": "평촌역",
  "latitude": 37.401234,
  "longitude": 126.921234,
  "category": "SMOKING",
  "paths": [
    {
      "divisionArea": "AREA_A",
      "pathLat": "37.401234",
      "pathLng": "126.921234"
    }
  ]
}
```

**Response**

```json
{
  "message": "주소 및 영역 저장 성공"
}
```

---


### 🗳 Smoking Area API (게시판 / 투표)

> 원본 문서에는 없고 `src/api/smoking-area.ts`, `src/types/smoking-area.d.ts` 기준으로 정리함.
> 게시판 목록은 별도 엔드포인트가 아니라 `GET /v1/allRequestAddressPage`를 `size=10`으로 재사용한다 (`getSmokingAreaList`).

#### 1. 흡연구역 상세 조회 (투표 수 포함)

```http
GET /v1/smokingArea/{id}
```

**Response** (`SmokingAreaDetail`)

```json
{
  "id": 1,
  "addressName": "평촌역 광장",
  "buildingName": "평촌역",
  "latitude": 37.401234,
  "longitude": 126.921234,
  "category": "SMOKING",
  "paths": [
    {
      "divisionArea": "AREA_A",
      "pathLat": "37.401234",
      "pathLng": "126.921234"
    }
  ],
  "truthCount": 12,
  "untruthCount": 3
}
```

#### 2. 흡연구역 투표

```http
POST /v1/smokingArea/{id}/vote
```

**Request Body** (`SmokingAreaVoteRequest`)

```json
{
  "clientToken": "브라우저별 익명 토큰 (src/lib의 getClientToken)",
  "isTruth": true
}
```

**Response**: 프론트에서는 본문을 사용하지 않음 (`Promise<void>`). 성공 후 상세 쿼리를 invalidate 한다.

---

### ❤️ Health API

> 원본 문서에는 없고 `src/api/health.ts` 기준.

```http
GET /v1/health
```

**Response**

```json
{
  "status": "<string>"
}
```

`status` 값의 종류는 코드에서 `string`으로만 정의되어 있다. 정확한 값은 백엔드 확인 필요.

---

## 📊 공통 응답 형식

- **ApiResponse (목록 조회)**: `{ "count": number, "updateAt": string, "data": [...] }` — `allAddress`, `updateDate`에서 사용
- **MessageResponse (작업 결과)**: `{ "message": string }` — 등록/수정/삭제 결과
- **Page 응답**: `{ "content": [...], "page": { size, number, totalElements, totalPages } }`

## 🔐 에러 응답

400 / 404 / 500 모두 `{ "message": string }` 형태. 예: `"잘못된 요청입니다."`, `"해당 리소스를 찾을 수 없습니다."`, `"서버 내부 오류가 발생했습니다."`
프론트에서는 `src/api/client.ts`의 `handleError`가 이를 `ApiError(status, message)`로 변환해 throw 한다.
