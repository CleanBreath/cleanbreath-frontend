import type { Metadata } from "next";

const TITLE = "금연구역 지정 시설 및 관련 법령 안내";
const DESCRIPTION =
  "국민건강증진법에 따른 금연구역 지정 시설과 관련 법령, 금연구역 흡연 시 과태료, 공동주택(아파트) 금연구역 정보를 안내합니다.";
const PAGE_URL = "https://cleanbreath.cmu02-studio.com/statute";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/statute" },
  openGraph: {
    type: "website",
    siteName: "CleanBreath",
    url: "/statute",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "ko-KR",
      isPartOf: { "@id": "https://cleanbreath.cmu02-studio.com/#website" },
      breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "홈",
          item: "https://cleanbreath.cmu02-studio.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "금연구역 관련 법령",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function StatuteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 정적 jsonLd 객체를 JSON.stringify한 값이라 사용자 입력 없음
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
