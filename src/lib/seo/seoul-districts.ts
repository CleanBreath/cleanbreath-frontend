// scripts/build-seoul-districts.ts가 생성한 파일 (2026-11-04). 직접 고치지 말고 스크립트를 다시 실행할 것
// 구마다 공공데이터 금연구역 조회 범위 타일 (GET /publicZone/within 한 번에 3000건 상한, 타일당 생성 시점 2000건 이하)

export interface DistrictBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

export interface SeoulDistrict {
  /** URL 슬러그 (/zones/seoul/<slug>) */
  slug: string;
  /** roadAddress의 구 이름 ("서울특별시 <ko> ...") */
  ko: string;
  en: string;
  ja: string;
  /** 비어 있으면 생성 시점에 공공데이터가 없던 구 */
  tiles: DistrictBounds[];
}

export const SEOUL_DISTRICTS: SeoulDistrict[] = [
  {
    slug: "jongno-gu",
    ko: "종로구",
    en: "Jongno-gu",
    ja: "鍾路区",
    tiles: [
      {
        swLat: 37.5639,
        swLng: 126.9518,
        neLat: 37.6163,
        neLng: 127.0249,
      },
    ],
  },
  {
    slug: "jung-gu",
    ko: "중구",
    en: "Jung-gu",
    ja: "中区",
    tiles: [
      {
        swLat: 37.5446,
        swLng: 126.9608,
        neLat: 37.5728,
        neLng: 127.0271,
      },
    ],
  },
  {
    slug: "yongsan-gu",
    ko: "용산구",
    en: "Yongsan-gu",
    ja: "龍山区",
    tiles: [
      {
        swLat: 37.5152,
        swLng: 126.9495,
        neLat: 37.5555,
        neLng: 127.0159,
      },
    ],
  },
  {
    slug: "seongdong-gu",
    ko: "성동구",
    en: "Seongdong-gu",
    ja: "城東区",
    tiles: [
      {
        swLat: 37.536,
        swLng: 127.0073,
        neLat: 37.5737,
        neLng: 127.0725,
      },
    ],
  },
  {
    slug: "gwangjin-gu",
    ko: "광진구",
    en: "Gwangjin-gu",
    ja: "広津区",
    tiles: [
      {
        swLat: 37.5261,
        swLng: 127.0597,
        neLat: 37.573,
        neLng: 127.1137,
      },
    ],
  },
  {
    slug: "dongdaemun-gu",
    ko: "동대문구",
    en: "Dongdaemun-gu",
    ja: "東大門区",
    tiles: [
      {
        swLat: 37.56,
        swLng: 127.0222,
        neLat: 37.6063,
        neLng: 127.0778,
      },
    ],
  },
  {
    slug: "jungnang-gu",
    ko: "중랑구",
    en: "Jungnang-gu",
    ja: "中浪区",
    tiles: [
      {
        swLat: 37.5693,
        swLng: 127.0705,
        neLat: 37.6213,
        neLng: 127.1119,
      },
    ],
  },
  {
    slug: "seongbuk-gu",
    ko: "성북구",
    en: "Seongbuk-gu",
    ja: "城北区",
    tiles: [
      {
        swLat: 37.5772,
        swLng: 126.989,
        neLat: 37.6248,
        neLng: 127.0717,
      },
    ],
  },
  {
    slug: "gangbuk-gu",
    ko: "강북구",
    en: "Gangbuk-gu",
    ja: "江北区",
    tiles: [
      {
        swLat: 37.6108,
        swLng: 127.004,
        neLat: 37.6635,
        neLng: 127.0471,
      },
    ],
  },
  {
    slug: "dobong-gu",
    ko: "도봉구",
    en: "Dobong-gu",
    ja: "道峰区",
    tiles: [
      {
        swLat: 37.6426,
        swLng: 127.0324,
        neLat: 37.6916,
        neLng: 127.0534,
      },
    ],
  },
  {
    slug: "nowon-gu",
    ko: "노원구",
    en: "Nowon-gu",
    ja: "蘆原区",
    tiles: [
      {
        swLat: 37.613,
        swLng: 127.0415,
        neLat: 37.6902,
        neLng: 127.1109,
      },
    ],
  },
  {
    slug: "eunpyeong-gu",
    ko: "은평구",
    en: "Eunpyeong-gu",
    ja: "恩平区",
    tiles: [
      {
        swLat: 37.5752,
        swLng: 126.8879,
        neLat: 37.6556,
        neLng: 126.9525,
      },
    ],
  },
  {
    slug: "seodaemun-gu",
    ko: "서대문구",
    en: "Seodaemun-gu",
    ja: "西大門区",
    tiles: [
      {
        swLat: 37.5541,
        swLng: 126.9015,
        neLat: 37.6059,
        neLng: 126.9696,
      },
    ],
  },
  {
    slug: "mapo-gu",
    ko: "마포구",
    en: "Mapo-gu",
    ja: "麻浦区",
    tiles: [
      {
        swLat: 37.5337,
        swLng: 126.8722,
        neLat: 37.5898,
        neLng: 126.9641,
      },
    ],
  },
  {
    slug: "yangcheon-gu",
    ko: "양천구",
    en: "Yangcheon-gu",
    ja: "陽川区",
    tiles: [
      {
        swLat: 37.4991,
        swLng: 126.8088,
        neLat: 37.5518,
        neLng: 126.8897,
      },
    ],
  },
  {
    slug: "gangseo-gu",
    ko: "강서구",
    en: "Gangseo-gu",
    ja: "江西区",
    tiles: [
      {
        swLat: 37.5263,
        swLng: 126.7962,
        neLat: 37.5908,
        neLng: 126.8794,
      },
    ],
  },
  {
    slug: "guro-gu",
    ko: "구로구",
    en: "Guro-gu",
    ja: "九老区",
    tiles: [
      {
        swLat: 37.4729,
        swLng: 126.8141,
        neLat: 37.4951,
        neLng: 126.859,
      },
      {
        swLat: 37.4729,
        swLng: 126.859,
        neLat: 37.4951,
        neLng: 126.9038,
      },
      {
        swLat: 37.4951,
        swLng: 126.8141,
        neLat: 37.5173,
        neLng: 126.859,
      },
      {
        swLat: 37.4951,
        swLng: 126.859,
        neLat: 37.5173,
        neLng: 126.9038,
      },
    ],
  },
  {
    slug: "geumcheon-gu",
    ko: "금천구",
    en: "Geumcheon-gu",
    ja: "衿川区",
    tiles: [
      {
        swLat: 37.4329,
        swLng: 126.8731,
        neLat: 37.4878,
        neLng: 126.9236,
      },
    ],
  },
  {
    slug: "yeongdeungpo-gu",
    ko: "영등포구",
    en: "Yeongdeungpo-gu",
    ja: "永登浦区",
    tiles: [
      {
        swLat: 37.4794,
        swLng: 126.8792,
        neLat: 37.5309,
        neLng: 126.9273,
      },
      {
        swLat: 37.4794,
        swLng: 126.9273,
        neLat: 37.5309,
        neLng: 126.9753,
      },
      {
        swLat: 37.5309,
        swLng: 126.8792,
        neLat: 37.5823,
        neLng: 126.9273,
      },
      {
        swLat: 37.5309,
        swLng: 126.9273,
        neLat: 37.5823,
        neLng: 126.9753,
      },
    ],
  },
  {
    slug: "dongjak-gu",
    ko: "동작구",
    en: "Dongjak-gu",
    ja: "銅雀区",
    tiles: [
      {
        swLat: 37.4745,
        swLng: 126.9023,
        neLat: 37.5178,
        neLng: 126.9843,
      },
    ],
  },
  {
    slug: "gwanak-gu",
    ko: "관악구",
    en: "Gwanak-gu",
    ja: "冠岳区",
    tiles: [
      {
        swLat: 37.4536,
        swLng: 126.9009,
        neLat: 37.4968,
        neLng: 126.9897,
      },
    ],
  },
  {
    slug: "seocho-gu",
    ko: "서초구",
    en: "Seocho-gu",
    ja: "瑞草区",
    tiles: [
      {
        swLat: 37.4455,
        swLng: 126.9801,
        neLat: 37.5226,
        neLng: 127.0943,
      },
    ],
  },
  {
    slug: "gangnam-gu",
    ko: "강남구",
    en: "Gangnam-gu",
    ja: "江南区",
    tiles: [
      {
        swLat: 37.4617,
        swLng: 127.0174,
        neLat: 37.5347,
        neLng: 127.121,
      },
    ],
  },
  {
    slug: "songpa-gu",
    ko: "송파구",
    en: "Songpa-gu",
    ja: "松坡区",
    tiles: [],
  },
  {
    slug: "gangdong-gu",
    ko: "강동구",
    en: "Gangdong-gu",
    ja: "江東区",
    tiles: [
      {
        swLat: 37.5227,
        swLng: 127.1205,
        neLat: 37.5716,
        neLng: 127.1823,
      },
    ],
  },
];
