import type { Metadata } from "next";

const TITLE = "등록된 흡연·금연구역 목록";
const DESCRIPTION =
  "CleanBreath에 등록된 흡연구역과 금연구역 목록을 확인하고 각 구역의 상세 정보를 볼 수 있습니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/board" },
  openGraph: {
    type: "website",
    siteName: "CleanBreath",
    url: "/board",
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
};

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
