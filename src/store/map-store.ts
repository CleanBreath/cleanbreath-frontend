/**
 * 지도 관련 글로벌 상태 스토어
 *
 * 글로벌 상태로 추출한 이유:
 * - showNonSmoking / showSmoking / showApartments: AreaToggle(변경)과 KakaoMap(소비)이 동시에 사용
 * - selectedAddress / selectedApartment: Sidebar(클릭 발생)와 page.tsx(카드 표시)가 공유
 * - center: Sidebar 목록 클릭과 KakaoMap 렌더링이 공유
 *
 * 글로벌 상태에서 제외한 것:
 * - isCollapsed: page.tsx + Sidebar만 사용하는 로컬 UI 상태
 * - isFeedbackOpen / isVersionOpen: 각 모달이 자체 관리 가능한 로컬 상태
 * - mapKey: KakaoMap 내부 구현 세부사항
 */

import { create } from 'zustand';
import type { AddressItem, ApartmentItem } from '@/types';

const DEFAULT_CENTER = { lat: 37.394329, lng: 126.956939 };

interface MapState {
  // 지도 중심 좌표
  center: { lat: number; lng: number };
  // 구역 표시 토글
  showNonSmoking: boolean;
  showSmoking: boolean;
  showApartments: boolean;
  // 선택된 항목
  selectedAddress: AddressItem | null;
  selectedApartment: ApartmentItem | null;
}

interface MapActions {
  setCenter: (center: { lat: number; lng: number }) => void;
  toggleNonSmoking: () => void;
  toggleSmoking: () => void;
  toggleApartments: () => void;
  selectAddress: (address: AddressItem) => void;
  selectApartment: (apartment: ApartmentItem) => void;
  clearSelection: () => void;
}

export const useMapStore = create<MapState & MapActions>((set) => ({
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

  toggleSmoking: () =>
    set((state) => ({ showSmoking: !state.showSmoking })),

  toggleApartments: () =>
    set((state) => ({ showApartments: !state.showApartments })),

  // 주소 선택 시 아파트 선택 해제 (상호 배타적)
  selectAddress: (address) =>
    set({
      selectedAddress: address,
      selectedApartment: null,
      center: { lat: address.latitude, lng: address.longitude },
    }),

  // 아파트 선택 시 주소 선택 해제 (상호 배타적)
  selectApartment: (apartment) =>
    set({
      selectedApartment: apartment,
      selectedAddress: null,
      center:
        apartment.path.length > 0
          ? { lat: apartment.path[0].latitude, lng: apartment.path[0].longitude }
          : DEFAULT_CENTER,
    }),

  clearSelection: () =>
    set({ selectedAddress: null, selectedApartment: null }),
}));
