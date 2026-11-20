"use client";

import { ClipboardList } from "lucide-react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { DisclaimerModal } from "@/components/disclaimer/disclaimer-modal";
import { AreaToggle } from "@/components/map/area-toggle";
import { NaverMap } from "@/components/map/naver-map";
import { NaverMapPreloader } from "@/components/map/naver-map-preloader";
import { SelectedAddressCard } from "@/components/map/selected-address-card";
import { SelectedApartmentCard } from "@/components/map/selected-apartment-card";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { useAddressList } from "@/hooks/use-address";
import { useApartmentList } from "@/hooks/use-apartment";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  absoluteUrl,
  IN_LANGUAGE,
  ORGANIZATION_ID,
  organizationJsonLd,
  serializeJsonLd,
} from "@/lib/seo/jsonld";

// 닫힌 상태로 시작하는 시트는 첫 화면에 필요 없어 하이드레이션 번들에서 뺀다 (하이드레이션 뒤 따로 로드)
const FeedbackModal = dynamic(
  () =>
    import("@/components/feedback/feedback-modal").then((m) => m.FeedbackModal),
  { ssr: false },
);
const VersionModal = dynamic(
  () =>
    import("@/components/version/version-modal").then((m) => m.VersionModal),
  { ssr: false },
);

// 홈 전용 구조화 데이터. 한국어는 기존과 같은 SITE_URL/, 영어·일본어는 /en·/ja
const buildJsonLd = (
  locale: Locale,
  description: string,
  organizationDescription: string,
) => {
  const pageUrl = absoluteUrl(locale, "/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(organizationDescription),
      {
        "@type": "WebSite",
        "@id": `${pageUrl}#website`,
        name: "CleanBreath",
        url: pageUrl,
        inLanguage: IN_LANGUAGE[locale],
        description,
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#app`,
        name: "CleanBreath",
        url: pageUrl,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        inLanguage: IN_LANGUAGE[locale],
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        isPartOf: { "@id": `${pageUrl}#website` },
      },
    ],
  };
};

export default function Home() {
  const t = useTranslations("home");
  const tm = useTranslations("meta");
  const locale = useLocale();
  const jsonLd = buildJsonLd(
    locale,
    tm("description"),
    tm("organizationDescription"),
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const {
    data: addressData,
    isFetching: isAddressFetching,
    isError: isAddressError,
    refetch: refetchAddresses,
  } = useAddressList();
  const {
    data: apartmentData,
    isFetching: isApartmentFetching,
    isError: isApartmentError,
    refetch: refetchApartments,
  } = useApartmentList();
  const addresses = addressData?.data ?? [];
  const apartments = apartmentData ?? [];

  return (
    // w-screen(100vw)은 viewport-fit=cover 뒤 body의 가로 safe-area 패딩을 넘치므로 w-full
    <div className="flex h-dvh w-full overflow-hidden">
      <NaverMapPreloader />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 메시지 파일 문구로 만든 jsonLd 객체를 JSON.stringify한 값이라 사용자 입력 없음
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <Sidebar
        addresses={addresses}
        apartments={apartments}
        // 목록마다 따로 넘긴다: 한쪽만 실패해도 다른 쪽 목록·빈 목록 문구는 그대로, 재시도도 실패한 쪽만
        addressState={{
          isLoading: isAddressFetching && !addressData,
          isError: isAddressError,
          onRetry: refetchAddresses,
        }}
        apartmentState={{
          isLoading: isApartmentFetching && !apartmentData,
          isError: isApartmentError,
          onRetry: refetchApartments,
        }}
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
      <main className="relative flex-1 max-lg:pb-[calc(5.25rem+env(safe-area-inset-bottom))]">
        <AreaToggle />

        <NaverMap key={mapKey} addresses={addresses} apartments={apartments} />

        {/* 하단 스택: 안내 카드 → 선택 카드 → 주 CTA. 모바일은 시트 peek(5.25rem) 위에 띄운다.
            상자 높이를 고정(필터 칩 아래 top-15~bottom)하고 ::before의 mt-auto로 아래에 붙여, 안내 카드가 늦게 나타나도 기존 버튼이 밀리지 않게 한다(CLS).
            낮은 화면·확대에서 넘치면 auto 여백이 0이 되어 위부터 보이고 스크롤로 나머지에 닿는다 (px-1·pt-1은 포커스 링, pb-3은 shadow-md 잘림 방지).
            가시 가장자리는 inset-x-2+px-1=12px(lg 16px), CTA 아래 여백은 1rem+pb-3=1.75rem(lg 2rem)으로 기존과 같다.
            ::before를 first:mt-auto로 바꾸지 말 것 (첫 자식은 empty:hidden 안내 카드 래퍼).
            ::before도 flex 항목이라 gap-3이 붙으므로 -mb-3으로 상쇄한다 (넘칠 때 첫 카드 위 12px 빈칸 방지) */}
        <div className="pointer-events-none absolute inset-x-2 top-15 bottom-[calc(5.25rem+env(safe-area-inset-bottom)+1rem)] z-20 flex flex-col items-end gap-3 overflow-y-auto overscroll-contain px-1 pt-1 pb-3 before:mt-auto before:-mb-3 *:pointer-events-auto lg:inset-x-3 lg:bottom-5">
          <div className="w-full empty:hidden sm:w-96">
            <DisclaimerModal />
          </div>
          <SelectedAddressCard />
          <SelectedApartmentCard />
          {/* 주 CTA는 게시판 하나: 원래 지도 위 유일한 텍스트 버튼이었고, 투표 기능의 진입점이라 */}
          <Button asChild size="touch" className="rounded-full shadow-md">
            <Link href="/board">
              <ClipboardList aria-hidden />
              {t("boardCta")}
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
  );
}
