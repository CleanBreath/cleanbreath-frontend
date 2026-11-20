import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { cache } from "react";
import type {
  AddressItem,
  AllAddressResponse,
  PublicZoneItem,
  PublicZoneListResponse,
  PublicZoneType,
} from "@/types";
import { isTimeoutError, withDeadline } from "./deadline";
import { parseSeoulGu } from "./seoul-address";
import { type DistrictBounds, SEOUL_DISTRICTS } from "./seoul-districts";

// 지역별 금연구역 페이지(/zones/*)의 서버 조회. axios(src/api) 대신 fetch를 써야 Next 데이터 캐시에 들어간다
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1";

/** 응답 데이터 캐시 1일. 페이지(segment revalidate)는 더 자주 다시 그려 빌드 때 실패한 페이지가 빨리 채워지게 한다 */
export const ZONES_DATA_REVALIDATE = 86400;
const IS_BUILD = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
// 빌드 중에는 정적 생성 시간 제한(60초) 안에 끝나도록 짧게 기다린다.
// 야간 DB 중지 중에는 백엔드가 연결을 거부하지 않고 매달려 있어 시도마다 제한 시간을 다 쓰므로,
// 빌드에서는 제한 시간 초과를 다시 시도하지 않는다 (연결 오류·5xx는 그대로 한 번 더 시도)
const TIMEOUT_MS = IS_BUILD ? 10_000 : 15_000;
const RETRIES = 1;
/** /publicZone/within 한 번에 돌려주는 최대 행 수. 타일 응답이 여기에 닿으면 잘린 것일 수 있다 */
const WITHIN_ROW_CAP = 3000;
// 구 목록 페이지가 타일 30여 개를 한꺼번에 부르지 않도록 동시 요청 수 제한
const CONCURRENCY = 4;

export const PUBLIC_ZONE_TYPES: PublicZoneType[] = [
  "TRANSIT",
  "PARK",
  "STREET",
  "BOUNDARY",
];

/**
 * 빌드 워커 안에서 API 응답이 제한 시간을 넘기면 남은 페이지는 바로 데이터 없이 만든다
 * (페이지마다 제한 시간을 다시 기다리면 야간 배포가 아주 느려지거나 워커가 재시작된다).
 * 빌드 때만 쓰며, 이렇게 만든 페이지는 revalidate로 운영 중에 다시 채워진다
 */
let buildApiDown = false;

async function getJson<T>(
  path: string,
  params?: Record<string, number>,
): Promise<T> {
  if (IS_BUILD && buildApiDown) {
    throw new Error(
      `GET ${path} 건너뜀: 이번 빌드에서 API가 응답하지 않았습니다`,
    );
  }
  const qs = params
    ? `?${new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      )}`
    : "";
  // 빌드 때 여러 워커가 동시에 부르면 연결 시간 초과가 가끔 나서 네트워크 오류·5xx는 한 번 더 시도한다
  for (let attempt = 1; ; attempt++) {
    try {
      // 오래된 캐시 재검증에서는 Next가 signal을 빼므로 withDeadline으로도 끊는다 (deadline.ts)
      const load = async () => {
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
      };
      return await withDeadline(load(), TIMEOUT_MS, `GET ${path}`);
    } catch (error) {
      const timedOut = isTimeoutError(error);
      if (IS_BUILD && timedOut) buildApiDown = true;
      const retryable =
        (error as { retry?: boolean }).retry !== false &&
        !(IS_BUILD && timedOut);
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
    const degrade = IS_BUILD || process.env.NODE_ENV === "development";
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
  const responses = await mapLimit(unique, CONCURRENCY, async (t) => {
    const res = await getJson<PublicZoneListResponse>("/publicZone/within", {
      ...t,
    });
    // 상한에 닿은 타일은 행이 잘렸을 수 있어 구별 개수가 적게 나온다. scripts/build-seoul-districts.ts로 타일을 다시 나눌 것
    if (res.data.length >= WITHIN_ROW_CAP) {
      console.warn(
        `[zones] 타일 ${tileKey(t)} 응답이 ${res.data.length}행으로 상한(${WITHIN_ROW_CAP})에 닿았습니다. 행이 잘렸을 수 있으니 타일을 다시 생성하세요`,
      );
    }
    return res;
  });
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

/**
 * 구 하나의 공공데이터 금연구역. 조회 실패 시 빌드·개발 중에는 null.
 * generateMetadata와 페이지가 한 번만 부르도록 cache로 감싼다 (signal을 넘기면 Next의 fetch 중복 제거가 꺼진다)
 */
export const getDistrictZones = cache(async (slug: string) => {
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
});

export interface SeoulSummary {
  districts: { slug: string; total: number; counts: ZoneTypeCounts }[];
  total: number;
  noAddressCount: number;
  latestReferenceDate: string | null;
  updateAt: string | null;
}

/** 서울 25개 구별 개수. 구 상세 페이지와 같은 타일 URL을 불러 데이터 캐시를 함께 쓴다 */
export const getSeoulSummary = cache(async () =>
  loadOrNull<SeoulSummary>("seoul summary", async () => {
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
  }),
);

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
export const getAnyangZones = cache(async () =>
  loadOrNull<AnyangZones>("anyang", async () => {
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
  }),
);

/**
 * 백엔드 updateAt은 오프셋 없는 서버 시각(UTC, 예 "2026-11-04T07:10:18.0099")이고 응답을 만든 시각이다.
 * UTC로 읽어 Date로 바꾼다. 형식이 다르면 null
 */
export function parseServerTime(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(`${value.slice(0, 23)}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}
