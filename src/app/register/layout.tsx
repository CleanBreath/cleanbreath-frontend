import type { Metadata } from "next";

const TITLE = "흡연·금연구역 등록 신청";
const DESCRIPTION =
  "지도에서 위치를 선택해 새로운 흡연구역 또는 금연구역 등록을 요청할 수 있습니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/register" },
  openGraph: {
    type: "website",
    siteName: "CleanBreath",
    url: "/register",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/OGImage.png",
        width: 1200,
        height: 630,
        alt: "CleanBreath 서비스 소개 이미지",
      },
    ],
  },
  // 입력 폼뿐인 얇은 페이지라 색인 제외, 링크는 따라가도록 유지
  robots: { index: false, follow: true },
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
