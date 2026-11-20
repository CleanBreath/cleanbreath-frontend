/**
 * 서울 25개 구의 조회 범위(bbox 타일)를 만들어 src/lib/seo/seoul-districts.ts로 저장하는 일회성 스크립트.
 *
 * GET /publicZone/within은 한 번에 최대 3000건이라, 서울 전체를 격자로 나눠(3000건이 차면 4등분) 모두 받은 뒤
 * roadAddress("서울특별시 <구> ...")로 구를 나누고, 구마다 경계 사각형과 그 사각형을 덮는 타일 목록을 계산한다.
 * 타일 하나에 들어가는 행(이웃 구 포함)이 TILE_LIMIT 이하가 되도록 나눠, 데이터가 늘어도 3000건 상한에 여유를 둔다.
 *
 * 실행: bunx tsx scripts/build-seoul-districts.ts  (DB가 꺼지는 23:00-08:30 KST에는 실패한다)
 * 환경 변수 API_URL로 서버를 바꿀 수 있다 (기본값 운영 서버)
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseSeoulGu } from "../src/lib/seo/seoul-address";

const API_URL = process.env.API_URL ?? "https://cb-server.cmu02-studio.com/v1";
const API_CAP = 3000;
const TILE_LIMIT = 2000;
// 서울특별시 전체를 덮는 사각형 (경계보다 조금 넓게)
const SEOUL = { swLat: 37.41, swLng: 126.73, neLat: 37.72, neLng: 127.28 };
const START_STEP = 0.05;
const PAD = 0.002;

// 슬러그·영어·일본어 표기 (국립국어원 로마자 표기, 일본어는 한자 지명)
const DISTRICTS = [
  ["종로구", "jongno-gu", "Jongno-gu", "鍾路区"],
  ["중구", "jung-gu", "Jung-gu", "中区"],
  ["용산구", "yongsan-gu", "Yongsan-gu", "龍山区"],
  ["성동구", "seongdong-gu", "Seongdong-gu", "城東区"],
  ["광진구", "gwangjin-gu", "Gwangjin-gu", "広津区"],
  ["동대문구", "dongdaemun-gu", "Dongdaemun-gu", "東大門区"],
  ["중랑구", "jungnang-gu", "Jungnang-gu", "中浪区"],
  ["성북구", "seongbuk-gu", "Seongbuk-gu", "城北区"],
  ["강북구", "gangbuk-gu", "Gangbuk-gu", "江北区"],
  ["도봉구", "dobong-gu", "Dobong-gu", "道峰区"],
  ["노원구", "nowon-gu", "Nowon-gu", "蘆原区"],
  ["은평구", "eunpyeong-gu", "Eunpyeong-gu", "恩平区"],
  ["서대문구", "seodaemun-gu", "Seodaemun-gu", "西大門区"],
  ["마포구", "mapo-gu", "Mapo-gu", "麻浦区"],
  ["양천구", "yangcheon-gu", "Yangcheon-gu", "陽川区"],
  ["강서구", "gangseo-gu", "Gangseo-gu", "江西区"],
  ["구로구", "guro-gu", "Guro-gu", "九老区"],
  ["금천구", "geumcheon-gu", "Geumcheon-gu", "衿川区"],
  ["영등포구", "yeongdeungpo-gu", "Yeongdeungpo-gu", "永登浦区"],
  ["동작구", "dongjak-gu", "Dongjak-gu", "銅雀区"],
  ["관악구", "gwanak-gu", "Gwanak-gu", "冠岳区"],
  ["서초구", "seocho-gu", "Seocho-gu", "瑞草区"],
  ["강남구", "gangnam-gu", "Gangnam-gu", "江南区"],
  ["송파구", "songpa-gu", "Songpa-gu", "松坡区"],
  ["강동구", "gangdong-gu", "Gangdong-gu", "江東区"],
] as const;

interface Bounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

interface Row {
  id: number;
  roadAddress: string | null;
  latitude: number;
  longitude: number;
}

const round = (n: number) => Math.round(n * 1e4) / 1e4;

async function fetchWithin(b: Bounds): Promise<Row[]> {
  const qs = new URLSearchParams({
    swLat: String(b.swLat),
    swLng: String(b.swLng),
    neLat: String(b.neLat),
    neLng: String(b.neLng),
  });
  const res = await fetch(`${API_URL}/publicZone/within?${qs}`);
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const json = (await res.json()) as { data: Row[] };
  return json.data;
}

function split(b: Bounds): Bounds[] {
  const midLat = (b.swLat + b.neLat) / 2;
  const midLng = (b.swLng + b.neLng) / 2;
  return [
    { swLat: b.swLat, swLng: b.swLng, neLat: midLat, neLng: midLng },
    { swLat: b.swLat, swLng: midLng, neLat: midLat, neLng: b.neLng },
    { swLat: midLat, swLng: b.swLng, neLat: b.neLat, neLng: midLng },
    { swLat: midLat, swLng: midLng, neLat: b.neLat, neLng: b.neLng },
  ];
}

async function fetchAll(b: Bounds, out: Map<number, Row>) {
  const rows = await fetchWithin(b);
  if (rows.length >= API_CAP) {
    for (const part of split(b)) await fetchAll(part, out);
    return;
  }
  for (const r of rows) out.set(r.id, r);
}

const inside = (r: Row, b: Bounds) =>
  r.latitude >= b.swLat &&
  r.latitude <= b.neLat &&
  r.longitude >= b.swLng &&
  r.longitude <= b.neLng;

/** 타일마다 (이웃 구 포함) 행 수가 TILE_LIMIT 이하가 될 때까지 n×n으로 나눈다 */
function tilesFor(b: Bounds, all: Row[]): Bounds[] {
  for (let n = 1; ; n++) {
    const dLat = (b.neLat - b.swLat) / n;
    const dLng = (b.neLng - b.swLng) / n;
    const tiles: Bounds[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        tiles.push({
          swLat: round(b.swLat + dLat * i),
          swLng: round(b.swLng + dLng * j),
          neLat: round(i === n - 1 ? b.neLat : b.swLat + dLat * (i + 1)),
          neLng: round(j === n - 1 ? b.neLng : b.swLng + dLng * (j + 1)),
        });
      }
    }
    if (
      tiles.every((t) => all.filter((r) => inside(r, t)).length <= TILE_LIMIT)
    )
      return tiles;
  }
}

async function main() {
  const rows = new Map<number, Row>();
  for (let lat = SEOUL.swLat; lat < SEOUL.neLat; lat += START_STEP) {
    for (let lng = SEOUL.swLng; lng < SEOUL.neLng; lng += START_STEP) {
      await fetchAll(
        {
          swLat: round(lat),
          swLng: round(lng),
          neLat: round(Math.min(lat + START_STEP, SEOUL.neLat)),
          neLng: round(Math.min(lng + START_STEP, SEOUL.neLng)),
        },
        rows,
      );
    }
  }
  const all = [...rows.values()];
  if (process.env.DUMP) writeFileSync(process.env.DUMP, JSON.stringify(all));
  const noAddress = all.filter((r) => !r.roadAddress).length;
  console.log(`rows ${all.length}, roadAddress 없음 ${noAddress}`);

  const prefixes = new Map<string, number>();
  for (const r of all) {
    const p = r.roadAddress?.split(" ").slice(0, 2).join(" ") ?? "(null)";
    prefixes.set(p, (prefixes.get(p) ?? 0) + 1);
  }
  console.log([...prefixes].sort((a, b) => b[1] - a[1]));

  const districts = DISTRICTS.map(([ko, slug, en, ja]) => {
    const own = all.filter((r) => parseSeoulGu(r.roadAddress) === ko);
    // 아직 공공데이터에 없는 구는 타일 없이 남긴다 (목록에는 보이되 상세 페이지는 만들지 않음)
    if (own.length === 0) {
      console.log(`${ko} 0건`);
      return { slug, ko, en, ja, tiles: [] as Bounds[] };
    }
    const bounds: Bounds = {
      swLat: round(Math.min(...own.map((r) => r.latitude)) - PAD),
      swLng: round(Math.min(...own.map((r) => r.longitude)) - PAD),
      neLat: round(Math.max(...own.map((r) => r.latitude)) + PAD),
      neLng: round(Math.max(...own.map((r) => r.longitude)) + PAD),
    };
    const tiles = tilesFor(bounds, all);
    console.log(`${ko} ${own.length}건, 타일 ${tiles.length}`);
    return { slug, ko, en, ja, tiles };
  });

  const generatedAt = new Date().toISOString().slice(0, 10);
  const body = `// scripts/build-seoul-districts.ts가 생성한 파일 (${generatedAt}). 직접 고치지 말고 스크립트를 다시 실행할 것
// 구마다 공공데이터 금연구역 조회 범위 타일 (GET /publicZone/within 한 번에 ${API_CAP}건 상한, 타일당 생성 시점 ${TILE_LIMIT}건 이하)

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

export const SEOUL_DISTRICTS: SeoulDistrict[] = ${JSON.stringify(districts, null, 2)};
`;
  const out = join(process.cwd(), "src/lib/seo/seoul-districts.ts");
  writeFileSync(out, body);
  console.log(`written ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
