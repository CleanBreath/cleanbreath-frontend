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
