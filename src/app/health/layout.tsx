import type { Metadata } from "next";

const TITLE = "서버 상태";
const DESCRIPTION = "CleanBreath 서비스의 서버 상태를 확인합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/health" },
  openGraph: {
    type: "website",
    siteName: "CleanBreath",
    url: "/health",
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
  robots: { index: false, follow: false },
};

export default function HealthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
