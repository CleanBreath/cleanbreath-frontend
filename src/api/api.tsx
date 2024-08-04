import axios from 'axios';
import { AddressData } from './types';
import { saveData, getData } from './indexedDB';
import { saveCount, getCount } from './localStorage';

const API_URL = "https://server.bluesky-cleanbreath.com/v1/allData";

export interface ApiResponseItem {
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
    const [localCount, localData] = await Promise.all([getCount(), getData()]);
    const response = await axios.get<ApiResponse>(API_URL);
    const apiCount = response.data.count;

    if (localData.length === 0 || localCount === null || localCount < apiCount) {
      const filteredData: AddressData[] = response.data.data.map(item => ({
        address_idx: item.id.toString(),
        address_name: item.addressName,
        address_buildingName: item.buildingName,
        address_latitude: item.latitude,
        address_longitude: item.longitude,
        address_category: item.category,
        smoking: item.path.some(path => path.divisionArea.startsWith("SMOKING_ZONE")) ? "흡연구역" : "금연구역",
        paths: item.path.map(path => ({
          divisionArea: path.divisionArea,
          pathsLatitude: path.pathsLatitude.split(',').map(coord => coord.trim()),
          pathsLongitude: path.pathsLongitude.split(',').map(coord => coord.trim())
        }))
      }));

      await saveData(filteredData);
      saveCount(apiCount);

      return filteredData;
    } else {
      return localData;
    }
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
