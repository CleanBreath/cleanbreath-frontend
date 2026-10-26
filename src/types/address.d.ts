/**
 * Address API 관련 타입 정의
 */

export interface AddressPath {
  divisionArea: string;
  pathsLatitude: string;
  pathsLongitude: string;
}

export type AddressCategory = "NON_SMOKING" | "SMOKING";

export interface AddressItem {
  id: number;
  addressName: string;
  buildingName: string;
  latitude: number;
  longitude: number;
  category: AddressCategory;
  path: AddressPath[];
}

export interface AllAddressResponse {
  count: number;
  updateAt: string;
  data: AddressItem[];
}

export interface UpdateDateRequest {
  updateDate: string;
}

export interface UpdateDateResponse {
  count: number;
  updateAt: string;
  data: AddressItem[];
}

export interface UpdateNotNeededResponse {
  message: string;
}

/** 공공데이터 실외 금연구역 유형 (백엔드 public_no_smoking_zone.zone_type) */
export type PublicZoneType = "TRANSIT" | "PARK" | "STREET" | "BOUNDARY";

/** 공공데이터포털 전국금연구역표준데이터의 실외 금연구역 (점 좌표, 다각형 없음) */
export interface PublicZoneItem {
  id: number;
  name: string;
  zoneType: PublicZoneType;
  division: string | null;
  scope: string | null;
  roadAddress: string | null;
  latitude: number;
  longitude: number;
  referenceDate: string | null;
}

export interface PublicZoneListResponse {
  count: number;
  updateAt: string;
  data: PublicZoneItem[];
}

/** 지도 화면 사각형 (남서·북동 모서리) */
export interface MapBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}
