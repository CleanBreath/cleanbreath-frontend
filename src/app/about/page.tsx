import {
  AlertTriangle,
  Database,
  ExternalLink,
  Info,
  MapPin,
  MessageSquare,
  Scale,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SITE_URL = "https://cleanbreath.cmu02-studio.com";
const PAGE_TITLE = "서비스 소개 및 운영 정보";
const PAGE_DESCRIPTION =
  "CleanBreath는 대림대학교 BlueSky 팀이 운영하는 금연구역·흡연구역 지도 서비스입니다. 운영 주체, 구역 데이터 관리 방식, 등록 요청 검토 절차, 잘못된 정보 신고 방법을 안내합니다.";
const LAST_UPDATED = "2026-10-22";
const GITHUB_URL = "https://github.com/CleanBreath/cleanbreath-frontend";
const LAW_URL =
  "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B5%AD%EB%AF%BC%EA%B1%B4%EA%B0%95%EC%A6%9D%EC%A7%84%EB%B2%95";

// 버전 정보 모달(version-modal.tsx)에 기록된 개발 참여자
const DEVELOPERS = ["최현준", "문찬수", "김건우", "유현목", "최시헌", "김장환"];

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    url: "/about",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "website",
    siteName: "CleanBreath",
    images: [
      {
        url: `${SITE_URL}/OGImage.png`,
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
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#webpage`,
      url: `${SITE_URL}/about`,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: "ko-KR",
      dateModified: LAST_UPDATED,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      breadcrumb: { "@id": `${SITE_URL}/about#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/about#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "홈",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "서비스 소개",
          item: `${SITE_URL}/about`,
        },
      ],
    },
  ],
};

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary"
      />
      <span>{children}</span>
    </li>
  );
}

export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 정적 jsonLd 객체를 JSON.stringify한 값이라 사용자 입력 없음
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <PageHeader
        title={PAGE_TITLE}
        description="CleanBreath"
        icon={<Info />}
        backLabel="홈으로 돌아가기"
      />

      {/* 메인 컨텐츠 */}
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base leading-relaxed text-muted-foreground">
        <PageSection
          title="CleanBreath는 어떤 서비스인가요?"
          icon={<MapPin />}
          className="border-primary/20 bg-primary/5"
        >
          <p className="mb-3">
            CleanBreath는 안양시를 중심으로 <strong>금연구역</strong>과{" "}
            <strong>흡연구역</strong>을 지도에서 확인할 수 있는 무료 지도
            서비스입니다.
          </p>
          <ul className="space-y-1.5">
            <Bullet>
              금연구역은 초록색, 흡연구역은 유형에 따라 주황·빨강·보라색으로
              지도에 표시합니다.
            </Bullet>
            <Bullet>
              공동주택(아파트)의 복도·계단·엘리베이터·지하주차장 금연구역 지정
              여부를 보여줍니다.
            </Bullet>
            <Bullet>구역 목록 조회 및 검색 기능을 제공합니다.</Bullet>
            <Bullet>
              국민건강증진법에 따른 금연구역 관련 법령 정보를 안내합니다.
            </Bullet>
            <Bullet>
              이용자가 새 구역을 등록 요청하고, 피드백을 보낼 수 있습니다.
            </Bullet>
          </ul>
        </PageSection>

        <PageSection title="운영 주체" icon={<Users />}>
          <p className="mb-3">
            CleanBreath는 <strong>대림대학교 BlueSky 팀</strong>이 개발하고
            운영합니다. 2024년 11월 첫 버전(v0.1.0)을 출시했으며, 소스 코드는
            GitHub에 공개되어 있습니다.
          </p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {DEVELOPERS.map((name) => (
              <Badge key={name} variant="secondary">
                {name}
              </Badge>
            ))}
          </div>
          <Button variant="outline" asChild>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              GitHub 저장소
              <ExternalLink aria-hidden />
            </a>
          </Button>
        </PageSection>

        <PageSection title="구역 데이터 관리 방식" icon={<Database />}>
          <ul className="space-y-1.5">
            <Bullet>
              지도에 표시되는 구역 정보는 CleanBreath 서버에서 제공합니다.
            </Bullet>
            <Bullet>
              이용자가{" "}
              <Link href="/register" className="text-primary underline">
                구역 등록 요청
              </Link>
              을 보내면 바로 지도에 반영되지 않고, 검토를 거친 뒤 반영됩니다.
            </Bullet>
            <Bullet>
              제안된 구역은{" "}
              <Link href="/board" className="text-primary underline">
                게시판
              </Link>
              에 공개되며, 누구나 &lsquo;사실이에요&rsquo; 또는
              &lsquo;아니에요&rsquo;로 투표해 정보의 정확성에 대한 의견을 남길
              수 있습니다.
            </Bullet>
            <Bullet>
              앱은 구역 데이터를 기기에 저장해 두고, 마지막 확인 후 24시간이
              지난 상태로 접속하거나 매월 말이 되면 서버에 새 데이터가 있는지
              확인해 갱신합니다.
            </Bullet>
          </ul>
        </PageSection>

        <PageSection title="잘못된 정보 신고" icon={<MessageSquare />}>
          <p className="mb-3">
            구역 정보가 실제와 다르거나 변경이 필요한 경우, 홈 화면의 피드백
            기능으로 알려주세요. 보내주신 의견은 서비스 개선에 활용됩니다.
          </p>
          <Button variant="outline" asChild>
            <Link href="/">홈에서 피드백 보내기</Link>
          </Button>
        </PageSection>

        <PageSection
          title="책임 한계 안내"
          icon={<AlertTriangle />}
          className="bg-muted/60"
        >
          <p className="mb-3">
            본 서비스에서 제공하는 금연구역 및 흡연구역 정보는{" "}
            <strong>참고용</strong>으로만 제공됩니다. 실제 현장의 상황과 다를 수
            있으며, 정보의 정확성 및 법적 책임에 대해서는 보증하지 않습니다.
          </p>
          <ul className="space-y-1.5">
            <Bullet>
              정확한 금연구역 정보는 해당 지역의 관할 기관에 문의하시기
              바랍니다.
            </Bullet>
            <Bullet>
              본 서비스 이용으로 발생하는 문제에 대해 운영자는 책임을 지지
              않습니다.
            </Bullet>
          </ul>
        </PageSection>

        <PageSection
          title="관련 법령"
          icon={<Scale />}
          className="border-primary/20 bg-primary/5"
        >
          <p className="mb-3">
            금연구역 지정 시설과 흡연실 설치 기준은 국민건강증진법과 같은 법
            시행규칙을 따릅니다.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/statute">금연구역 관련 법령 보기</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href={LAW_URL} target="_blank" rel="noopener noreferrer">
                국민건강증진법 (국가법령정보센터)
                <ExternalLink aria-hidden />
              </a>
            </Button>
          </div>
        </PageSection>

        <p className="text-center text-sm tabular-nums">
          최종 업데이트: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
        </p>
      </main>
    </div>
  );
}
