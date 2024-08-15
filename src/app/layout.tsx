import type { Metadata } from "next";
import "../../styles/global.css";
import Head from "next/head";

export const metadata: Metadata = {
  title: "CleanBreath",
  description:
    "흡연구역과 금연 구역을 명확히 구분하여 사용자에게 시각적 안내를 제공하는 서비스입니다.",
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
  openGraph: {
    title: "CleanBreath",
    description:
      "흡연구역과 금연 구역을 명확히 구분하여 사용자에게 시각적 안내를 제공하는 서비스입니다.",
    url: "https://bluesky-cleanbreath.com/",
    type: "website",
    images: [
      {
        url: "https://bluesky-cleanbreath.com/OGImage.png",
        width: 1200,
        height: 630,
        alt: "CleanBreath 서비스 소개 이미지",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
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
      </Head>
      <body>{children}</body>
    </html>
  );
}
