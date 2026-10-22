"use client";

import { ClipboardList, Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DisclaimerModal } from "@/components/disclaimer/disclaimer-modal";
import { FeedbackModal } from "@/components/feedback/feedback-modal";
import { AreaToggle } from "@/components/map/area-toggle";
import { NaverMap } from "@/components/map/naver-map";
import { SelectedAddressCard } from "@/components/map/selected-address-card";
import { SelectedApartmentCard } from "@/components/map/selected-apartment-card";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { VersionModal } from "@/components/version/version-modal";
import { useAddressList } from "@/hooks/use-address";
import { useApartmentList } from "@/hooks/use-apartment";

const SITE_URL = "https://cleanbreath.cmu02-studio.com/";

// 홈 전용 구조화 데이터
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "CleanBreath",
      url: SITE_URL,
      logo: `${SITE_URL}logo.svg`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "CleanBreath",
      url: SITE_URL,
      inLanguage: "ko-KR",
      description:
        "금연구역과 흡연구역을 지도에서 쉽게 확인하세요. 공동주택, 아파트, 공공장소의 금연구역 정보를 제공하는 무료 지도 서비스입니다. 국민건강증진법 기반 금연구역 안내.",
      publisher: { "@id": `${SITE_URL}#organization` },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}#app`,
      name: "CleanBreath",
      url: SITE_URL,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      inLanguage: "ko-KR",
      offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
      isPartOf: { "@id": `${SITE_URL}#website` },
    },
  ],
};

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
  // biome-ignore lint/correctness/useExhaustiveDependencies: isCollapsed 변경을 트리거로 쓰는 의도적인 의존성
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapKey((prev) => prev + 1);
    }, 350);
    return () => clearTimeout(timer);
  }, [isCollapsed]);

  return (
    <div className="flex h-dvh w-screen overflow-hidden">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 정적 jsonLd 객체를 JSON.stringify한 값이라 사용자 입력 없음
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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

        <NaverMap key={mapKey} addresses={addresses} apartments={apartments} />

        <SelectedAddressCard />
        <SelectedApartmentCard />
      </main>

      {/* 게시판 버튼 - 아이콘 오른쪽에 텍스트 표시 */}
      <Button
        variant="outline"
        asChild
        className="fixed bottom-4 right-18 z-30 h-12 rounded-full bg-background/90 px-4 shadow-lg backdrop-blur-sm gap-2"
      >
        <Link href="/board">
          <ClipboardList size={20} />
          <span className="text-sm font-medium">등록된 흡연/금연구역 보기</span>
        </Link>
      </Button>

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
