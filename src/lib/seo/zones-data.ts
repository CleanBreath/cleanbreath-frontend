import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type {
  AddressItem,
  AllAddressResponse,
  PublicZoneItem,
  PublicZoneListResponse,
  PublicZoneType,
} from "@/types";
import { parseSeoulGu } from "./seoul-address";
import { type DistrictBounds, SEOUL_DISTRICTS } from "./seoul-districts";

// 지역별 금연구역 페이지(/zones/*)의 서버 조회. axios(src/api) 대신 fetch를 써야 Next 데이터 캐시에 들어간다
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1";

/** 응답 데이터 캐시 1일. 페이지(segment revalidate)는 더 자주 다시 그려 빌드 때 실패한 페이지가 빨리 채워지게 한다 */
export const ZONES_DATA_REVALIDATE = 86400;
const TIMEOUT_MS = 15_000;
const RETRIES = 1;
// 구 목록 페이지가 타일 30여 개를 한꺼번에 부르지 않도록 동시 요청 수 제한
const CONCURRENCY = 4;

export const PUBLIC_ZONE_TYPES: PublicZoneType[] = [
  "TRANSIT",
  "PARK",
  "STREET",
  "BOUNDARY",
];

async function getJson<T>(
  path: string,
  params?: Record<string, number>,
): Promise<T> {
  const qs = params
    ? `?${new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      )}`
    : "";
  // 빌드 때 여러 워커가 동시에 부르면 연결 시간 초과가 가끔 나서 네트워크 오류·5xx는 한 번 더 시도한다
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`${API_URL}${path}${qs}`, {
        next: { revalidate: ZONES_DATA_REVALIDATE, tags: ["zones"] },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) {
        const error = new Error(`GET ${path} ${res.status}`);
        if (res.status < 500) throw Object.assign(error, { retry: false });
        throw error;
      }
      return (await res.json()) as T;
    } catch (error) {
      const retryable = (error as { retry?: boolean }).retry !== false;
      if (attempt >= RETRIES + 1 || !retryable) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

/**
 * 백엔드 DB는 매일 23:00-08:30 KST에 꺼진다. 빌드·개발 중 조회가 실패하면 null을 돌려 데이터 없이 그리고,
 * 운영 재생성(ISR) 중에는 그대로 던져 Next가 마지막으로 성공한 페이지를 계속 내보내게 한다
 */
async function loadOrNull<T>(label: string, load: () => Promise<T>) {
  try {
    return await load();
  } catch (error) {
    const degrade =
      process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD ||
      process.env.NODE_ENV === "development";
    if (!degrade) throw error;
    console.warn(`[zones] ${label} 조회 실패, 데이터 없이 렌더링:`, error);
    return null;
  }
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  // 하나라도 실패하면 남은 요청은 보내지 않는다 (서버가 꺼져 있을 때 정적 생성 시간 제한 60초 안에 끝나도록)
  let failed = false;
  const worker = async () => {
    while (next < items.length && !failed) {
      const i = next++;
      try {
        results[i] = await fn(items[i]);
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}

const tileKey = (t: DistrictBounds) =>
  `${t.swLat},${t.swLng},${t.neLat},${t.neLng}`;

/** 타일들의 공공데이터 행을 id로 중복 제거해 합친다. updateAt은 가장 늦은 응답 값 */
async function fetchTiles(tiles: DistrictBounds[]) {
  const unique = [...new Map(tiles.map((t) => [tileKey(t), t])).values()];
  const responses = await mapLimit(unique, CONCURRENCY, (t) =>
    getJson<PublicZoneListResponse>("/publicZone/within", { ...t }),
  );
  const rows = new Map<number, PublicZoneItem>();
  for (const r of responses) for (const item of r.data) rows.set(item.id, item);
  const updateAt =
    responses
      .map((r) => r.updateAt)
      .sort()
      .at(-1) ?? null;
  return { rows: [...rows.values()], updateAt };
}

const maxDate = (dates: (string | null)[]) =>
  dates
    .filter((d): d is string => !!d)
    .sort()
    .at(-1) ?? null;

export type ZoneTypeCounts = Record<PublicZoneType, number>;

function countByType(rows: PublicZoneItem[]): ZoneTypeCounts {
  const counts = { TRANSIT: 0, PARK: 0, STREET: 0, BOUNDARY: 0 };
  for (const r of rows) counts[r.zoneType] += 1;
  return counts;
}

export interface DistrictZones {
  rows: PublicZoneItem[];
  counts: ZoneTypeCounts;
  /** 조회 범위 안에서 도로명주소가 없어 구를 알 수 없던 행 수 */
  noAddressCount: number;
  latestReferenceDate: string | null;
  updateAt: string | null;
}

function summarize(
  rows: PublicZoneItem[],
  noAddressCount: number,
  updateAt: string | null,
): DistrictZones {
  return {
    rows,
    counts: countByType(rows),
    noAddressCount,
    latestReferenceDate: maxDate(rows.map((r) => r.referenceDate)),
    updateAt,
  };
}

const byName = (a: PublicZoneItem, b: PublicZoneItem) =>
  a.name.localeCompare(b.name, "ko");

/** 구 하나의 공공데이터 금연구역. 조회 실패 시 빌드·개발 중에는 null */
export async function getDistrictZones(slug: string) {
  const district = SEOUL_DISTRICTS.find((d) => d.slug === slug);
  if (!district) return null;
  return loadOrNull(`district ${slug}`, async () => {
    const { rows, updateAt } = await fetchTiles(district.tiles);
    const own = rows
      .filter((r) => parseSeoulGu(r.roadAddress) === district.ko)
      .sort(byName);
    const noAddress = rows.filter((r) => !r.roadAddress).length;
    return summarize(own, noAddress, updateAt);
  });
}

export interface SeoulSummary {
  districts: { slug: string; total: number; counts: ZoneTypeCounts }[];
  total: number;
  noAddressCount: number;
  latestReferenceDate: string | null;
  updateAt: string | null;
}

/** 서울 25개 구별 개수. 구 상세 페이지와 같은 타일 URL을 불러 데이터 캐시를 함께 쓴다 */
export async function getSeoulSummary() {
  return loadOrNull<SeoulSummary>("seoul summary", async () => {
    const { rows, updateAt } = await fetchTiles(
      SEOUL_DISTRICTS.flatMap((d) => d.tiles),
    );
    const byGu = new Map<string, PublicZoneItem[]>();
    for (const r of rows) {
      const gu = parseSeoulGu(r.roadAddress);
      if (gu) byGu.set(gu, [...(byGu.get(gu) ?? []), r]);
    }
    const districts = SEOUL_DISTRICTS.map((d) => {
      const own = byGu.get(d.ko) ?? [];
      return { slug: d.slug, total: own.length, counts: countByType(own) };
    });
    const seoulRows = [...byGu.values()].flat();
    return {
      districts,
      total: seoulRows.length,
      noAddressCount: rows.filter((r) => !r.roadAddress).length,
      latestReferenceDate: maxDate(seoulRows.map((r) => r.referenceDate)),
      updateAt,
    };
  });
}

export type AnyangGroup = "smoking" | "nonSmoking";

export interface AnyangZones {
  items: (AddressItem & { group: AnyangGroup })[];
  /** /allAddress 중 주소가 안양시가 아니라 뺀 구역 수 (과천시 등) */
  outsideCount: number;
  updateAt: string | null;
}

/** 경로 하나라도 흡연구역(SMOKING_ZONE_*)이면 흡연구역으로 묶는다 */
const anyangGroup = (item: AddressItem): AnyangGroup =>
  item.path.some((p) => p.divisionArea.startsWith("SMOKING_ZONE"))
    ? "smoking"
    : "nonSmoking";

/** CleanBreath 서버에 등록된 안양시 구역. 조회 실패 시 빌드·개발 중에는 null */
export async function getAnyangZones() {
  return loadOrNull<AnyangZones>("anyang", async () => {
    const res = await getJson<AllAddressResponse>("/allAddress");
    // 원본 주소가 "경기도 안양시"와 "경기 안양시" 두 가지로 섞여 있다
    const isAnyang = (a: AddressItem) =>
      /^경기(도)?\s*안양시/.test(a.addressName);
    const items = res.data
      .filter(isAnyang)
      .map((a) => ({ ...a, group: anyangGroup(a) }))
      .sort((a, b) => a.buildingName.localeCompare(b.buildingName, "ko"));
    return {
      items,
      outsideCount: res.data.length - items.length,
      updateAt: res.updateAt ?? null,
    };
  });
}

/**
 * 백엔드 updateAt은 오프셋 없는 서버 시각(UTC, 예 "2026-11-04T07:10:18.0099")이고 응답을 만든 시각이다.
 * UTC로 읽어 Date로 바꾼다. 형식이 다르면 null
 */
export function parseServerTime(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(`${value.slice(0, 23)}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}
