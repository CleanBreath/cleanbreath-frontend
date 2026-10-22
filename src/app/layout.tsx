import type { Metadata, Viewport } from "next";
import "../../styles/global.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { SchedulerProvider } from "@/components/providers/scheduler-provider";

const APP_NAME = "CleanBreath";
const APP_DEFAULT_TITLE = "CleanBreath - 금연구역 및 흡연구역 지도 서비스";
const APP_TITLE_TEMPLATE = "%s | CleanBreath";
const APP_DESCRIPTION =
  "금연구역과 흡연구역을 지도에서 쉽게 확인하세요. 공동주택, 아파트, 공공장소의 금연구역 정보를 제공하는 무료 지도 서비스입니다. 국민건강증진법 기반 금연구역 안내.";

export const metadata: Metadata = {
  metadataBase: new URL("https://cleanbreath.cmu02-studio.com"),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: "/cleanBreathFavicon.ico",
  },
  keywords: [
    "금연구역",
    "흡연구역",
    "금연구역 지도",
    "흡연구역 지도",
    "금연구역 안내",
    "흡연구역 안내",
    "공동주택 금연구역",
    "아파트 금연구역",
    "국민건강증진법",
    "금연구역 찾기",
    "흡연 가능 장소",
    "CleanBreath",
  ],
  authors: [
    {
      name: "대림 대학교 BlueSky 팀",
      url: "https://github.com/CleanBreath/cleanbreath-frontend",
    },
  ],
  manifest: "/manifest.json",
  // 홈(클라이언트 페이지) 기준값. 하위 세그먼트는 alternates.canonical·openGraph.url을 각자 덮어써야 함
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: "/",
    images: [
      {
        url: "https://cleanbreath.cmu02-studio.com/OGImage.png",
        width: 1200,
        height: 630,
        alt: "CleanBreath 서비스 소개 이미지",
      },
    ],
  },
  // title/description을 비워두면 Next가 경로별 openGraph 값으로 채운다
  twitter: {
    card: "summary",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  verification: {
    other: {
      "naver-site-verification": "6966c0f44b19d32900c068b84aac20a3a0591742",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <SchedulerProvider>{children}</SchedulerProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
