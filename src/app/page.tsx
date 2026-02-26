"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { KakaoMap } from "@/components/map/kakao-map";
import { AreaToggle } from "@/components/map/area-toggle";
import { SelectedAddressCard } from "@/components/map/selected-address-card";
import { SelectedApartmentCard } from "@/components/map/selected-apartment-card";
import { FeedbackModal } from "@/components/feedback/feedback-modal";
import { VersionModal } from "@/components/version/version-modal";
import { DisclaimerModal } from "@/components/disclaimer/disclaimer-modal";
import { useAddressList } from "@/hooks/use-address";
import { useApartmentList } from "@/hooks/use-apartment";
import { Button } from "@/components/ui/button";

export default function Home() {
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

  return (
    <div className="flex h-dvh w-screen overflow-hidden">
      <Sidebar
        addresses={addresses}
        apartments={apartments}
        isLoading={isLoading || isApartmentLoading}
        isCollapsed={isCollapsed}
        onCollapsedChange={setIsCollapsed}
        onFeedbackClick={() => setIsFeedbackOpen(true)}
      />

      <main className="relative flex-1">
        <AreaToggle />

        <KakaoMap key={mapKey} addresses={addresses} apartments={apartments} />

        <SelectedAddressCard />
        <SelectedApartmentCard />
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
