/**
 * 흡연구역 게시판 관련 타입 정의
 */

/** 게시판 목록 아이템의 path */
export interface SmokingAreaPath {
  divisionArea: string;
  pathLat: string;
  pathLng: string;
}

/** 게시판 목록 아이템 */
export interface SmokingAreaItem {
  id: number;
  addressName: string;
  buildingName: string;
  latitude: number;
  longitude: number;
  category: string;
  paths: SmokingAreaPath[];
}

/** 게시판 목록 페이지 응답 */
export interface SmokingAreaPageResponse {
  content: SmokingAreaItem[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

/** 상세 조회 응답 (투표 수 포함) */
export interface SmokingAreaDetail extends SmokingAreaItem {
  truthCount: number;
  untruthCount: number;
}

/** 투표 요청 */
export interface SmokingAreaVoteRequest {
  clientToken: string;
  isTruth: boolean;
}
