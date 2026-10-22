> 출처: https://api.ncloud-docs.com/docs/application-maps-directions5.md (원문 업데이트 2026-09-17)
>
> **Directions 15와의 차이** — 아래 원문은 Directions 5 기준이다. Directions 15는 나머지가 모두 같고 다음만 다르다.
> - Base URL: `https://maps.apigw.ntruss.com/map-direction-15/v1` (5는 `/map-direction/v1`), URI는 동일하게 `GET /driving`
> - `waypoints`: 최대 15개 (5는 최대 5개)
> - `mileage`: 1~99 범위 명시 (기본값 14)
> - 출처: https://api.ncloud-docs.com/docs/application-maps-directions15.md

# Directions 5

VPC 환경에서 이용 가능합니다.

입력한 정보(출발지, 경유지, 목적지 등)를 기반으로 자동차 경로 및 통행 정보(소요 시간, 거리, 예상 유류비, 통행 요금 정보, 분기점 안내)를 조회합니다.

주의

모든 경로는 실시간 교통 정보를 반영하므로 출발지, 목적지, 옵션이 동일하더라도 동일 경로를 보장하지 않습니다.

참조

Directions 5 API는 경유지를 최대 5개까지 입력할 수 있습니다. 더 많은 경유지를 입력하려면 [Directions 15 API](/docs/application-maps-directions15)를 참조해 주십시오.

## 요청

요청 형식을 설명합니다. 요청 형식은 다음과 같습니다.

| 메서드 | URI |
| --- | --- |
| GET | /driving |

### 요청 헤더

Maps API에서 공통으로 사용하는 헤더에 대한 정보는 [Maps 요청 헤더](/docs/application-maps-overview#%EC%9A%94%EC%B2%AD%ED%97%A4%EB%8D%94)를 참조해 주십시오.

### 요청 쿼리 파라미터

요청 쿼리 파라미터에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `start` | String | Required | 출발지(경도,위도) - <예시> `start=127.12345,37.12345` |
| `goal` | String | Required | 목적지(경도,위도) - ':'로 구분하여 최대 10개의 목적지 입력 가능 - 입력한 목적지 중 가장 적은 비용으로 도달할 수 있는 목적지에 대한 경로 조회 - <예시> `goal=123.45678,34.56789:124.56789,35.67890` |
| `waypoints` | String | Optional | 경유지(경도,위도) - '\| (Pipe char)'로 구분하여 최대 5개의 경유지 입력 가능 - 동일 경유지의 좌표가 2개인 경우, ':'로 구분하여 입력 - <예시> `waypoints=127.12345,37.12345:127.23456,37.23456\|128.12345,38.12345:128.23456,38.23456` |
| `option` | String | Optional | 경로 조회 옵션 - ':'로 구분하여 최대 3개의 옵션 입력 가능 - `trafast` \| `tracomfort` \| `traoptimal` (기본값) \| `traavoidtoll` \| `traavoidcaronly` - `trafast`: 실시간 빠른 길 - `tracomfort`: 실시간 편한 길 - `traoptimal`: 실시간 최적 - `traavoidtoll`: 무료 우선 - `traavoidcaronly`: 자동차 전용 도로 회피 우선 |
| `cartype` | Integer | Optional | 차량 타입 - `1` (기본값) \| `2` \| `3` \| `4` \| `5` \| `6` - `1`: 1종 소형차 2축 차량(윤폭 279.4 mm 이하 승용차, 소형 승합차, 소형 화물차) - `2`: 2종 2축 차량(윤폭 279.4 mm 초과, 윤거 1,800 mm 이하 중형 승합차, 중형 화물차) - `3`: 3종 대형차 2축 차량(윤폭 279.4 mm 초과, 윤거 1,800 mm 초과 대형 승합차, 2축 대형 화물차) - `4`: 4종 3축 대형 화물차 - `5`: 5종 4축 이상 특수 화물차 - `6`: 1종 경형 자동차(배기량 1000 cc 미만으로 길이 3.6 m, 너비 1.6 m, 높이 2.0 m 이하) - 일반적인 승용차는 모두 `1` 입력 - 톨게이트 요금 계산에 활용되며, 차종에 따른 중량 또는 크기는 판단하지 않음 |
| `fueltype` | String | Optional | 연료 타입 - `gasoline` (기본값) \| `highgradegasoline` \| `diesel` \| `lpg` - `gasoline`: 휘발유 - `highgradegasoline`: 고급 휘발유 - `diesel`: 경유 - `lpg`: LPG - 유류비 계산에 활용 |
| `mileage` | Double | Optional | 연비 - 사용하는 차량의 연비를 직접 설정하고자 할 때 입력 - 14 (기본값) |
| `lang` | String | Optional | 응답 결과 언어 - `ko` (기본값) \| `en` \| `ja` \| `zh` - `ko`: 한국어 - `en`: 영어 - `ja`: 일본어 - `zh`: 중국어 간체 |

### 요청 예시

요청 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-direction/v1/driving?goal=129.075986%2C35.179470&start=127.1058342%2C37.359708' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

## 응답

응답 형식을 설명합니다.

### 응답 바디

응답 바디에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `code` | Integer | - | 응답 코드 |
| `message` | String | - | 응답 메시지 |
| `currentDateTime` | String | - | 경로 조회 일시(yyyy-MM-ddTHH:mm:ss) |
| `route` | Object | - | 경로 조회 결과 |
| `route.{option}` | Array | - | 요청한 옵션에 따른 경로 정보: [route.{option}](/docs/application-maps-directions5#routeoption) - `trafast` \| `tracomfort` \| `traoptimal` \| `traavoidtoll` \| `traavoidcaronly` - `trafast`: 실시간 빠른 길 - `tracomfort`: 실시간 편한 길 - `traoptimal`: 실시간 최적 - `traavoidtoll`: 무료 우선 - `traavoidcaronly`: 자동차 전용 도로 회피 우선 |

#### `route.{option}`

`route.{option}`에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `summary` | Object | - | 경로 요약 정보 |
| `summary.start` | Object | - | 출발지 정보 |
| `summary.start.location` | Array | - | 출발지 좌표(경도,위도) |
| `summary.goal` | Object | - | 목적지 정보 |
| `summary.goal.location` | Array | - | 목적지 좌표(경도,위도) |
| `summary.goal.dir` | Integer | - | 경로상에서 `location`을 바라보는 방향 - 경로상 진행 방향을 중심으로, 실제 경유지/도착지로 지정한 지점의 방향을 나타냄 - `0` \| `1` \| `2` - `0`: 전방 - `1`: 왼쪽 - `2`: 오른쪽 |
| `summary.distance` | Integer | - | 전체 경로 거리(m) |
| `summary.duration` | Integer | - | 전체 경로 소요 시간(밀리초) |
| `summary.departureTime` | String | - | 예상 도착 일시(yyyy-MM-ddTHH:mm:ss) |
| `summary.bbox` | Array | - | 전체 경로 경계 영역(Left Bottom Point, Right Top Point) |
| `summary.tollFare` | Integer | - | 통행(톨게이트) 요금 |
| `summary.taxiFare` | Integer | - | 택시 요금 - 택시 요금에 영향을 미치는 요소(지역, 할증(심야, 시계외, 복합), 콜비)를 감안하여 계산 |
| `summary.fuelPrice` | Integer | - | 유류비 - 경로 조회 시점의 전국 평균 유류비와 연비를 감안하여 계산 |
| `path` | Array | - | 경로를 구성하는 좌표 - 좌표에는 0번부터 시작되는 `pointIndex`가 존재 - 경로를 구성하는 모든 좌표 표시 |
| `section` | Array | - | 주요 도로 정보: [section](/docs/application-maps-directions5#section) - 전체 경로 중 주행 길이가 긴 일부 경로의 정보를 도로 이름을 기준으로 표시 |
| `guide` | Array | - | 분기점 안내 정보: [guide](/docs/application-maps-directions5#guide) |

#### `section`

`section`에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `pointIndex` | Integer | - | 경로를 구성하는 좌표의 인덱스 |
| `pointCount` | Integer | - | 형상점 수 |
| `distance` | Integer | - | 거리(m) |
| `name` | String | - | 도로 이름 |
| `congestion` |  | - | 혼잡도 분류 코드 - `0` \| `1` \| `2` \| `3` - `0`: 값없음 - `1`: 원활 - `2`: 서행 - `3`: 혼잡 - 혼잡도에 대한 기준은 [혼잡도 기준](/docs/application-maps-directions5#%ED%98%BC%EC%9E%A1%EB%8F%84%EA%B8%B0%EC%A4%80) 참조 |
| `speed` | Integer | - | 평균 속도(km/h) |

**혼잡도 기준** 혼잡도 기준은 다음과 같습니다.

참고

도로별 실시간 통행 속도를 기준으로 하며, 속도 단위는 km/h입니다.

| 코드 | 일반 도로 | 국도 | 도시고속 | 고속도로 |
| --- | --- | --- | --- | --- |
| 원활 | 30 이상 | 40 이상 | 60 이상 | 70 이상 |
| 서행 | 15~30 | 20~40 | 30~60 | 40~70 |
| 혼잡 | 15 미만 | 20 미만 | 30 미만 | 40 미만 |

#### `guide`

`guide`에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `pointIndex` | Integer | - | 경로를 구성하는 좌표의 인덱스 |
| `type` | Integer | - | 분기점 안내 타입 - [분기점 안내 코드](/docs/application-maps-directions5#%EB%B6%84%EA%B8%B0%EC%A0%90%EC%95%88%EB%82%B4%EC%BD%94%EB%93%9C) 참조 |
| `instructions` | String | - | 경로 안내 문구 |
| `distance` | Integer | - | 이전 분기점의 경로 구성 좌표 인덱스로부터 해당 분기점의 경로 구성 좌표 인덱스까지의 거리(m) |
| `duration` | Integer | - | 이전 분기점의 경로 구성 좌표 인덱스로부터 해당 분기점의 경로 구성 좌표 인덱스까지의 소요 시간(밀리초) |

**분기점 안내 코드** 분기점 안내 코드에 대한 설명은 다음과 같습니다.

| 코드 | 설명 |
| --- | --- |
| `1` | 직진 방향 |
| `2` | 좌회전 |
| `3` | 우회전 |
| `4` | 왼쪽 방향 |
| `5` | 오른쪽 방향 |
| `6` | 유턴 |
| `8` | 비보호 좌회전 |
| `11` | 왼쪽 8시 방향 |
| `12` | 왼쪽 9시 방향 |
| `13` | 왼쪽 11시 방향 |
| `14` | 오른쪽 1시 방향 |
| `15` | 오른쪽 3시 방향 |
| `16` | 오른쪽 4시 방향 |
| `21` | 로터리에서 직진 방향 |
| `22` | 로터리에서 유턴 |
| `23` | 로터리에서 왼쪽 7시 방향 |
| `24` | 로터리에서 왼쪽 8시 방향 |
| `25` | 로터리에서 왼쪽 9시 방향 |
| `26` | 로터리에서 왼쪽 10시 방향 |
| `27` | 로터리에서 왼쪽 11시 방향 |
| `28` | 로터리에서 12시 방향 |
| `29` | 로터리에서 오른쪽 1시 방향 |
| `30` | 로터리에서 오른쪽 2시 방향 |
| `31` | 로터리에서 오른쪽 3시 방향 |
| `32` | 로터리에서 오른쪽 4시 방향 |
| `33` | 로터리에서 오른쪽 5시 방향 |
| `34` | 로터리에서 6시 방향 |
| `41` | 왼쪽 도로로 진입 |
| `42` | 오른쪽 도로로 진입 |
| `47` | 휴게소로 진입 |
| `48` | 페리항로 진입 |
| `49` | 페리항로 진출 |
| `50` | 전방에 고속도로 진입 |
| `51` | 전방에 고속도로 진출 |
| `52` | 전방에 도시 고속 도로 진입 |
| `53` | 전방에 도시 고속 도로 진출 |
| `54` | 전방에 분기 도로 진입 |
| `55` | 전방에 고가 차로 진입 |
| `56` | 전방에 지하 차도 진입 |
| `57` | 왼쪽에 고속 도로 진입 |
| `58` | 왼쪽에 고속 도로 진출 |
| `59` | 왼쪽에 도시 고속 도로 진입 |
| `60` | 왼쪽에 도시 고속 도로 진출 |
| `62` | 왼쪽에 고가 차도 진입 |
| `63` | 왼쪽에 고가 차도 옆길 |
| `64` | 왼쪽에 지하 차도 진입 |
| `65` | 왼쪽에 지하 차도 옆길 |
| `66` | 오른쪽에 고속 도로 진입 |
| `67` | 오른쪽에 고속 도로 진출 |
| `68` | 오른쪽에 도시 고속 도로 진입 |
| `69` | 오른쪽에 도시 고속 도로 진출 |
| `71` | 오른쪽에 고가 차도 진입 |
| `72` | 오른쪽에 고가 차도 옆길 |
| `73` | 오른쪽에 지하 차도 진입 |
| `74` | 오른쪽에 지하 차도 옆길 |
| `75` | 전방에 자동차 전용 도로 진입 |
| `76` | 왼쪽에 자동차 전용 도로 진입 |
| `77` | 오른쪽에 자동차 전용 도로 진입 |
| `78` | 전방에 자동차 전용 도로 진출 |
| `79` | 왼쪽에 자동차 전용 도로 진출 |
| `80` | 오른쪽에 자동차 천용 도로 진출 |
| `81` | 왼쪽에 본선으로 합류 |
| `82` | 오른쪽에 본선으로 합류 |
| `87` | 경유지 |
| `88` | 도착지 |
| `91` | 회전 교차로에서 직진 방향 |
| `92` | 회전 교차로에서 유턴 |
| `93` | 회전 교차로에서 왼쪽 7시 방향 |
| `94` | 회전 교차로에서 왼쪽 8시 방향 |
| `95` | 회전 교차로에서 왼쪽 9시 방향 |
| `96` | 회전 교차로에서 왼쪽 10시 방향 |
| `97` | 회전 교차로에서 왼쪽 11시 방향 |
| `98` | 회전 교차로에서 12시 방향 |
| `99` | 회전 교차로에서 오른쪽 1시 방향 |
| `100` | 회전 교차로에서 오른쪽 2시 방향 |
| `101` | 회전 교차로에서 오른쪽 3시 방향 |
| `102` | 회전 교차로에서 오른쪽 4시 방향 |
| `103` | 회전 교차로에서 오른쪽 5시 방향 |
| `104` | 회전 교차로에서 6시 방향 |
| `121` | 톨게이트 |
| `122` | 하이패스 전용 톨게이트 |
| `123` | 원톨링 톨게이트 |

### 응답 상태 코드

응답 상태 코드에 대한 설명은 다음과 같습니다.

| HTTP 상태 코드 | 코드 | 메시지 | 설명 |
| --- | --- | --- | --- |
| 200 | 0 | - | 요청 처리 성공. 길 찾기 성공 |
| 400 | 1 | - | 요청 처리 실패. 출발지와 도착지가 동일함 |
| 400 | 2 | - | 요청 처리 실패. 출발지 또는 도착지가 도로 주변이 아님 |
| 400 | 3 | - | 요청 처리 실패. 자동차 길 찾기 결과 제공 불가 |
| 400 | 4 | - | 요청 처리 실패. 경유지가 도로 주변이 아님 |
| 400 | 5 | - | 요청 처리 실패. 경유지를 포함한 직선거리 합이 1500 km 이상인 경로가 요청됨 |

참고

Maps API에서 공통으로 사용하는 응답 상태 코드에 대한 정보는 [Maps 응답 상태 코드](/docs/application-maps-overview#%EC%9D%91%EB%8B%B5%EC%83%81%ED%83%9C%EC%BD%94%EB%93%9C)를 참조해 주십시오.

### 응답 예시

응답 예시는 다음과 같습니다.

```
{
    "code": 0,
    "message": "길찾기를 성공하였습니다.",
    "currentDateTime": "2024-09-03T14:39:25",
    "route": {
        "traoptimal": [
            {
                "summary": {
                    "start": {
                        "location": [
                            127.1058342,
                            37.3597080
                        ]
                    },
                    "goal": {
                        "location": [
                            129.0759854,
                            35.1794698
                        ],
                        "dir": 2
                    },
                    "distance": 380044,
                    "duration": 15856847,
                    "departureTime": "2024-09-03T14:39:24",
                    "bbox": [
                        [
                            127.0833901,
                            35.1793190
                        ],
                        [
                            129.1969372,
                            37.3597094
                        ]
                    ],
                    "tollFare": 21000,
                    "taxiFare": 352360,
                    "fuelPrice": 45056
                },
                "path": [
                    [
                        127.1059979,
                        37.3597094
                    ],
                    // (생략)
                    [
                        129.0762855,
                        35.1793190
                    ]
                ],
                "section": [
                    {
                        "pointIndex": 315,
                        "pointCount": 1018,
                        "distance": 95575,
                        "name": "경부고속도로",
                        "congestion": 1,
                        "speed": 83
                    },
                    {
                        "pointIndex": 2157,
                        "pointCount": 812,
                        "distance": 92508,
                        "name": "상주영천고속도로",
                        "congestion": 1,
                        "speed": 108
                    },
                    {
                        "pointIndex": 2968,
                        "pointCount": 833,
                        "distance": 89391,
                        "name": "경부고속도로",
                        "congestion": 1,
                        "speed": 106
                    }
                ],
                "guide": [
                    {
                        "pointIndex": 50,
                        "type": 3,
                        "instructions": "머내공원사거리에서 '서분당(고기)IC' 방면으로 우회전",
                        "distance": 1075,
                        "duration": 262406
                    },
                    // (생략)
                    {
                        "pointIndex": 4065,
                        "type": 88,
                        "instructions": "목적지",
                        "distance": 904,
                        "duration": 147960
                    }
                ]
            }
        ]
    }
}
```
