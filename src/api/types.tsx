export interface AddressData {
    address_idx: string;
    address_name: string;
    address_buildingName: string;
    address_latitude: number;
    address_longitude: number;
    address_category: string;
    smoking: string;
    paths: Array<{
      divisionArea: "NON_SMOKING_ZONE" | "SMOKING_ZONE_OPEN_IMPLICIT" | "SMOKING_ZONE_OPEN" | "SMOKING_ZONE_CLOSE_IMPLICIT" | "SMOKING_ZONE_CLOSE" | "SMOKING_ZONE_LINE_IMPLICIT" | "SMOKING_ZONE_LINE";
      pathsLatitude: string[];
      pathsLongitude: string[];
    }>;
  }

export interface ApartmentData {
    id: number;
    region: string;
    designationNumber: string;
    apartmentName: string;
    address: string;
    numberOfBuilding: number;
    numberOfHouseholds: number;
    designationDate: string;
    path: Array<{
      hallway: boolean;
      stairs: boolean;
      elevator: boolean;
      underground_parking_lot: boolean;
      latitude: number;
      longitude: number;
      pathsLat: string[];
      pathsLng: string[];
    }>;
}