"use client";

import { useState, useCallback, useEffect } from "react";
import * as motion from "motion/react-client";
import { X, Cigarette, CigaretteOff, MapPin } from "lucide-react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { KakaoMap } from "@/components/map/kakao-map";
import { AreaToggle } from "@/components/map/area-toggle";
import { FeedbackModal } from "@/components/feedback/feedback-modal";
import { useAddressList } from "@/hooks/use-address";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AddressItem } from "@/types";

const DEFAULT_CENTER = { lat: 37.394329, lng: 126.956939 };

export default function Home() {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [showNonSmoking, setShowNonSmoking] = useState(true);
  const [showSmoking, setShowSmoking] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressItem | null>(
    null
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const { data: addressData, isLoading } = useAddressList();
  const addresses = addressData?.data ?? [];

  // 사이드바 접힘 상태 변경 시 지도 리사이즈
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapKey((prev) => prev + 1);
    }, 350);
    return () => clearTimeout(timer);
  }, [isCollapsed]);

  const handleAddressClick = useCallback((address: AddressItem) => {
    setCenter({ lat: address.latitude, lng: address.longitude });
    setSelectedAddress(address);
  }, []);

  const handleNonSmokingToggle = useCallback(() => {
    setShowNonSmoking((prev) => !prev);
  }, []);

  const handleSmokingToggle = useCallback(() => {
    setShowSmoking((prev) => !prev);
  }, []);

  return (
    <div className="flex h-dvh w-screen overflow-hidden">
      <Sidebar
        addresses={addresses}
        isLoading={isLoading}
        onItemClick={handleAddressClick}
        isCollapsed={isCollapsed}
        onCollapsedChange={setIsCollapsed}
        onFeedbackClick={() => setIsFeedbackOpen(true)}
      />

      <main className="relative flex-1">
        <AreaToggle
          showNonSmoking={showNonSmoking}
          showSmoking={showSmoking}
          onNonSmokingToggle={handleNonSmokingToggle}
          onSmokingToggle={handleSmokingToggle}
        />

        <KakaoMap
          key={mapKey}
          center={center}
          addresses={addresses}
          showNonSmoking={showNonSmoking}
          showSmoking={showSmoking}
          onMarkerClick={handleAddressClick}
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
      </main>

      {/* 피드백 모달 */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
