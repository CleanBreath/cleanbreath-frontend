/**
 * 게시판 구역 표시용 도우미 (서버·클라이언트 공용)
 */

import type { SmokingAreaItem } from "@/types";

/** 게시판 목록 한 페이지 크기 (서버 첫 페이지와 클라이언트 목록이 같은 값을 써야 한다) */
export const BOARD_PAGE_SIZE = 10;

/** URL의 id 문자열을 양의 정수로. 형식이 틀리면 null (→ 404) */
export function parseBoardId(raw: string): number | null {
  if (!/^[1-9]\d{0,15}$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) ? id : null;
}

type ZoneNameFields = Pick<SmokingAreaItem, "addressName" | "buildingName">;

/**
 * 구역 대표 이름. 등록 폼 기준으로 addressName은 주소(필수), buildingName은 건물명(선택)이라
 * 건물명이 있으면 건물명, 없으면 주소를 쓴다
 */
export function getZoneName({ addressName, buildingName }: ZoneNameFields) {
  return buildingName?.trim() || addressName;
}

/** 건물명이 따로 있을 때만 true (제목에 주소를 덧붙일지 판단) */
export function hasBuildingName({ buildingName }: ZoneNameFields) {
  return Boolean(buildingName?.trim());
}

/** 목록에서 쓰던 "주소 건물명" 형태의 전체 라벨 */
export function getZoneLabel({ addressName, buildingName }: ZoneNameFields) {
  return buildingName?.trim() ? `${addressName} ${buildingName}` : addressName;
}
