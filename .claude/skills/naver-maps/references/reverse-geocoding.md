> 출처: https://api.ncloud-docs.com/docs/application-maps-reversegeocoding.md (원문 업데이트 2026-09-17)

# Reverse Geocoding

VPC 환경에서 이용 가능합니다.

입력한 좌표 값을 주소 정보(법정동, 행정동, 지번 주소, 도로명 주소)로 변환합니다.

참고

Reverse Geocoding API에서는 EPSG (European Petroleum Survey Group)에서 지정한 일부 좌표 체계와 한국에서 주로 사용하는 좌표 체계를 지원합니다. 지원되는 좌표 체계에 대한 자세한 정보는 [좌표 체계](/docs/application-maps-reversegeocoding#%EC%A2%8C%ED%91%9C%EC%B2%B4%EA%B3%84)를 참조해 주십시오.

## 요청

요청 형식을 설명합니다. 요청 형식은 다음과 같습니다.

| 메서드 | URI |
| --- | --- |
| GET | /gc |

### 요청 헤더

Maps API에서 공통으로 사용하는 헤더에 대한 정보는 [Maps 요청 헤더](/docs/application-maps-overview#%EC%9A%94%EC%B2%AD%ED%97%A4%EB%8D%94)를 참조해 주십시오.

### 요청 쿼리 파라미터

요청 쿼리 파라미터에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `coords` | String | Required | 좌표(X 좌표,Y 좌표) - <예시> `coords=128.12345,37.98776` |
| `sourcecrs` | String | Optional | 입력 좌표계 코드 - `EPSG:4326` (기본값) \| `EPSG:3857` \| `NHN:2048` - `EPSG:4326`: WGS84 경위도 - `EPSG:3857`: 구글 맵 - `NHN:2048`: UTM-K - 지원되는 좌표계 코드는 [좌표 체계](/docs/application-maps-reversegeocoding#%EC%A2%8C%ED%91%9C%EC%B2%B4%EA%B3%84) 참조 |
| `targetcrs` | String | Optional | 출력 좌표계 코드 - `EPSG:4326` (기본값) \| `EPSG:3857` \| `NHN:2048` - `EPSG:4326`: WGS84 경위도 - `EPSG:3857`: 구글 맵 - `NHN:2048`: UTM-K - 지원되는 좌표계 코드는 [좌표 체계](/docs/application-maps-reversegeocoding#%EC%A2%8C%ED%91%9C%EC%B2%B4%EA%B3%84) 참조 |
| `orders` | String | Optional | 변환 타입 - `legalcode` (기본값) \| `admcode` (기본값) \| `addr` \| `roadaddr` - `legalcode`: 법정동으로 변환 - `admcode`: 행정동으로 변환 - `addr`: 지번 주소로 변환 - `roadaddr`: 도로명 주소로 변환 - ','로 구분하여 여러 옵션 값을 입력할 수 있으며, 입력순으로 결과 표시 - 해안선 부근이나 신규 택지 등 상세 주소가 없는 지역의 좌표 변환 시 `addr` 또는 `roadaddr`로 요청하면 결과가 반환되지 않을 수 있으나, `legalcode` 또는 `admcode`로 요청하면 법정동 또는 행정동 단위 주소 확인 가능 - <예시> `orders=legalcode,addr` |
| `output` | String | Optional | 응답 결과의 포맷 유형 - `xml` (기본값) \| `json` |
| `callback` | String | Optional | 콜백 이름 - JSONP 통신을 위해 콜백 처리 시 이용 - 입력한 이름으로 JSON 데이터를 감싸서 반환 - `output`이 `json`인 경우에만 입력 가능 - <예시> `callback=abc` |

#### 좌표 체계

좌표 체계에 대한 설명은 다음과 같습니다.

| 이름 | 코드 | 구분 | GCS 정보 | PCS 정보 |
| --- | --- | --- | --- | --- |
| 구글 맵 | EPSG:3857 | PCS | WGS_1984 | WGS_1984 | 6378137 (Semi_Minor) | 298.2572236 | Greenwich | Degree | M | 0 | 0 | 0 | 0 | Meter | 1 |
| WGS 84 경위도 | EPSG:4326 | GCS | WGS_1984 | WGS_1984 | 6378137 | 298.2572236 | Greenwich | Degree | - | - | - | - | - | - | - |
| UTM-K | NHN:2048 | PCS | D_ITRF_2000 | GRS_1980 | 6378137 | 298.2572221 | Greenwich | Degree | TM | 127.5 | 38 | 2,000,000 | 1,000,000 | Meter | 0.9996 |

### 요청 예시

요청 예시는 다음과 같습니다.

```
curl --location --request GET 'https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=127.585%2C34.9765&output=json&orders=legalcode%2Cadmcode%2Caddr%2Croadaddr' \
--header 'x-ncp-apigw-api-key-id: {API Key ID}' \
--header 'x-ncp-apigw-api-key: {API Key}'
```

참고

입력한 좌표에 따라 다양한 응답 결과가 반환될 수 있습니다. 다음의 요청 예시를 참조해 주십시오.

- 일반 읍/면/동
  - `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=126.9913201,37.5666936&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=xml`
  - `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=129.1133567,35.2982640&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=xml`
- 일반 리: 법정동 단위인 읍/면 하위의 리 단위 좌표는 `admcode` 결과에도 `codeType`이 `L`로 표시됨
  - `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=128.2439084,36.4938906&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=xml`
- 영역은 다르지만 법정동과 동일한 이름의 행정동이 존재하는 경우
  - `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=127.1114893,37.3614463&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=xml`
- 세종시: 시/군/구에 대한 데이터가 존재하지 않고, 영역은 다르지만 하위의 모든 행정동의 법정동이 동일하게 표시됨
  - 세종시 어진동: `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=127.2654387,36.5008113&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=xm`
  - 세종시 조치원읍: `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=127.2923750,36.5929071&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=xml`
- 바다 위 좌표: 응답 결과가 표시되지 않음
  - `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=125.9913201,37.5666936&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=xml`

## 응답

응답 형식을 설명합니다.

### 응답 바디

응답 바디에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `status` | Object | - | 응답 상태에 대한 정보 |
| `status.code` | Integer | - | 응답 상태 코드 |
| `status.name` | String | - | 응답 상태 메시지 |
| `status.message` | String | - | 응답 상태에 대한 설명 |
| `results` | Array | - | 응답 결과: [results](/docs/application-maps-reversegeocoding#results) |

#### `results`

`results`에 대한 설명은 다음과 같습니다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `name` | String | - | 변환 타입 |
| `code` | Object | - | 코드 정보 |
| `code.id` | String | - | 코드 ID |
| `code.type` | String | - | 코드 타입 - `L` \| `A` \| `S` - `L`: 법정동 - `A`: 행정동 - `S`: 영역은 다르지만 동일한 이름의 법정동이 존재하는 행정동 |
| `code.mappingId` | String | - | 법정/행정 코드에 매핑된 네이버 동 코드의 ID |
| `region` | Object | - | 주소 정보 |
| `region.areaN` | Object | - | 행정 구역 정보 - 변환된 주소의 가장 큰 행정 구역 단위부터 순차적으로 표시 |
| `region.areaN.name` | String | - | 행정 구역 단위 이름 - `region.area0.name`: 국가 코드 최상위 도메인으로, `kr` 표시 - `region.area1.name`: 행정안전부에서 공시한 시/도 이름 - `region.area2.name`: 행정안전부에서 공시한 시/군/구 이름 - `region.area3.name`: 행정안전부에서 공시한 읍/면/동 이름 - `region.area4.name`: 행정안전부에서 공시한 리 이름 |
| `region.areaN.coords` | Object | - | 행정 구역 위치 정보 |
| `region.areaN.coords.center` | Object | - | 행정 구역 중심 좌표 |
| `region.areaN.coords.center.crs` | String | - | 좌표계 코드 - 지원되는 좌표계 코드는 [좌표 체계](/docs/application-maps-reversegeocoding#%EC%A2%8C%ED%91%9C%EC%B2%B4%EA%B3%84) 참조 |
| `region.areaN.coords.center.x` | Float | - | X 좌표 - `land.coords.center.crs`이 `EPSG:4326`인 경우, 경도 |
| `region.areaN.coords.center.y` | Float | - | Y 좌표 - `land.coords.center.crs`이 `EPSG:4326`인 경우, 위도 |
| `land` | Object | - | 상세 주소 정보 |
| `land.type` | String | - | 지적 타입 - `name`이 `addr`인 경우에만 상세 값 표시 - `1` \| `2` - `1`: 일반 토지 - `2`: 산 |
| `land.name` | String | - | 도로 이름 - `name`이 `roadaddr`인 경우에만 상세 값 표시 |
| `land.number1` | String | - | 상세 번호 - `name`이 `addr`인 경우 토지 본번호 - `name`이 `roadaddr`인 경우 상세 주소 |
| `land.number2` | String | - | 토지 부번호 - `name`이 `addr`인 경우에만 상세 값 표시 |
| `land.coords` | Object | - | 상세 주소 위치 정보 |
| `land.coords.center` | Object | - | 상세 주소 중심 좌표 |
| `land.coords.center.crs` | String | - | 좌표계 코드 - 지원되는 좌표계 코드는 [좌표 체계](/docs/application-maps-reversegeocoding#%EC%A2%8C%ED%91%9C%EC%B2%B4%EA%B3%84) 참조 |
| `land.coords.center.x` | Float | - | X 좌표 - `land.coords.center.crs`이 `EPSG:4326`인 경우, 경도 |
| `land.coords.center.y` | Float | - | Y 좌표 - `land.coords.center.crs`이 `EPSG:4326`인 경우, 위도 |
| `land.additionN` | Object | - | 추가 정보 - `name`이 `roadaddr`인 경우에만 상세 값 표시 - `land.addition0`: 건물 정보 - `land.addition1`: 우편 번호 정보 - `land.addition2`: 도로 코드 정보 |
| `land.additionN.type` | String | - | 추가 정보 타입 - `land.addition0.type`: `building` - `land.addition1.type`: `zipcode` - `land.addition2.type`: `roadGroupCode` |
| `land.additionN.value` | String | - | 추가 정보 값 - `land.addition0.value`: 건물 이름 - `land.addition1.value`: 우편번호 - `land.addition2.value`: 도로 코드(12자리) |

### 응답 상태 코드

응답 상태 코드에 대한 설명은 다음과 같습니다.

| HTTP 상태 코드 | 코드 | 메시지 | 설명 |
| --- | --- | --- | --- |
| 200 | 0 | ok | 요청 처리 성공. 응답 결과 반환 |
| 200 | 3 | no results | 요청 처리 성공. 응답 결과 반환되지 않음 |
| 400 | 100 | invalid request | 요청 파라미터 오류 |
| 500 | 900 | unknown error / io error | 정의되지 않은 오류 |

참고

Maps API에서 공통으로 사용하는 응답 상태 코드에 대한 정보는 [Maps 응답 상태 코드](/docs/application-maps-overview#%EC%9D%91%EB%8B%B5%EC%83%81%ED%83%9C%EC%BD%94%EB%93%9C)를 참조해 주십시오.

### 응답 예시

응답 예시는 다음과 같습니다.

```
{
    "status": {
        "code": 0,
        "name": "ok",
        "message": "done"
    },
    "results": [
        {
            "name": "legalcode",
            "code": {
                "id": "4623025024",
                "type": "L",
                "mappingId": "1223025024"
            },
            "region": {
                "area0": {
                    "name": "kr",
                    "coords": {
                        "center": {
                            "crs": "",
                            "x": 0.0,
                            "y": 0.0
                        }
                    }
                },
                "area1": {
                    "name": "전라남도",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 126.957167,
                            "y": 34.900727
                        }
                    },
                    "alias": "전남"
                },
                "area2": {
                    "name": "광양시",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 127.695899,
                            "y": 34.940658
                        }
                    }
                },
                "area3": {
                    "name": "광양읍",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 127.58105,
                            "y": 34.97341
                        }
                    }
                },
                "area4": {
                    "name": "읍내리",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 127.5863,
                            "y": 34.9751
                        }
                    }
                }
            }
        },
        {
            "name": "admcode",
            "code": {
                "id": "4623025000",
                "type": "L",
                "mappingId": "12230250"
            },
            "region": {
                "area0": {
                    "name": "kr",
                    "coords": {
                        "center": {
                            "crs": "",
                            "x": 0.0,
                            "y": 0.0
                        }
                    }
                },
                "area1": {
                    "name": "전라남도",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 126.957167,
                            "y": 34.900727
                        }
                    },
                    "alias": "전남"
                },
                "area2": {
                    "name": "광양시",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 127.695899,
                            "y": 34.940658
                        }
                    }
                },
                "area3": {
                    "name": "광양읍",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 127.58105,
                            "y": 34.97341
                        }
                    }
                },
                "area4": {
                    "name": "",
                    "coords": {
                        "center": {
                            "crs": "",
                            "x": 0.0,
                            "y": 0.0
                        }
                    }
                }
            }
        },
        {
            "name": "addr",
            "code": {
                "id": "4623025024",
                "type": "L",
                "mappingId": "1223025024"
            },
            "region": {
                "area0": {
                    "name": "kr",
                    "coords": {
                        "center": {
                            "crs": "",
                            "x": 0.0,
                            "y": 0.0
                        }
                    }
                },
                "area1": {
                    "name": "전라남도",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 126.957167,
                            "y": 34.900727
                        }
                    },
                    "alias": "전남"
                },
                "area2": {
                    "name": "광양시",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 127.695899,
                            "y": 34.940658
                        }
                    }
                },
                "area3": {
                    "name": "광양읍",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 127.58105,
                            "y": 34.97341
                        }
                    }
                },
                "area4": {
                    "name": "읍내리",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 127.5863,
                            "y": 34.9751
                        }
                    }
                }
            },
            "land": {
                "type": "1",
                "number1": "252",
                "number2": "1",
                "addition0": {
                    "type": "",
                    "value": ""
                },
                "addition1": {
                    "type": "",
                    "value": ""
                },
                "addition2": {
                    "type": "",
                    "value": ""
                },
                "addition3": {
                    "type": "",
                    "value": ""
                },
                "addition4": {
                    "type": "",
                    "value": ""
                },
                "coords": {
                    "center": {
                        "crs": "",
                        "x": 0.0,
                        "y": 0.0
                    }
                }
            }
        },
        {
            "name": "roadaddr",
            "code": {
                "id": "4623025024",
                "type": "L",
                "mappingId": "1223025024"
            },
            "region": {
                "area0": {
                    "name": "kr",
                    "coords": {
                        "center": {
                            "crs": "",
                            "x": 0.0,
                            "y": 0.0
                        }
                    }
                },
                "area1": {
                    "name": "전라남도",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 126.957167,
                            "y": 34.900727
                        }
                    },
                    "alias": "전남"
                },
                "area2": {
                    "name": "광양시",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 127.695899,
                            "y": 34.940658
                        }
                    }
                },
                "area3": {
                    "name": "광양읍",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 127.58105,
                            "y": 34.97341
                        }
                    }
                },
                "area4": {
                    "name": "읍내리",
                    "coords": {
                        "center": {
                            "crs": "EPSG:4326",
                            "x": 127.5863,
                            "y": 34.9751
                        }
                    }
                }
            },
            "land": {
                "type": "",
                "number1": "20",
                "number2": "",
                "addition0": {
                    "type": "building",
                    "value": ""
                },
                "addition1": {
                    "type": "zipcode",
                    "value": "57742"
                },
                "addition2": {
                    "type": "roadGroupCode",
                    "value": "462304655159"
                },
                "addition3": {
                    "type": "",
                    "value": ""
                },
                "addition4": {
                    "type": "",
                    "value": ""
                },
                "name": "매일시장길",
                "coords": {
                    "center": {
                        "crs": "",
                        "x": 0.0,
                        "y": 0.0
                    }
                }
            }
        }
    ]
}
```
