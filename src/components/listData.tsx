import axios from 'axios';

const API_URL = "https://server.bluesky-cleanbreath.com/v1/allData";
const POST_API_URL = "https://server.bluesky-cleanbreath.com/v1/updateDate";

export interface AddressData {
  count: number;
  address_idx: string;
  address_name: string;
  adress_detail: string;
  address_division: string;
  address_latitude: number;
  address_longitude: number;
  smoking: "금연" | "흡연";
  paths: Array<{
    divisionArea: "NON_SMOKING_ZONE" | "SMOKING_ZONE_OPEN_IMPLICIT" | "SMOKING_ZONE_OPEN" | "SMOKING_ZONE_CLOSE_IMPLICIT" | "SMOKING_ZONE_CLOSE" | "SMOKING_ZONE_LINE_IMPLICIT" | "SMOKING_ZONE_LINE";
    pathsLatitude: string[];
    pathsLongitude: string[];
  }>;
}

interface ApiResponseItem {
  id: number;
  addressName: string;
  buildingName: string;
  latitude: number;
  longitude: number;
  category: string;
  path: Array<{
    divisionArea: "NON_SMOKING_ZONE" | "SMOKING_ZONE_OPEN_IMPLICIT" | "SMOKING_ZONE_OPEN" | "SMOKING_ZONE_CLOSE_IMPLICIT" | "SMOKING_ZONE_CLOSE" | "SMOKING_ZONE_LINE_IMPLICIT" | "SMOKING_ZONE_LINE";
    pathsLatitude: string;
    pathsLongitude: string;
  }>;
}

interface ApiResponse {
  data: ApiResponseItem[];
  count: number;
  updateDate: string;
}

export async function listData(): Promise<AddressData[]> {
  try {
    const response = await axios.get<ApiResponse>(API_URL);
    console.log(response.data.data);

    const filteredData: AddressData[] = response.data.data.map(item => {
      return {
        count: response.data.count,
        address_idx: item.id.toString(),
        address_name: item.buildingName,
        adress_detail: item.addressName,
        address_latitude: item.latitude,
        address_longitude: item.longitude,
        address_division: item.category,
        smoking: item.path.some(path => path.divisionArea.startsWith("SMOKING_ZONE")) ? "흡연" : "금연",
        paths: item.path.map(path => ({
          divisionArea: path.divisionArea,
          pathsLatitude: path.pathsLatitude.split(',').map(coord => coord.trim()),
          pathsLongitude: path.pathsLongitude.split(',').map(coord => coord.trim())
        }))
      };
    });

    console.log(response.data.updateDate);

    return filteredData;
  } catch (error) {
    console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);

    if (axios.isAxiosError(error)) {
      console.error("Axios 오류 세부 사항:", error.response?.data || error.message);
    } else {
      console.error("예상치 못한 오류:", error);
    }

    throw error;
  }
}
