"use client";

import { useState, useCallback, useEffect } from "react";
import * as motion from "motion/react-client";
import {
  X,
  Cigarette,
  CigaretteOff,
  MapPin,
  Building2,
  Info,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { KakaoMap } from "@/components/map/kakao-map";
import { AreaToggle } from "@/components/map/area-toggle";
import { FeedbackModal } from "@/components/feedback/feedback-modal";
import { VersionModal } from "@/components/version/version-modal";
import { DisclaimerModal } from "@/components/disclaimer/disclaimer-modal";
import { useAddressList } from "@/hooks/use-address";
import { useApartmentList } from "@/hooks/use-apartment";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AddressItem, ApartmentItem } from "@/types";

const DEFAULT_CENTER = { lat: 37.394329, lng: 126.956939 };

export default function Home() {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [showNonSmoking, setShowNonSmoking] = useState(true);
  const [showSmoking, setShowSmoking] = useState(false);
  const [showApartments, setShowApartments] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<AddressItem | null>(
    null
  );
  const [selectedApartment, setSelectedApartment] =
    useState<ApartmentItem | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const { data: addressData, isLoading } = useAddressList();
  const { data: apartmentData, isLoading: isApartmentLoading } =
    useApartmentList();
  const addresses = addressData?.data ?? [];
  const apartments = apartmentData ?? [];

  // 사이드바 접힘 상태 변경 시 지도 리사이즈
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapKey((prev) => prev + 1);
    }, 350);
    return () => clearTimeout(timer);
  }, [isCollapsed]);

  const handleAddressClick = useCallback((address: AddressItem) => {
    setCenter({ lat: address.latitude, lng: address.longitude });

    // category가 제대로 설정되지 않은 경우 path의 divisionArea로 판단
    const hasSmokingZone = address.path.some((p) =>
      p.divisionArea.startsWith("SMOKING_ZONE")
    );
    const hasNonSmokingZone = address.path.some(
      (p) => p.divisionArea === "NON_SMOKING_ZONE"
    );

    // category 보정
    const correctedAddress = {
      ...address,
      category:
        hasSmokingZone && !hasNonSmokingZone
          ? ("SMOKING" as const)
          : ("NON_SMOKING" as const),
    };

    setSelectedAddress(correctedAddress);
    setSelectedApartment(null);
  }, []);

  const handleNonSmokingToggle = useCallback(() => {
    setShowNonSmoking((prev) => !prev);
  }, []);

  const handleSmokingToggle = useCallback(() => {
    setShowSmoking((prev) => !prev);
  }, []);

  const handleApartmentToggle = useCallback(() => {
    setShowApartments((prev) => !prev);
  }, []);

  const handleApartmentClick = useCallback((apartment: ApartmentItem) => {
    if (apartment.path.length > 0) {
      setCenter({
        lat: apartment.path[0].latitude,
        lng: apartment.path[0].longitude,
      });
    }
    setSelectedApartment(apartment);
    setSelectedAddress(null);
  }, []);

  return (
    <div className="flex h-dvh w-screen overflow-hidden">
      <Sidebar
        addresses={addresses}
        apartments={apartments}
        isLoading={isLoading || isApartmentLoading}
        onItemClick={handleAddressClick}
        onApartmentClick={handleApartmentClick}
        isCollapsed={isCollapsed}
        onCollapsedChange={setIsCollapsed}
        onFeedbackClick={() => setIsFeedbackOpen(true)}
      />

      <main className="relative flex-1">
        <AreaToggle
          showNonSmoking={showNonSmoking}
          showSmoking={showSmoking}
          showApartments={showApartments}
          onNonSmokingToggle={handleNonSmokingToggle}
          onSmokingToggle={handleSmokingToggle}
          onApartmentToggle={handleApartmentToggle}
        />

        <KakaoMap
          key={mapKey}
          center={center}
          addresses={addresses}
          apartments={apartments}
          showNonSmoking={showNonSmoking}
          showSmoking={showSmoking}
          showApartments={showApartments}
          onMarkerClick={handleAddressClick}
          onApartmentClick={handleApartmentClick}
        />

        {/* 선택된 구역 정보 카드 */}
        {selectedAddress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2"
          >
            <Card className="border-0 bg-background/95 shadow-2xl backdrop-blur-md">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                      selectedAddress.category === "SMOKING"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {selectedAddress.category === "SMOKING" ? (
                      <Cigarette size={22} className="text-white" />
                    ) : (
                      <CigaretteOff size={22} className="text-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight">
                        {selectedAddress.addressName}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 rounded-full"
                        onClick={() => setSelectedAddress(null)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin size={12} />
                      <span className="truncate">
                        {selectedAddress.buildingName}
                      </span>
                    </div>
                    <Badge
                      className={`mt-2 ${
                        selectedAddress.category === "SMOKING"
                          ? "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300"
                          : "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300"
                      }`}
                    >
                      {selectedAddress.category === "SMOKING"
                        ? "흡연구역"
                        : "금연구역"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 선택된 아파트 정보 카드 */}
        {selectedApartment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
          >
            <Card className="border-0 bg-background/95 shadow-2xl backdrop-blur-md">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 shadow-sm">
                    <Building2 size={22} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight">
                        {selectedApartment.apartmentName}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 rounded-full"
                        onClick={() => setSelectedApartment(null)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin size={12} />
                      <span className="truncate">
                        {selectedApartment.address}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300">
                        {selectedApartment.numberOfBuilding}개 동
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300">
                        {selectedApartment.numberOfHouseholds}세대
                      </Badge>
                    </div>

                    {/* 금연구역 지정 범위 */}
                    {selectedApartment.path.length > 0 && (
                      <div className="mt-3 space-y-1.5 rounded-lg bg-muted/50 p-2.5">
                        <p className="text-xs font-semibold text-muted-foreground">
                          금연구역 지정 범위
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div
                            className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                              selectedApartment.path[0].hallway === "YES"
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <span>복도</span>
                            <Badge
                              variant="secondary"
                              className={`h-4 px-1.5 text-[10px] ${
                                selectedApartment.path[0].hallway === "YES"
                                  ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-background"
                              }`}
                            >
                              {selectedApartment.path[0].hallway === "YES"
                                ? "지정"
                                : "미지정"}
                            </Badge>
                          </div>
                          <div
                            className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                              selectedApartment.path[0].stairs === "YES"
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <span>계단</span>
                            <Badge
                              variant="secondary"
                              className={`h-4 px-1.5 text-[10px] ${
                                selectedApartment.path[0].stairs === "YES"
                                  ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-background"
                              }`}
                            >
                              {selectedApartment.path[0].stairs === "YES"
                                ? "지정"
                                : "미지정"}
                            </Badge>
                          </div>
                          <div
                            className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                              selectedApartment.path[0].elevator === "YES"
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <span>엘리베이터</span>
                            <Badge
                              variant="secondary"
                              className={`h-4 px-1.5 text-[10px] ${
                                selectedApartment.path[0].elevator === "YES"
                                  ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-background"
                              }`}
                            >
                              {selectedApartment.path[0].elevator === "YES"
                                ? "지정"
                                : "미지정"}
                            </Badge>
                          </div>
                          <div
                            className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                              selectedApartment.path[0]
                                .undergroundParkingLot === "YES"
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <span>지하주차장</span>
                            <Badge
                              variant="secondary"
                              className={`h-4 px-1.5 text-[10px] ${
                                selectedApartment.path[0]
                                  .undergroundParkingLot === "YES"
                                  ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-background"
                              }`}
                            >
                              {selectedApartment.path[0]
                                .undergroundParkingLot === "YES"
                                ? "지정"
                                : "미지정"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      {/* 버전 정보 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsVersionOpen(true)}
        className="fixed bottom-4 right-4 z-30 h-12 w-12 rounded-full bg-background/90 shadow-lg backdrop-blur-sm"
      >
        <Info size={20} />
      </Button>

      {/* 피드백 모달 */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* 버전 정보 모달 */}
      <VersionModal
        isOpen={isVersionOpen}
        onClose={() => setIsVersionOpen(false)}
      />

      {/* 책임한계 안내 모달 */}
      <DisclaimerModal />
    </div>
  );
}
