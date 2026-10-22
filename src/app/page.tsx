"use client";

import { ClipboardList } from "lucide-react";
import { MotionConfig } from "motion/react";
import Link from "next/link";
import { useState } from "react";
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

  return (
    <MotionConfig reducedMotion="user">
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
          onCollapsedChange={(collapsed) => {
            setIsCollapsed(collapsed);
            // 사이드바 접힘은 애니메이션 없이 바로 바뀌므로 지도 컨테이너 크기에 맞춰 즉시 재생성
            setMapKey((prev) => prev + 1);
          }}
          onFeedbackClick={() => setIsFeedbackOpen(true)}
          onVersionClick={() => setIsVersionOpen(true)}
        />

        {/* 모바일은 지도를 시트 peek 위에서 끝내 NAVER 로고·저작권 표기가 가려지지 않게 한다 */}
        <main className="relative flex-1 max-lg:pb-[calc(4.75rem+env(safe-area-inset-bottom))]">
          <AreaToggle />

          <NaverMap
            key={mapKey}
            addresses={addresses}
            apartments={apartments}
          />

          {/* 하단 스택: 안내 카드 → 선택 카드 → 주 CTA. 모바일은 시트 peek(4.75rem) 위에 띄운다 */}
          <div className="pointer-events-none absolute inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom)+1.75rem)] z-20 flex flex-col items-end gap-3 *:pointer-events-auto lg:inset-x-4 lg:bottom-8">
            <div className="w-full empty:hidden sm:w-96">
              <DisclaimerModal />
            </div>
            <SelectedAddressCard />
            <SelectedApartmentCard />
            {/* 주 CTA는 게시판 하나: 원래 지도 위 유일한 텍스트 버튼이었고, 투표 기능의 진입점이라 */}
            <Button asChild size="touch" className="rounded-full shadow-md">
              <Link href="/board">
                <ClipboardList aria-hidden />
                등록된 흡연/금연구역 보기
              </Link>
            </Button>
          </div>
        </main>

        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />
        <VersionModal
          isOpen={isVersionOpen}
          onClose={() => setIsVersionOpen(false)}
        />
      </div>
    </MotionConfig>
  );
}
