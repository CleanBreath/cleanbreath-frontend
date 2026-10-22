import type { Metadata } from "next";

const TITLE = "흡연·금연구역 상세 정보";
const DESCRIPTION =
  "CleanBreath에 등록된 흡연구역 또는 금연구역의 위치와 상세 정보를 확인할 수 있습니다.";

// 부모 /board canonical을 물려받지 않도록 상세 경로로 덮어씀
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const path = `/board/${encodeURIComponent(id)}`;

  return {
    // 부모 board/layout이 템플릿 없는 문자열 title이라 루트 템플릿이 적용되지 않음
    title: { absolute: `${TITLE} | CleanBreath` },
    description: DESCRIPTION,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "CleanBreath",
      url: path,
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
}

export default function BoardDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
