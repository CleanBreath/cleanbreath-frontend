---
inclusion: always
---

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

#### 1. 피드백 목록 조회

```http
GET /v1/feedback-list
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

**Response**

```json
{
  "message": "피드백 저장 성공"
}
```

#### 3. 피드백 상세 조회

```http
GET /v1/feedback/{id}
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

#### 4. 피드백 수정

```http
PUT /v1/feedback/{id}
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

#### 5. 피드백 삭제

```http
DELETE /v1/feedback/{id}
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

## 📊 공통 응답 형식

### ApiResponse (목록 조회)

```json
{
  "count": 100,
  "updateAt": "2024-01-01T12:00:00",
  "data": [...]
}
```

### MessageResponse (작업 결과)

```json
{
  "message": "작업 성공"
}
```

---

## 🔐 에러 응답

### 400 Bad Request

```json
{
  "message": "잘못된 요청입니다."
}
```

### 404 Not Found

```json
{
  "message": "해당 리소스를 찾을 수 없습니다."
}
```

### 500 Internal Server Error

```json
{
  "message": "서버 내부 오류가 발생했습니다."
}
```
