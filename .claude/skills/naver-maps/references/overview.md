> 출처: https://api.ncloud-docs.com/docs/application-maps-overview.md (원문 업데이트 2026-09-17)

# Maps 개요

VPC 환경에서 이용 가능합니다.

Maps는 네이버 지도 콘텐츠와 데이터를 활용하여 위치 기반 서비스를 만들 수 있도록 지원하는 네이버 클라우드 플랫폼의 소프트웨어 인터페이스입니다. 정적 지도 이미지 생성, 경로 탐색, 주소 검색, 주소 변환 기능에 대한 API를 RESTful 형태로 제공하며, API를 호출하려면 API Gateway의 IAM 인증을 완료해야 합니다.

## Maps 공통 설정

Maps API에서 공통으로 사용하는 요청 형식과 응답 형식을 설명합니다.

### 요청

공통 요청 형식을 설명합니다.

#### API URL

요청 API URL은 다음과 같습니다.

```
Static Map: https://maps.apigw.ntruss.com/map-static/v2
Directions 5: https://maps.apigw.ntruss.com/map-direction/v1
Directions 15: https://maps.apigw.ntruss.com/map-direction-15/v1
Geocoding: https://maps.apigw.ntruss.com/map-geocode/v2
Reverse Geocoding: https://maps.apigw.ntruss.com/map-reversegeocode/v2
```

#### 요청 헤더

헤더에 대한 설명은 다음과 같습니다.

| 필드 | 필수 여부 | 설명 |
| --- | --- | --- |
| `x-ncp-apigw-api-key-id` | Required | 네이버 클라우드 플랫폼 콘솔에서 Application 등록 후 발급받은 Client ID |
| `x-ncp-apigw-api-key` | Required | 네이버 클라우드 플랫폼 콘솔에서 Application 등록 후 발급받은 Client Secret |

참고

네이버 클라우드 플랫폼 콘솔에서 Application을 등록하여 API 사용에 필요한 인증 정보(Client ID, Client Secret)를 발급받는 방법은 [Maps 사용 가이드](https://guide.ncloud-docs.com/docs/application-maps-app-vpc#Application%EC%A0%95%EB%B3%B4%ED%99%95%EC%9D%B8)를 참조해 주십시오. 콘솔에서 Application 등록 후 사용할 API가 선택되어 있는지 **[수정]** 버튼을 클릭하여 확인해 주십시오. 선택되어 있지 않으면 429 (Quota Exceed) 오류가 발생합니다.

### 응답

공통 응답 형식을 설명합니다.

#### 응답 상태 코드

응답 상태 코드에 대한 설명은 다음과 같습니다.

| HTTP 상태 코드 | 코드 | 메시지 | 설명 |
| --- | --- | --- | --- |
| 400 | 100 | Bad Request Exception | 요청 구문 오류 |
| 401 | 200 | Authentication Failed | 인증 실패 |
| 401 | 210 | Permission Denied | 접근 권한 없음 |
| 404 | 300 | Not Found Exception | 서버에서 찾을 수 없음 |
| 413 | 430 | Request Entity Too Large | 요청 크기(10 MB) 초과 |
| 429 | 400 | Quota Exceeded | 요청 할당량 초과 |
| 429 | 410 | Throttle Limited | 너무 빠르거나 잦은 요청 |
| 429 | 420 | Rate Limited | 특정 시간 동안 너무 많은 요청 |
| 503 | 500 | Endpoint Error | 엔트포인트 오류 |
| 504 | 510 | Endpoint Timeout | 엔트포인트 타임아웃 |
| 500 | 900 | Unexpected Error | 알 수 없는 오류 |

참고

네이버 클라우드 플랫폼에서 공통으로 사용하는 응답 상태 코드에 대한 정보는 [Ncloud API 응답 상태 코드](/docs/common-ncpapi#3%EC%9D%91%EB%8B%B5%EC%83%81%ED%83%9C%EC%BD%94%EB%93%9C)를 참조해 주십시오.

## Maps API

Maps 서비스에서 제공하는 API에 대한 설명은 다음과 같습니다.

| API | 설명 |
| --- | --- |
| [Dynamic Map](/docs/application-maps-dynamic) | Web Dynamic Map, Mobile Dynamic Map 지도 이미지 생성 |
| [Static Map](/docs/application-maps-static) | 정적 지도 이미지 생성 |
| [Geocoding](/docs/application-maps-geocoding) | 주소 검색 |
| [Reverse Geocoding](/docs/application-maps-reversegeocoding) | 좌표를 주소로 변환 |
| [Directions 5](/docs/application-maps-directions5) | 경로 탐색(경유지 최대 5개) |
| [Directions 15](/docs/application-maps-directions15) | 경로 탐색(경유지 최대 15개) |

## Maps 연관 리소스

Maps API에 대한 사용자의 이해를 돕기 위해 다양한 연관 리소스를 제공하고 있습니다.

- Maps API 사용 방법
  - [API 개요](/docs/common-ncpapi): 네이버 클라우드 플랫폼에서 발급받은 Access Key, Secret Key 발급 및 확인, 요청 헤더에 필요한 서명 생성 방법
  - [API Gateway 사용 가이드](https://guide.ncloud-docs.com/docs/apigw-apigw-1): 요청 헤더에 필요한 API Key 확인 방법
  - [Ncloud 공통 응답 상태 코드](/docs/common-ncpapi#3-%EC%9D%91%EB%8B%B5-%EC%83%81%ED%83%9C-%EC%BD%94%EB%93%9C): Maps 서비스에서 사용하는 네이버 클라우드 플랫폼의 공통 응답 상태 코드 정보
- Maps 서비스 사용 방법
  - [Maps 사용 가이드](https://guide.ncloud-docs.com/docs/application-maps-overview): 네이버 클라우드 플랫폼 콘솔에서 Maps 사용하는 방법
  - [Ncloud 사용 환경 가이드](https://guide.ncloud-docs.com/docs/environment-environment-1-1): VPC, Classic 환경 및 지원 여부에 관한 사용 가이드
  - [요금 소개, 특징, 상세 기능](https://www.ncloud.com/product/applicationService/maps): Maps의 요금 체계, 특징, 상세 기능 요약
  - [서비스 최신 소식](https://www.ncloud.com/intro/news): Maps 관련 최신 소식
  - [자주 하는 질문](https://www.ncloud.com/support/faq/prod?categoryCode2=APP&categoryCode3=SV_0062&page=1): Maps 사용자들이 자주 하는 질문
  - [문의하기](https://www.ncloud.com/support/question/general): 사용 가이드를 통해서도 궁금증이 해결되지 않는 경우 직접 문의
