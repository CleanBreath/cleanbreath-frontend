> 출처: https://api.ncloud-docs.com/docs/application-maps-static.md (원문 업데이트 2026-09-17)

# Static Map

VPC 환경에서 이용 가능합니다.

JavaScript를 사용하거나 동적 페이지를 로드하지 않고 입력한 좌표를 기준으로 지정한 크기의 네이버 지도 이미지(Static Map)를 불러옵니다. 지원되는 파라미터(지도 유형, 이미지 형식, 해상도, 마커 등)를 통해 지도 이미지를 원하는 대로 설정할 수 있습니다.

## 요청

요청 형식을 설명합니다.

| 메서드 | URI | 설명 |
| --- | --- | --- |
| GET | /raster | ID-KEY 인증 |
| GET | /raster-cors | HTTP Referer 인증 |

참고

- HTTP Refere 인증 방식을 사용하여 API를 호출하려면 Application 등록 시 Web 서비스 URL을 반드시 입력해야 합니다. 다음 가이드를 참조해 주십시오.
  - [Application 사용 가이드](https://guide.ncloud-docs.com/docs/application-maps-app-vpc#Application%EB%93%B1%EB%A1%9D)
  - [Maps 이용 신청](https://guide.ncloud-docs.com/docs/application-maps-start-vpc#Maps%EC%9D%B4%EC%9A%A9%EC%8B%A0%EC%B2%AD)
- HTTP Referer 인증 방식을 사용할 경우 다음과 같이 HTML 태그를 추가해 요청할 수 있습니다.

```
<img src="https://maps.apigw.ntruss.com/map-static/v2/raster-cors?w=300&h=300&center=127.1054221,37.3591614&level=16&X-NCP-APIGW-API-KEY-ID={API Gateway API Key ID}">
```

### 요청 헤더

Maps API에서 공통으로 사용하는 헤더에 대한 정보는 [Maps 요청 헤더](/docs/application-maps-overview#%EC%9A%94%EC%B2%AD%ED%97%A4%EB%8D%94)를 참조해 주십시오.

### 요청 쿼리 파라미터

요청 쿼리 파라미터에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `crs` | String | Optional | 좌표 체계 - `EPSG:4326` (기본값) \| `NHN:2048` \| `NHN:128` \| `EPSG:4258` \| `EPSG:4162` \| `EPSG:2096` \| `EPSG:2097` \| `EPSG:2098` \| `EPSG:3857` \| `EPSG:900913` \| `EPSG:5179` - `EPSG:4326`: WGS84 경위도 - `NHN:2048`: UTM-K - `NHN:128`: KATECH(TM128) - `EPSG:4258`: GRS80 경위도 - `EPSG:4162`: Bessel 경위도 - `EPSG:2096`: Korea East Belt - `EPSG:2097`: Korea Central Belt - `EPSG:2098`: Korea West Belt - `EPSG:3857`, `EPSG:900913`: 구글 맵 - `EPSG:5179`: Korea 2000 / Unified CS |
| `center` | String | Conditional | 중심 좌표(X 좌표,Y 좌표) - X 좌표, Y 좌표 순서는 좌표 체계 정의에 따름 - <예시> WGS84 경위도 좌표 체계: `center=경도,위도` - `markers` 미입력 시, 필수 입력 - `level` 입력 시, 필수 입력 |
| `level` | Integer | Conditional | 줌 레벨 - 0~20 - `markers` 미입력 시, 필수 입력 - `level` 입력 시, 필수 입력 |
| `w`, `h` | Integer | Required | 가로, 세로 이미지 크기 - `w=int&h=int` 형식으로 1~1,024 픽셀 지원 - `w`: 가로 크기 - `h`: 세로 크기 |
| `maptype` | String | Optional | 지도 유형 - `basic` (기본값) \| `traffic` \| `satellite` \| `satellite_base` \| `terrain` - `basic`: 일반 지도 - `traffic`: 교통 정보 지도(일반 지도 기반) - `satellite`: 위성 지도 - `satellite_base`: 위성 배경 지도 - `terrain`: 지형도 |
| `format` | String | Optional | 지도 이미지 형식 - `jpg`/`jpeg` (기본값) \| `png8` \| `png` - `jpg`/`jpeg`: 압축 품질 85%, 24비트 - `png8`: 8비트 - `png`: 24비트 |
| `scale` | Integer | Optional | 해상도 - `1` (기본값) \| `2` - `1`: 저해상도용 이미지 요청. 요청한 `w`, `h` 크기의 이미지를 256 x 256 타일 기반으로 생성해서 반환 - `2`: 고해상도용 이미지 요청. 요청한 `w`, `h` 크기의 이미지를 512 x 512 타일 기반으로 생성해서 반환(`scale=1`과 동일한 지도 서비스 지역이 반환되지만 각 크기에 포함되는 픽셀은 2배 증가) |
| `markers` | String | Conditional | 마커 설정 - `center`, `level` 미입력 시, 필수 입력 - `center`, `level` 미입력 시 설정한 마커에 최적화된 줌 레벨과 위치로 지도 표시 - 최대 20개 입력 가능 - '\| (Pipe char)'로 구분하여 옵션 설정 가능 - [`markers`](/docs/application-maps-static#markers) 참조 - <예시> `markers=type:n\|size:tiny\|color:Blue\|pos:126.9810479%2037.5695075&markers=type:d\|size:mid\|color:Default\|pos:123.524712%2024.1236547` |
| `lang` | String | Optional | 라벨 언어 - `ko` (기본값) \| `en` \| `ja` \| `zh` - `ko`: 한국어 - `en`: 영어 - `ja`: 일본어 - `zh`: 중국어 간체 |
| `dataversion` | String | Optional | 버전 정보 - Static Map API의 이미지 캐싱으로, 클라이언트에서 동일 URL 요청 시 원본 서버의 배경 타일 업데이트가 반영되지 않는 문제를 해결하기 위해 입력 - 배경 타일에 대한 최신성 이슈가 있는 경우에 입력 권장 - 버전 정보가 주기적으로 업데이트되므로 작업의 효율성을 위해 배치성 작업을 권장 - 권장 업데이트 주기(`interval`)에 따라 일일 확인 횟수를 설정하여 정해진 시간에 확인한 버전 정보를 저장한 후 Static Map API 호출 시 사용하는 것을 권장 - [Data Version API](/docs/application-maps-static#DataVersionAPI)를 통해 `version` 확인 |

#### `markers`

`markers`에 대한 설명은 다음과 같습니다.

| 필드 | 값 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `type` | String | Optional | 마커 유형 - `d` (기본값) \| `n` \| `a` \| `t` \| `e` - `d`: 기본 - `n`: 숫자 - `a`: 알파벳 - `t`: 툴팁 - `e`: 커스텀 |
| `size` | String | Optional | 마커 크기 - `tiny` \| `small` \| `mid` (기본값) - `tiny`일 경우 `label`을 입력하더라도 표시되지 않음 |
| `color` | String | Optional | 마커 색상 - 사전 정의 색상 값 또는 24비트 색상 값 형식으로 입력 - `Default` (기본값) \| `Blue` \| `Orange` \| `Yellow` \| `Red` \| `Brown` \| `Green` \| `Purple` \| `Gray` - `Default`: `0x08DA76` - `Blue`: `0x029DFF` - `Orange`: `0xFE8C52` - `Yellow`: `0xFFBA01` - `Red`: `0xFF6355` - `Brown`: `0xA4885B` - `Green`: `0x63AA41` - `Purple`: `0xD182C8` - `Gray`: `0x666666` |
| `label` | String | Optional | 마커 라벨 - a~z, 1~9 - 미입력 시 마커만 표시 - `type`이 `tiny`인 경우에는 입력하더라도 표시되지 않음 |
| `pos` | String | Required | 마커 위치(X좌표[Space]Y좌표) - ','로 구분하여 여러 개의 좌표 입력 가능 - <예시> `pos:126.9810479%2037.5695075%2C126.9950680%2037.5672557` - 파라미터는 UrlEncode 되어야 함 |
| `viewSizeRatio` | Float | Optional | 마커 크기 비율 - `type`과 `size`별 기본 디자인을 기반으로 마커 크기 조절 - 0.1~2.0 (기본값: 0.1) - 소수점 첫째 자리까지 입력 가능하며 0.1보다 작으면 `0.1`, 2.0보다 크면 `2.0` 입력 |
| `icon` | String | Conditional | 커스텀 마커 아이콘 URL - `type`이 `e`인 경우, 필수 입력 - PNG, SVG 파일 지원 - <예시> `icon:http://aaa/bbb.svg` |
| `anchor` | String, Double | Optional | 마커 표시 위치 - `type`이 `e`인 경우에만 입력 가능 - 지도 이미지에서 마커 이미지 위치의 오프셋값이며, 마커 표시 위치를 세부적으로 조정해야 할 때 설정 - String 타입으로 입력 시 - `top` \| `bottom` (기본값) \| `left` \| `right` \| `center` \| `topleft` \| `topright` \| `bottomleft` \| `bottomright` - `top`: 중앙 상단(0.5, 0.0) - `bottom`: 중앙 하단(0.5, 1.0) - `left`: 왼쪽 중앙(0.0, 0.5) - `right`: 오른쪽 중앙(1.0, 0.5) - `center`: 중앙(0.5, 0.5) - `topleft`: 왼쪽 상단(0.0, 0.0) - `topright`: 오른쪽 상단(0.0, 1.0) - `bottomleft`: 왼쪽 하단(1.0, 0.0) - `bottomright`: 오른쪽 하단(1.0, 1.0) - Double 타입으로 입력 시 - 소수점 둘째 자리까지 입력 가능 - <예시> `anchor:0.75,0.5` 또는 `anchor:top` |

참고

커스텀 마커 설정 시 제약 사항

- 커스텀 마커의 최대 크기는 기본 64x64 픽셀이며, 레티나 디스플레이 대응 고해상도(`scale=2`)로 요청할 경우 128x128 픽셀입니다.
- 커스텀 마커 요청 URL에서 2초 이내에 응답이 없으면 작업을 중지합니다.
- 커스텀 마커는 최대 1일간 내부 캐시로 유지될 수 있습니다. 따라서 동일한 URL에 마커 이미지만 달라진 경우에는 최대 1일까지 변경된 이미지가 반영되지 않을 수 있습니다.

#### Data Version API

Data Version API에 대한 설명은 다음과 같습니다.

- 요청

| 메서드 | URL |
| --- | --- |
| GET | https://maps.apigw.ntruss.com/map-static/v2/lastversion |
- 응답

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `version` | String | - | 버전 정보 - `major_version.minor_version` 형식 - `major_version`: 정기 업데이트 시 변경, 원타일 맵 메이저 버전과 동일하게 유지(2달에 1번 업데이트) - `minor_version`: 부분 업데이트 시 버전 올림(1달에 1~2번 업데이트) |
| `interval` | Long | - | 권장 업데이트 주기(초) |

### 요청 예시

요청 예시는 다음과 같습니다.

참고

이 가이드에서는 ID-KEY 인증 방식을 사용하는 예시를 제공합니다.

#### [`center`](/docs/application-maps-static#center2)

중심 좌표(`center`)가 `127.1054221,37.3591614`인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=16' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`level`](/docs/application-maps-static#level2)

줌 레벨(`level`)이 `11`인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=11' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`w`, `h`](/docs/application-maps-static#wh2)

크기(`w` x `h`)가 300 x 200 픽셀인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=200&center=127.1054221,37.3591614&level=16' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`maptype=basic`](/docs/application-maps-static#maptypebasic2)

지도 유형(`maptype`)이 일반 지도(`basic`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=11&maptype=basic' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`maptype=traffic`](/docs/application-maps-static#maptypetraffic2)

지도 유형(`maptype`)이 교통 정보 지도(`traffic`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=11&maptype=traffic' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`maptype=satellite`](/docs/application-maps-static#maptypesatellite2)

지도 유형(`maptype`)이 위성 지도(`satellite`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=11&maptype=satellite' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`maptype=satellite_base`](/docs/application-maps-static#maptypesatellite_base2)

지도 유형(`maptype`)이 위성 배경 지도(`satellite_base`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=11&maptype=satellite_base' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`maptype=terrain`](/docs/application-maps-static#maptypeterrain2)

지도 유형(`maptype`)이 지형도(`terrain`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=11&maptype=terrain' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`format=jpg`](/docs/application-maps-static#formatjpg2)

이미지 형식(`format`)이 `jpg`(`jpeg`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=16&format=jpg' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`format=png8`](/docs/application-maps-static#formatpng82)

이미지 형식(`format`)이 `png8`인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=16&format=png8' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`format=png`](/docs/application-maps-static#formatpng2)

이미지 형식(`format`)이 `png`인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=16&format=png' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`scale=1`](/docs/application-maps-static#scale12)

저해상도(`scale=1`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=16&scale=1' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`scale=2`](/docs/application-maps-static#scale22)

고해상도(`scale=2`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&center=127.1054221,37.3591614&level=16&scale=2' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`lang=ko`](/docs/application-maps-static#langko2)

라벨 언어(`lang`)가 한국어(`ko`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?crs=EPSG:4326&w=375&h=258&center=126.96311062857343,37.50843783043817&level=16&lang=ko' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`lang=en`](/docs/application-maps-static#langen2)

라벨 언어(`lang`)가 영어(`en`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?crs=EPSG:4326&w=375&h=258&center=126.96311062857343,37.50843783043817&level=16&lang=en' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`lang=ja`](/docs/application-maps-static#langja2)

라벨 언어(`lang`)가 일본어(`ja`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?crs=EPSG:4326&w=375&h=258&center=126.96311062857343,37.50843783043817&level=16&lang=ja' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`lang=zh`](/docs/application-maps-static#langzh2)

라벨 언어(`lang`)가 중국어 간체(`zh`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?crs=EPSG:4326&w=375&h=258&center=126.96311062857343,37.50843783043817&level=16&lang=zh' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`markers=size:tiny`](/docs/application-maps-static#markerssizetiny2)

기본 마커의 크기(`size`)가 `tiny`인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&markers=type:d|size:tiny|pos:127.1054221%2037.3591614' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`markers=size:small`](/docs/application-maps-static#markerssizesmall2)

기본 마커의 크기(`size`)가 `small`인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&markers=type:d|size:small|pos:127.1054221%2037.3591614' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`markers=size:mid`](/docs/application-maps-static#markerssizemid2)

기본 마커의 크기(`size`)가 `mid`인 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&markers=type:d|size:mid|pos:127.1054221%2037.3591614' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`markers=size:mid&markers=size:small&markers=size:tiny`](/docs/application-maps-static#markerssizemidsmalltiny2)

크기(`size`)가 `mid`, `small`, `tiny`인 기본 마커를 모두 표시하는 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&markers=type:d|size:mid|pos:126.9865479%2037.5612557&markers=type:d|size:small|color:red|pos:126.9870479%2037.5695075%2C126.9950680%2037.5612557%2C126.9743160%2037.5620754&markers=type:d|size:tiny|color:green|pos:126.9810479%2037.5695075%2C126.9950680%2037.5672557%2C126.9843160%2037.5570754' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`markers=color:red`](/docs/application-maps-static#markerscolorred2)

기본 마커의 색(`color`)이 빨간색(`red`)인 지도 이미지를 요청하는 예시는 다음과 같습니다.

- 사전 정의 색상 값으로 요청

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&markers=type:d|size:small|pos:127.1054221%2037.3591614|color:red' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```
- 24 비트 색상 값으로 요청

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&markers=type:d|size:small|pos:127.1054221%2037.3591614|color:0xFF6355' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`markers=viewSizeRatio:0.5`](/docs/application-maps-static#markersviewSizeRatio052)

기본 마커 크기의 비율(`viewSizeRatio`)을 0.5배(`0.5`)로 변경하는 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&markers=type:d|size:mid|pos:127.1054221%2037.3591614|viewSizeRatio:0.5' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`markers=viewSizeRatio:2.0`](/docs/application-maps-static#markersviewSizeRatio202)

기본 마커 크기의 비율(`viewSizeRatio`)을 2배(`2.0`)로 변경하는 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&markers=type:d|size:mid|pos:127.1054221%2037.3591614|viewSizeRatio:2.0' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`markers=type:n|label:{number}`](/docs/application-maps-static#markerstypenlabelnumber2)

숫자 마커를 표시하는 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&markers=type:n|size:mid|pos:126.9865479%2037.5612557|label:1&markers=type:n|size:small|color:blue|pos:126.9870479%2037.5695075|label:2&markers=type:n|size:small|color:blue|pos:126.9950680%2037.5612557|label:3&markers=type:n|size:small|color:blue|pos:126.9743160%2037.5620754|label:4' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`markers=type:a|label:{alphabet}`](/docs/application-maps-static#markerstypealabelalphabet2)

알파벳 마커를 표시하는 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&markers=type:a|size:mid|pos:126.9865479%2037.5612557|label:a&markers=type:a|size:small|color:blue|pos:126.9870479%2037.5695075|label:b&markers=type:a|size:small|color:blue|pos:126.9950680%2037.5612557|label:c&markers=type:a|size:small|color:blue|pos:126.9743160%2037.5620754|label:d' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`markers=type:t|label:{tooltip}`](/docs/application-maps-static#markerstypetlabeltooltip2)

툴팁 마커를 표시하는 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?crs=EPSG:4326&scale=1&format=png&w=375&h=258&markers=type:t|pos:126.9616187%2037.507435|label:%EB%8F%99%EC%9E%91%EA%B5%AC,%20%EC%84%9C%EC%B4%88%EA%B5%AC,%20%EA%B4%80%EC%95%85%EA%B5%AC&markers=type:t|color:blue|pos:126.96060539999999%2037.507685699999996|label:%EB%8F%99%EC%9E%91%EA%B5%AC,%20%EC%84%9C%EC%B4%88%EA%B5%AC,%20%EC%9A%A9%EC%82%B0%EA%B5%AC%20%EB%B0%A9%EB%A9%B4&markers=type:t|color:0xEE3A3A|pos:126.9616377%2037.506708950000004|label:%EB%8F%99%EC%9E%91%EA%B5%AC,%20%EC%84%9C%EC%B4%88%EA%B5%AC,%20%EC%9A%A9%EC%82%B0%EA%B5%AC%20%EB%B0%A9%EB%A9%B4' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

#### [`markers=type:e`](/docs/application-maps-static#markerstypee2)

커스텀 마커를 표시하는 지도 이미지를 요청하는 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-static/v2/raster?w=300&h=300&scale=2&markers=type:e|anchor:center|icon:https://aaa.bbb.com/icon/construction-medium@2x.png|pos:127.0597827%2037.5118871' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

## 응답

응답 형식을 설명합니다.

### 응답 상태 코드

Maps API에서 공통으로 사용하는 응답 상태 코드에 대한 정보는 [Maps 응답 상태 코드](/docs/application-maps-overview#%EC%9D%91%EB%8B%B5%EC%83%81%ED%83%9C%EC%BD%94%EB%93%9C)를 참조해 주십시오.

### 응답 예시

응답 예시는 다음과 같습니다.

#### [`center`](/docs/application-maps-static#center1)

중심 좌표(`center`)가 `127.1054221,37.3591614`인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_center](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_center.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`level`](/docs/application-maps-static#level1)

줌 레벨(`level`)이 `11`인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_level](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_level.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`w`, `h`](/docs/application-maps-static#wh1)

크기(`w` x `h`)가 300 x 200 픽셀인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_wh](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_wh.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`maptype=basic`](/docs/application-maps-static#maptypebasic1)

지도 유형(`maptype`)이 일반 지도(`basic`)인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_maptype-basic](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_maptype-basic.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`maptype=traffic`](/docs/application-maps-static#maptypetraffic1)

지도 유형(`maptype`)이 교통 정보 지도(`traffic`)인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_maptype-traffic](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_maptype-traffic.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`maptype=satellite`](/docs/application-maps-static#maptypesatellite1)

지도 유형(`maptype`)이 위성 지도(`satellite`)인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_maptype-satellite](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_maptype-satellite.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`maptype=satellite_base`](/docs/application-maps-static#maptypesatellite_base1)

지도 유형(`maptype`)이 위성 배경 지도(`satellite_base`)인 지도 이미지의 응답 예시는 다음과 같습니다.

![ai-naver-mapsstaticmap-raster_maptype-satellite_base](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_maptype-satellite_base.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`maptype=terrain`](/docs/application-maps-static#maptypeterrain1)

지도 유형(`maptype`)이 지형도(`terrain`)인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_maptype-terrian](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_maptype-terrian.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`format=jpg`](/docs/application-maps-static#formatjpg1)

이미지 형식(`format`)이 `jpg`(`jpeg`)인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_format-jpg](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_format-jpg.jpg?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`format=png8`](/docs/application-maps-static#formatpng81)

이미지 형식(`format`)이 `png8`인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_format-png8](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_format-png8.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`format=png`](/docs/application-maps-static#formatpng1)

이미지 형식(`format`)이 `png`인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_format-png](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_format-png.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`scale=1`](/docs/application-maps-static#scale11)

저해상도(`scale=1`)인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_scale1](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_scale1.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`scale=2`](/docs/application-maps-static#scale21)

고해상도(`scale=2`)인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_scale2](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_scale2.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`lang=ko`](/docs/application-maps-static#langko1)

라벨 언어(`lang`)가 한국어(`ko`)인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_lang-ko](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_lang-ko.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`lang=en`](/docs/application-maps-static#langen1)

라벨 언어(`lang`)가 영어(`en`)인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_lang-en](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_lang-en.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`lang=ja`](/docs/application-maps-static#langja1)

라벨 언어(`lang`)가 일본어(`ja`)인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_lang-ja](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_lang-ja.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`lang=zh`](/docs/application-maps-static#langzh1)

라벨 언어(`lang`)가 중국어 간체(`zh`)인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_lang-zh](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_lang-zh.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`markers=size:tiny`](/docs/application-maps-static#markerssizetiny1)

기본 마커의 크기(`size`)가 `tiny`인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_markersize-tiny](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_markersize-tiny.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`markers=size:small`](/docs/application-maps-static#markerssizesmall1)

기본 마커의 크기(`size`)가 `small`인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_markersize-small](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_markersize-small.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`markers=size:mid`](/docs/application-maps-static#markerssizemid1)

기본 마커의 크기(`size`)가 `mid`인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_markersize-mid](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_markersize-mid.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`markers=size:mid&markers=size:small&markers=size:tiny`](/docs/application-maps-static#markerssizemidsmalltiny1)

크기(`size`)가 `mid`, `small`, `tiny`인 기본 마커를 모두 표시하는 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_markersize-midsmalltiny](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_markersize-midsmalltiny.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`markers=color:red`](/docs/application-maps-static#markerscolorred1)

기본 마커의 색(`color`)이 빨간색(`red`)인 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_markers-color](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_markers-color.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`markers=viewSizeRatio:0.5`](/docs/application-maps-static#markersviewSizeRatio051)

기본 마커 크기의 비율(`viewSizeRatio`)을 0.5배(`0.5`)로 변경하는 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_markersizeratio1](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_markersizeratio1.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`markers=viewSizeRatio:2.0`](/docs/application-maps-static#markersviewSizeRatio201)

기본 마커 크기의 비율(`viewSizeRatio`)을 2배(`2.0`)로 변경하는 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_markersizeratio2](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_markersizeratio2.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`markers=type:n|label:{number}`](/docs/application-maps-static#markerstypenlabelnumber1)

숫자 마커를 표시하는 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_markerslabel-number](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_markerslabel-number.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`markers=type:a|label:{alphabet}`](/docs/application-maps-static#markerstypealabelalphabet1)

알파벳 마커를 표시하는 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_markerslabel-alphabet](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_markerslabel-alphabet.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`markers=type:t|label:{tooltip}`](/docs/application-maps-static#markerstypetlabeltooltip1)

툴팁 마커를 표시하는 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_markerslabel-text](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_markerslabel-text.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)

#### [`markers=type:e`](/docs/application-maps-static#markerstypee1)

커스텀 마커를 표시하는 지도 이미지의 응답 예시는 다음과 같습니다. ![ai-naver-mapsstaticmap-raster_markers-custom](https://cdn.document360.io/da0368a0-4444-4862-a528-42f78876f9e6/Images/Documentation/ai-naver-mapsstaticmap-raster_markers-custom.png?sv=2026-02-06&spr=https&st=2026-10-22T09%3A33%3A27Z&se=2026-10-22T10%3A33%3A27Z&sr=c&sp=r&sig=Lo3CGAM%2BWU11jGbeD82415e3zbMu97LgcDJKhkwHjEQ%3D)
