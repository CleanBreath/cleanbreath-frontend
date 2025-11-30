/**
 * Apartment API 관련 타입 정의
 */

export type DesignationStatus = "DESIGNATED" | "NOT_DESIGNATED";

export interface ApartmentPath {
  hallway: DesignationStatus;
  stairs: DesignationStatus;
  elevator: DesignationStatus;
  undergroundParkingLot: DesignationStatus;
  latitude: number;
  longitude: number;
  pathsLat: string;
  pathsLng: string;
}

export interface ApartmentItem {
  id: number;
  region: string;
  designationNumber: string;
  apartmentName: string;
  address: string;
  numberOfBuilding: number;
  numberOfHouseholds: number;
  designationDate: string;
  path: ApartmentPath[];
}

export type ApartmentListResponse = ApartmentItem[];
