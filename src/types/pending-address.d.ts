/**
 * Pending Address API 관련 타입 정의 (신규 구역 제안)
 */

import type { AddressCategory } from "./address";

export interface PendingAddressPath {
  divisionArea: string;
  pathLat: string;
  pathLng: string;
}

export interface PendingAddressItem {
  id: number;
  addressName: string;
  buildingName: string;
  latitude: number;
  longitude: number;
  category: AddressCategory;
  paths: PendingAddressPath[];
}

export type PendingAddressListResponse = PendingAddressItem[];

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PendingAddressPageResponse {
  content: PendingAddressItem[];
  page: PageInfo;
}

export interface SmokingAreaAddRequest {
  updateAt: string;
  addressName: string;
  buildingName: string;
  latitude: number;
  longitude: number;
  category: AddressCategory;
  paths: PendingAddressPath[];
}
