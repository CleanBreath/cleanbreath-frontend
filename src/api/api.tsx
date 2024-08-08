import axios from 'axios';
import { AddressData, ApartmentData } from './types';
import { saveData, getData, saveApartmentsData, getApartmentsData } from './indexedDB';
import { saveDate, getDate } from './localStorage';

const ADDRESS_API_URL = "https://server.bluesky-cleanbreath.com/v1/allData";
const ADDRESS_UPDATE_API_URL = "https://server.bluesky-cleanbreath.com/v1/updateDate";
const APARTMENT_API_URL = "https://server.bluesky-cleanbreath.com/v1/apartment";

interface apartmentItem {
  id: number;
  region: string;
  designationNumber: string;
  apartmentName: string;
  address: string;
  numberOfBuilding: number;
  numberOfHouseholds: number;
  designationDate: string;
  path : Array<{
    hallway: string;
    stairs: string;
    elevator: string;
    underground_parking_lot: string;
    latitude: number;
    longitude: number;
    pathsLat: string;
    pathsLng: string;
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
    divisionArea:
      | "NON_SMOKING_ZONE"
      | "SMOKING_ZONE_OPEN_IMPLICIT"
      | "SMOKING_ZONE_OPEN"
      | "SMOKING_ZONE_CLOSE_IMPLICIT"
      | "SMOKING_ZONE_CLOSE"
      | "SMOKING_ZONE_LINE_IMPLICIT"
      | "SMOKING_ZONE_LINE";
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
    const localDate = getDate();
    const addressData = await getData();

    if (!localDate || addressData.length === 0) {
      return fetchDataFromApi();
    }

    const sliceLocalDate = localDate.slice(0, 26);

    const updateResponse = await axios.post(
      ADDRESS_UPDATE_API_URL,
      { updateDate: sliceLocalDate },
      { headers: { "Content-Type": "application/json" } }
    );

    if (updateResponse.status === 200) {

      const { data, updateDate } = updateResponse.data;

      if (!data || !Array.isArray(data)) {
        return addressData;
      }

      const filterData: AddressData[] = data.map((item: ApiResponseItem) => ({
        address_idx: item.id.toString(),
        address_name: item.addressName,
        address_buildingName: item.buildingName,
        address_latitude: item.latitude,
        address_longitude: item.longitude,
        address_category: item.category,
        smoking: item.path?.some((path) =>
          path.divisionArea.startsWith("SMOKING_ZONE")
        )
          ? "흡연구역"
          : "금연구역",
        paths: item.path?.map((path) => ({
          divisionArea: path.divisionArea,
          pathsLatitude: path.pathsLatitude.split(",").map((coord) => coord.trim()),
          pathsLongitude: path.pathsLongitude.split(",").map((coord) => coord.trim()),
        })),
      }));

      await saveData(filterData);
      saveDate(updateDate);

      return filterData;
    } else {
      return addressData;
    }
  } catch (error) {
    console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);

    if (axios.isAxiosError(error)) {
      console.error('Axios 오류 세부 사항:', error.response?.data || error.message);
    } else {
      console.error('예상치 못한 오류:', error);
    }

    return await getData();
  }
}

async function fetchDataFromApi(): Promise<AddressData[]> {
  try {
    const response = await axios.get<ApiResponse>(ADDRESS_API_URL);

    if (response.status === 200) {
      const { data, updateDate } = response.data;

      const filterData: AddressData[] = data.map((item: ApiResponseItem) => ({
        address_idx: item.id.toString(),
        address_name: item.addressName,
        address_buildingName: item.buildingName,
        address_latitude: item.latitude,
        address_longitude: item.longitude,
        address_category: item.category,
        smoking: item.path?.some((path) =>
          path.divisionArea.startsWith("SMOKING_ZONE")
        )
          ? "흡연구역"
          : "금연구역",
        paths: item.path?.map((path) => ({
          divisionArea: path.divisionArea,
          pathsLatitude: path.pathsLatitude.split(",").map((coord) => coord.trim()),
          pathsLongitude: path.pathsLongitude.split(",").map((coord) => coord.trim()),
        })),
      }));

      await saveData(filterData);
      saveDate(updateDate);

      return filterData;
    } else {
      return await getData();
    }
  } catch (error) {
    console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);

    if (axios.isAxiosError(error)) {
      console.error('Axios 오류 세부 사항:', error.response?.data || error.message);
    } else {
      console.error('예상치 못한 오류:', error);
    }

    return await getData();
  }
}

export async function ApartmentsData(): Promise<ApartmentData[]> {
  try {
    const localData = await getApartmentsData();

    if(localData.length > 0) {
      return localData;
    }

    const response = await axios.get<apartmentItem[]>(APARTMENT_API_URL);

    if (response.status === 200) {
      const data = response.data;

      const filterData: ApartmentData[] = data.map((item) => ({
        id: item.id,
        region: item.region,
        designationNumber: item.designationNumber,
        apartmentName: item.apartmentName,
        address: item.address,
        numberOfBuilding: item.numberOfBuilding,
        numberOfHouseholds: item.numberOfHouseholds,
        designationDate: item.designationDate,
        path: item.path.map((path) => ({
          hallway: path.hallway ==='yes' ? true : false,
          stairs: path.stairs === 'yes' ? true : false,
          elevator: path.elevator === 'yes' ? true : false,
          underground_parking_lot: path.underground_parking_lot === 'yes' ? true : false,
          latitude: path.latitude,
          longitude: path.longitude,
          pathsLat: path.pathsLat.split(",").map((coord) => coord.trim()),
          pathsLng: path.pathsLng.split(",").map((coord) => coord.trim()),
        })),
      }));

      await saveApartmentsData(filterData);

      return filterData;
    } else {
      console.error('서버에서 예상치 못한 응답을 받았습니다:', response.status);
      return await getApartmentsData();
    }
  } catch (error) {
    console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);

    if (axios.isAxiosError(error)) {
      console.error('Axios 오류 세부 사항:', error.response?.data || error.message);
    } else {
      console.error('예상치 못한 오류:', error);
    }

    return await getApartmentsData();
  }
}