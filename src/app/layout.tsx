import type { Metadata, Viewport } from "next";
import "../../styles/global.css";
import Head from "next/head";

const APP_NAME = "CleanBreath";
const APP_DEFAULT_TITLE = "안양시 금연·흡연구역 시각화 서비스";
const APP_TITLE_TEMPLATE = "%s - CleanBreath";
const APP_DESCRIPTION = "흡연구역과 금연 구역을 명확히 구분하여 사용자에게 시각적 안내를 제공하는 서비스입니다.";

export const metadata: Metadata = {
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
    "CleanBreath",
    "흡연구역",
    "금연구역",
    "흡연구역 안내",
    "금연구역 안내",
    "지도",
    "안양시",
    "안양시 금연구역",
    "안양시 흡연구역",
  ],
  authors: [
    {
      name: "대림 대학교 BlueSky 팀",
      url: "https://github.com/CleanBreath/cleanbreath-frontend",
    },
  ],
  manifest: "/manifest.json",
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
    url: "https://bluesky-cleanbreath.com/",
    images: [
      {
        url: "https://bluesky-cleanbreath.com/OGImage.png",
        width: 1200,
        height: 630,
        alt: "CleanBreath 서비스 소개 이미지",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  }
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
    <html lang="ko">
      <Head>
        <link rel="canonical" href="https://bluesky-cleanbreath.com/" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        {children}
        
      </body>

    </html>
  );
}
