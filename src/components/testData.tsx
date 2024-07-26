// testData.tsx
import axios from 'axios';

const API_URL = "http://localhost:8080/api/allData"; // 올바른 URL로 수정

export interface AddressData {
  address_idx: string;
  address_name: string;
  address_division: string;
  address_latitude: number;
  address_longitude: number; 
  smoking: "금연" | "흡연" | "정보 없음";
}

interface ApiResponse {
  id: number;
  addressName: string;
  buildingName: string;
  latitude: number;
  longitude: number;
  category: string;
  path: Array<{
    divisionArea: "NON_SMOKING_ZONE" | "SMOKING_ZONE";
    pathsLatitude: string;
    pathsLongitude: string;
  }>;
}

// 지연 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchTestData(): Promise<AddressData[]> {
  try {
    console.log("3초 대기 후 데이터를 가져옵니다...");
    await delay(3000); // 3초 대기

    console.log("API에서 데이터를 가져오는 중...");
    const response = await axios.get<ApiResponse[]>(API_URL);
    console.log("API 응답 원본:", response.data);


    const filteredData: AddressData[] = response.data
      .filter(item => item.id <= 185) 
      .map(item => ({
        address_idx: item.id.toString(),
        address_name: item.buildingName,
        address_latitude: item.latitude,
        address_longitude: item.longitude,
        address_division: item.category,
        smoking: item.path && item.path.length > 0
          ? (item.path[0].divisionArea === "NON_SMOKING_ZONE" ? "금연" : "흡연")
          : "정보 없음",
      }));

    console.log("형식화된 데이터:", filteredData);
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
