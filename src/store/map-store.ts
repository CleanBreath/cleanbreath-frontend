/**
 * 지도 관련 전역 상태 관리 (Zustand)
 *
 * 전역 상태로 이동한 이유:
 * - showNonSmoking/showSmoking/showApartments: AreaToggle과 KakaoMap이 동시에 사용
 * - selectedAddress/selectedApartment: Sidebar 클릭과 page.tsx 카드 표시가 공유
 * - center: Sidebar 목록 클릭과 KakaoMap 렌더링이 공유
 *
 * 렌더링 영향:
 * - prop drilling 제거로 중간 컴포넌트 불필요한 리렌더링 방지
 * - 각 컴포넌트가 필요한 상태만 구독하여 최적화
 */

import { create } from "zustand";
import type { AddressItem, ApartmentItem } from "@/types";

interface MapState {
  // 지도 중심 좌표
  center: { lat: number; lng: number };
  setCenter: (center: { lat: number; lng: number }) => void;

  // 토글 상태
  showNonSmoking: boolean;
  showSmoking: boolean;
  showApartments: boolean;
  toggleNonSmoking: () => void;
  toggleSmoking: () => void;
  toggleApartments: () => void;

  // 선택된 항목
  selectedAddress: AddressItem | null;
  selectedApartment: ApartmentItem | null;
  setSelectedAddress: (address: AddressItem | null) => void;
  setSelectedApartment: (apartment: ApartmentItem | null) => void;

  // 편의 메서드: 주소 클릭 시 중심 이동 + 선택
  selectAddress: (address: AddressItem) => void;
  // 편의 메서드: 아파트 클릭 시 중심 이동 + 선택
  selectApartment: (apartment: ApartmentItem) => void;
}

const DEFAULT_CENTER = { lat: 37.394329, lng: 126.956939 };

export const useMapStore = create<MapState>((set) => ({
  // 초기 상태
  center: DEFAULT_CENTER,
  showNonSmoking: true,
  showSmoking: false,
  showApartments: true,
  selectedAddress: null,
  selectedApartment: null,

  // 액션
  setCenter: (center) => set({ center }),

  toggleNonSmoking: () =>
    set((state) => ({ showNonSmoking: !state.showNonSmoking })),

  toggleSmoking: () => set((state) => ({ showSmoking: !state.showSmoking })),

  toggleApartments: () =>
    set((state) => ({ showApartments: !state.showApartments })),

  setSelectedAddress: (address) =>
    set({ selectedAddress: address, selectedApartment: null }),

  setSelectedApartment: (apartment) =>
    set({ selectedApartment: apartment, selectedAddress: null }),

  // 편의 메서드
  selectAddress: (address) =>
    set({
      center: { lat: address.latitude, lng: address.longitude },
      selectedAddress: address,
      selectedApartment: null,
    }),

  selectApartment: (apartment) => {
    const center =
      apartment.path.length > 0
        ? {
            lat: apartment.path[0].latitude,
            lng: apartment.path[0].longitude,
          }
        : DEFAULT_CENTER;

    set({
      center,
      selectedApartment: apartment,
      selectedAddress: null,
    });
  },
}));
