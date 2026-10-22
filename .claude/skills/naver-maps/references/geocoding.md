> 출처: https://api.ncloud-docs.com/docs/application-maps-geocoding.md (원문 업데이트 2026-09-17)

# Geocoding

VPC 환경에서 이용 가능합니다.

입력한 주소와 연관된 주소 정보를 검색합니다.

## 요청

요청 형식을 설명합니다. 요청 형식은 다음과 같습니다.

| 메서드 | URI |
| --- | --- |
| GET | /geocode |

### 요청 헤더

요청 헤더에 대한 설명은 다음과 같습니다.

| 필드 | 필수 여부 | 설명 |
| --- | --- | --- |
| `Accept` | Required | 응답 데이터의 형식 - `application/json` |

Maps API에서 공통으로 사용하는 헤더에 대한 정보는 [Maps 요청 헤더](/docs/application-maps-overview#%EC%9A%94%EC%B2%AD%ED%97%A4%EB%8D%94)를 참조해 주십시오.

### 요청 쿼리 파라미터

요청 쿼리 파라미터에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `query` | String | Required | 검색할 주소 |
| `coordinate` | String | Optional | 검색 중심 좌표(경도,위도) - 입력한 좌표와 근접한 순으로 검색 결과 표시 |
| `filter` | Integer | Optional | 검색 결과 필터 - `HCODE` \| `BCODE` - `hCODE`: 행정동 코드 - `BCODE`: 법정동 코드 - **필터 타입@코드1;코드2;......** 형식으로 입력 - <예시> `HCODE@4113554500;4113555000` |
| `language` | String | Optional | 응답 결과 언어 - `kor` (기본값) \| `eng` - `kor`: 한국어 - `eng`: 영어 |
| `page` | Number | Optional | 페이지 번호 - 1 (기본값) |
| `count` | Number | Optional | 결과 목록 크기 - 1~100 (기본값: 10) |

### 요청 예시

요청 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=분당구 불정로 6' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}' \
--header 'Accept: application/json'
```

## 응답

응답 형식을 설명합니다.

### 응답 바디

응답 바디에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `status` | String | - | 응답 코드 |
| `meta` | Object | - | 메타 데이터 |
| `meta.totalCount` | Number | - | 응답 결과 개수 |
| `meta.page` | Number | - | 현재 페이지 번호 |
| `meta.count` | Number | - | 페이지 내 결과 개수 |
| `addresses` | Array | - | 주소 정보 목록: [addresses](/docs/application-maps-geocoding#addresses) |
| `errorMessage` | String | - | 오류 메시지 - 500 오류(알 수 없는 오류) 발생 시에만 표시 |

#### `addresses`

`addresses`에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `roadAddress` | String | - | 도로명 주소 |
| `jibunAddress` | String | - | 지번 주소 |
| `englishAddress` | String | - | 영어 주소 |
| `addressElements` | Array | - | 주소 구성 요소 정보: [addressElements](/docs/application-maps-geocoding#addressElements) |
| `x` | String | - | X 좌표(경도) |
| `y` | String | - | Y 좌표(위도) |
| `distance` | Double | - | 중심 좌표로부터의 거리(m) |

#### `addressElements`

`addressElements`에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `type` | Array | - | 주소 구성 요소 타입 - `SIDO` \| `SIGUGUN` \| `DONGMYUN` \| `RI` \| `ROAD_NAME` \| `BUILDING_NUMBER` \| `BUILDING_NAME` \| `LAND_NUMBER` \| `POSTAL_CODE` - `SIDO`: 시/도 - `SIGUGUN`: 시/구/군 - `DONGMYUN`: 동/면 - `RI`: 리 - `ROAD_NAME`: 도로명 - `BUILDING_NUMBER`: 건물 번호 - `BUILDING_NAME`: 건물 이름 - `LAND_NUMBER`: 번지 - `POSTAL_CODE`: 우편번호 |
| `longName` | String | - | 주소 구성 요소 이름 |
| `shortName` | String | - | 주소 구성 요소 축약 이름 |
| `code` | String | - | - |

### 응답 상태 코드

응답 상태 코드에 대한 설명은 다음과 같습니다.

| HTTP 상태 코드 | 코드 | 메시지 | 설명 |
| --- | --- | --- | --- |
| 200 | OK | - | 요청 처리 성공. 정상 응답 |
| 400 | INVALID_REQUEST | - | 요청 오류 |
| 500 | SYSTEM_ERROR | Unexpected Error | 알 수 없는 오류 |

참고

Maps API에서 공통으로 사용하는 응답 상태 코드에 대한 정보는 [Maps 응답 상태 코드](/docs/application-maps-overview#%EC%9D%91%EB%8B%B5%EC%83%81%ED%83%9C%EC%BD%94%EB%93%9C)를 참조해 주십시오.

### 응답 예시

응답 예시는 다음과 같습니다.

```
{
    "status": "OK",
    "meta": {
        "totalCount": 1,
        "page": 1,
        "count": 1
    },
    "addresses": [
        {
            "roadAddress": "경기도 성남시 분당구 불정로 6 NAVER그린팩토리",
            "jibunAddress": "경기도 성남시 분당구 정자동 178-1 NAVER그린팩토리",
            "englishAddress": "6, Buljeong-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea",
            "addressElements": [
                {
                    "types": [
                        "SIDO"
                    ],
                    "longName": "경기도",
                    "shortName": "경기도",
                    "code": ""
                },
                {
                    "types": [
                        "SIGUGUN"
                    ],
                    "longName": "성남시 분당구",
                    "shortName": "성남시 분당구",
                    "code": ""
                },
                {
                    "types": [
                        "DONGMYUN"
                    ],
                    "longName": "정자동",
                    "shortName": "정자동",
                    "code": ""
                },
                {
                    "types": [
                        "RI"
                    ],
                    "longName": "",
                    "shortName": "",
                    "code": ""
                },
                {
                    "types": [
                        "ROAD_NAME"
                    ],
                    "longName": "불정로",
                    "shortName": "불정로",
                    "code": ""
                },
                {
                    "types": [
                        "BUILDING_NUMBER"
                    ],
                    "longName": "6",
                    "shortName": "6",
                    "code": ""
                },
                {
                    "types": [
                        "BUILDING_NAME"
                    ],
                    "longName": "NAVER그린팩토리",
                    "shortName": "NAVER그린팩토리",
                    "code": ""
                },
                {
                    "types": [
                        "LAND_NUMBER"
                    ],
                    "longName": "178-1",
                    "shortName": "178-1",
                    "code": ""
                },
                {
                    "types": [
                        "POSTAL_CODE"
                    ],
                    "longName": "13561",
                    "shortName": "13561",
                    "code": ""
                }
            ],
            "x": "127.1054328",
            "y": "37.3595963",
            "distance": 0.0
        }
    ],
    "errorMessage": ""
}
```
