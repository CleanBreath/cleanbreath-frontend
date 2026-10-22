import {
  Clock,
  Cookie,
  Database,
  ExternalLink,
  FileText,
  Globe,
  Lock,
  Scale,
  Share2,
  ShieldCheck,
  Target,
  Trash2,
  UserCheck,
  UserCog,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";

const SITE_URL = "https://cleanbreath.cmu02-studio.com";
const PAGE_TITLE = "개인정보처리방침";
const PAGE_DESCRIPTION =
  "CleanBreath가 처리하는 개인정보 항목, 처리 목적과 보유 기간, 처리 위탁과 국외 이전, 이용자의 권리와 행사 방법을 안내합니다. 회원가입 없이 이용하며 이름·연락처·이메일은 수집하지 않습니다.";
const EFFECTIVE_DATE = "2026-10-22";
const ISSUES_URL = "https://github.com/CleanBreath/cleanbreath-frontend/issues";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    url: "/privacy",
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
      "@type": "WebPage",
      "@id": `${SITE_URL}/privacy#webpage`,
      url: `${SITE_URL}/privacy`,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: "ko-KR",
      dateModified: EFFECTIVE_DATE,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      breadcrumb: { "@id": `${SITE_URL}/privacy#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/privacy#breadcrumb`,
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
          name: PAGE_TITLE,
          item: `${SITE_URL}/privacy`,
        },
      ],
    },
  ],
};

const COLLECTED_ITEMS = [
  {
    kind: "이용자가 입력한 정보",
    item: "피드백: 제목, 내용, 작성 시각",
    method: "피드백 양식에 직접 입력",
  },
  {
    kind: "이용자가 입력한 정보",
    item: "구역 등록 요청: 주소, 건물명, 위치 좌표(위도·경도), 구역 구분, 구역 경계 좌표, 등록 시각",
    method: "구역 등록 화면에서 직접 입력하거나 지도에서 선택",
  },
  {
    kind: "자동 수집 정보",
    item: "투표 기록: 브라우저 토큰(무작위 값), 투표 대상 요청, 투표값(사실이에요·아니에요)",
    method: "게시판에서 투표할 때 전송",
  },
  {
    kind: "자동 수집 정보",
    item: "접속 기록: IP 주소, 접속 시각, User-Agent(브라우저·기기 정보)",
    method: "서비스에 접속할 때 웹 서버와 네트워크 장비가 자동 기록",
  },
  {
    kind: "기기 저장소 정보",
    item: "localStorage: 브라우저 토큰, 이용 안내 확인 여부 / IndexedDB: 지도 구역 데이터 사본",
    method:
      "이용자 기기에만 저장 (투표 시 보내는 브라우저 토큰 외에는 서버로 전송하지 않음)",
  },
];

const RETENTION = [
  { item: "피드백 내용", period: "접수일로부터 1년 후 파기" },
  {
    item: "구역 등록 요청 (주소·좌표·건물명·구역 구분 등)",
    period:
      "승인되어 지도에 반영되면 공개 지도 데이터로 서비스 운영 기간 동안 보관, 승인되지 않은 요청은 등록일로부터 6개월 후 파기",
  },
  {
    item: "투표 기록 (브라우저 토큰·투표값)",
    period: "해당 등록 요청이 승인되거나 파기될 때 함께 파기",
  },
  {
    item: "웹 서버 접속 기록 (IP 주소, 접속 시각, User-Agent)",
    period:
      "3개월 (「통신비밀보호법 시행령」의 로그 기록 보관 기간 3개월 참고)",
  },
  {
    item: "기기 저장소 데이터 (localStorage·IndexedDB)",
    period: "이용자가 브라우저 데이터를 삭제할 때까지 (이용자 기기에만 저장)",
  },
];

const PROCESSORS = [
  {
    name: "Vercel Inc.",
    task: "웹사이트 호스팅 및 전송",
    location: "미국",
  },
  {
    name: "Cloudflare, Inc.",
    task: "네트워크 보안, 콘텐츠 전송(CDN)",
    location: "미국",
  },
  {
    name: "Amazon Web Services",
    task: "API 서버 운영(클라우드 인프라)",
    location: "대한민국 (서울 리전)",
  },
];

const TRANSFERS = [
  {
    name: "Vercel Inc.",
    policyUrl: "https://vercel.com/legal/privacy-policy",
    items: "접속 기록(IP 주소, 접속 시각, User-Agent), 페이지 요청 정보",
    purpose: "웹사이트 제공",
  },
  {
    name: "Cloudflare, Inc.",
    policyUrl: "https://www.cloudflare.com/privacypolicy/",
    items:
      "접속 기록(IP 주소, 접속 시각, User-Agent), API 요청 데이터(피드백·구역 등록 요청·투표 내용)",
    purpose: "네트워크 보안 및 트래픽 전송",
  },
];

const DEVICE_STORAGE = [
  {
    where: "localStorage",
    name: "cleanbreath_client_token",
    purpose: "무작위 브라우저 토큰. 같은 요청에 중복 투표하는 것을 막습니다.",
  },
  {
    where: "localStorage",
    name: "cleanbreath-disclaimer-accepted",
    purpose: "이용 안내 확인 여부. 안내 창이 반복해서 뜨지 않게 합니다.",
  },
  {
    where: "IndexedDB",
    name: "cleanbreath-cache",
    purpose:
      "금연·흡연구역과 공동주택 데이터 사본, 갱신 시각. 지도를 빠르게 불러오는 데 씁니다.",
  },
];

const REMEDIES = [
  {
    name: "개인정보분쟁조정위원회",
    phone: "1833-6972",
    url: "https://www.kopico.go.kr",
    label: "www.kopico.go.kr",
  },
  {
    name: "개인정보침해신고센터",
    phone: "(국번 없이) 118",
    url: "https://privacy.kisa.or.kr",
    label: "privacy.kisa.or.kr",
  },
  {
    name: "대검찰청",
    phone: "(국번 없이) 1301",
    url: "https://www.spo.go.kr",
    label: "www.spo.go.kr",
  },
  {
    name: "경찰청",
    phone: "(국번 없이) 182",
    url: "https://ecrm.police.go.kr",
    label: "ecrm.police.go.kr",
  },
];

const thClass =
  "border-b px-3 py-2 text-left text-sm font-semibold text-foreground";
const tdClass = "border-b px-3 py-2 align-top";

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

function ExternalTextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-primary underline ${className}`}
    >
      {children}
      <ExternalLink aria-hidden className="size-3.5" />
    </a>
  );
}

function IssuesLink() {
  return <ExternalTextLink href={ISSUES_URL}>GitHub Issues</ExternalTextLink>;
}

export default function PrivacyPage() {
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
        icon={<ShieldCheck />}
        backLabel="홈으로 돌아가기"
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base leading-relaxed text-muted-foreground">
        <PageSection className="border-primary/20 bg-primary/5">
          <p className="mb-3">
            대림대학교 BlueSky 팀(이하 &lsquo;운영팀&rsquo;)은 CleanBreath(이하
            &lsquo;서비스&rsquo;)를 운영하며 「개인정보 보호법」 제30조에 따라
            이용자의 개인정보를 어떻게 처리하는지 다음과 같이 안내합니다.
          </p>
          <p>
            서비스는 회원가입이나 로그인 없이 이용합니다.{" "}
            <strong>
              이름, 전화번호, 이메일 주소, 계정(아이디·비밀번호)은 수집하지
              않습니다.
            </strong>
          </p>
        </PageSection>

        <PageSection title="1. 개인정보의 처리 목적" icon={<Target />}>
          <p className="mb-3">
            운영팀은 다음 목적으로만 개인정보를 처리하며, 목적이 바뀌면 미리
            알려 드립니다.
          </p>
          <ul className="space-y-1.5">
            <Bullet>피드백 접수와 서비스 개선</Bullet>
            <Bullet>
              구역 등록 요청 접수, 게시판 공개, 투표 결과에 따른 지도 반영
            </Bullet>
            <Bullet>
              같은 브라우저에서 같은 요청에 중복 투표하는 것을 막기 위한 확인
            </Bullet>
            <Bullet>
              서비스 안정성 확보, 오류 확인, 부정 이용 방지를 위한 접속 기록
              확인
            </Bullet>
          </ul>
        </PageSection>

        <PageSection title="2. 처리하는 개인정보 항목" icon={<Database />}>
          <section
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 가로 스크롤 표 키보드 접근 (axe scrollable-region-focusable)
            tabIndex={0}
            aria-label="처리하는 개인정보 항목"
            className="-mx-4 mb-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <table className="w-full min-w-[36rem] border-collapse text-base">
              <caption className="sr-only">처리하는 개인정보 항목</caption>
              <thead>
                <tr className="bg-muted/60">
                  <th scope="col" className={thClass}>
                    구분
                  </th>
                  <th scope="col" className={thClass}>
                    항목
                  </th>
                  <th scope="col" className={thClass}>
                    수집 방법
                  </th>
                </tr>
              </thead>
              <tbody>
                {COLLECTED_ITEMS.map((row) => (
                  <tr key={row.item}>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {row.kind}
                    </td>
                    <td className={tdClass}>{row.item}</td>
                    <td className={tdClass}>{row.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <ul className="space-y-1.5">
            <Bullet>
              이용자 기기의 현재 위치(GPS 등)는 수집하지 않습니다. 구역 등록 시
              입력하는 좌표는 등록하려는 구역의 위치입니다.
            </Bullet>
            <Bullet>민감정보와 고유식별정보는 처리하지 않습니다.</Bullet>
            <Bullet>
              구역 등록 요청 내용과 투표 수는{" "}
              <Link href="/board" className="text-primary underline">
                게시판
              </Link>
              에 누구나 볼 수 있게 공개됩니다.
            </Bullet>
            <Bullet>
              피드백 제목·내용, 건물명 같은 자유 입력란에는 이름이나 연락처 등
              개인정보를 적지 마세요.
            </Bullet>
          </ul>
        </PageSection>

        <PageSection title="3. 개인정보의 처리 및 보유 기간" icon={<Clock />}>
          <section
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 가로 스크롤 표 키보드 접근 (axe scrollable-region-focusable)
            tabIndex={0}
            aria-label="항목별 보유 기간"
            className="-mx-4 mb-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <table className="w-full min-w-[32rem] border-collapse text-base">
              <caption className="sr-only">항목별 보유 기간</caption>
              <thead>
                <tr className="bg-muted/60">
                  <th scope="col" className={thClass}>
                    항목
                  </th>
                  <th scope="col" className={thClass}>
                    보유 기간
                  </th>
                </tr>
              </thead>
              <tbody>
                {RETENTION.map((row) => (
                  <tr key={row.item}>
                    <td className={tdClass}>{row.item}</td>
                    <td className={tdClass}>{row.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <p>
            등록 요청은 &lsquo;사실이에요&rsquo; 투표가 20표 이상 모이면 매일
            새벽 3시에 자동으로 지도에 반영되며, 이때 해당 요청과 투표 기록은
            삭제됩니다.
          </p>
        </PageSection>

        <PageSection title="4. 개인정보의 파기 절차 및 방법" icon={<Trash2 />}>
          <ul className="space-y-1.5">
            <Bullet>
              보유 기간이 끝나거나 처리 목적을 달성한 개인정보는 지체 없이
              파기합니다.
            </Bullet>
            <Bullet>
              전자 파일 형태의 정보는 데이터베이스와 로그 파일에서 복구할 수
              없는 방법으로 삭제합니다.
            </Bullet>
            <Bullet>종이 문서로 개인정보를 처리하지 않습니다.</Bullet>
            <Bullet>
              기기 저장소 데이터는 이용자가 브라우저 설정에서 사이트 데이터를
              삭제하면 바로 지워집니다.
            </Bullet>
          </ul>
        </PageSection>

        <PageSection title="5. 개인정보의 제3자 제공" icon={<Share2 />}>
          <p>
            운영팀은 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 특별한
            규정이 있는 경우 등 「개인정보 보호법」 제17조·제18조가 허용하는
            경우는 예외로 합니다.
          </p>
        </PageSection>

        <PageSection
          title="6. 개인정보 처리의 위탁 및 국외 이전"
          icon={<Globe />}
        >
          <h3 className="mb-2 font-semibold text-foreground">처리 위탁</h3>
          <p className="mb-3">
            운영팀은 서비스 제공을 위해 다음 인프라 업체에 개인정보 처리 업무를
            맡기고 있습니다.
          </p>
          <section
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 가로 스크롤 표 키보드 접근 (axe scrollable-region-focusable)
            tabIndex={0}
            aria-label="처리 위탁 업체"
            className="-mx-4 mb-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <table className="w-full min-w-[32rem] border-collapse text-base">
              <caption className="sr-only">처리 위탁 업체</caption>
              <thead>
                <tr className="bg-muted/60">
                  <th scope="col" className={thClass}>
                    수탁자
                  </th>
                  <th scope="col" className={thClass}>
                    위탁 업무
                  </th>
                  <th scope="col" className={thClass}>
                    소재지
                  </th>
                </tr>
              </thead>
              <tbody>
                {PROCESSORS.map((row) => (
                  <tr key={row.name}>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {row.name}
                    </td>
                    <td className={tdClass}>{row.task}</td>
                    <td className={tdClass}>{row.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <h3 className="mb-2 font-semibold text-foreground">지도 서비스</h3>
          <p className="mb-4">
            지도 화면은 네이버클라우드의 NAVER Cloud Platform Maps에서 지도
            스크립트와 이미지를 직접 불러옵니다. 이 과정에서 이용자의 브라우저가
            NAVER 서버에 접속하므로 IP 주소 등 접속 정보가 NAVER에 전달되며,
            구역 등록 화면에서 지도로 선택한 위치의 좌표는 주소 변환을 위해
            NAVER에 전송됩니다. 이 정보는 NAVER의 개인정보처리방침에 따라
            처리됩니다.
          </p>

          <h3 className="mb-2 font-semibold text-foreground">국외 이전</h3>
          <p className="mb-3">
            「개인정보 보호법」 제28조의8에 따라 국외로 이전되는 개인정보를
            다음과 같이 알려 드립니다.
          </p>
          <section
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 가로 스크롤 표 키보드 접근 (axe scrollable-region-focusable)
            tabIndex={0}
            aria-label="개인정보 국외 이전 현황"
            className="-mx-4 mb-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <table className="w-full min-w-[42rem] border-collapse text-base">
              <caption className="sr-only">개인정보 국외 이전 현황</caption>
              <thead>
                <tr className="bg-muted/60">
                  <th scope="col" className={thClass}>
                    이전받는 자
                  </th>
                  <th scope="col" className={`${thClass} whitespace-nowrap`}>
                    이전 국가
                  </th>
                  <th scope="col" className={thClass}>
                    이전 항목
                  </th>
                  <th scope="col" className={thClass}>
                    이전 시기·방법
                  </th>
                  <th scope="col" className={thClass}>
                    이전 목적
                  </th>
                  <th scope="col" className={thClass}>
                    보유 기간
                  </th>
                </tr>
              </thead>
              <tbody>
                {TRANSFERS.map((row) => (
                  <tr key={row.name}>
                    <td className={tdClass}>
                      <span className="block whitespace-nowrap">
                        {row.name}
                      </span>
                      <ExternalTextLink
                        href={row.policyUrl}
                        className="min-h-11"
                      >
                        개인정보처리방침
                      </ExternalTextLink>
                    </td>
                    <td className={`${tdClass} whitespace-nowrap`}>미국</td>
                    <td className={tdClass}>{row.items}</td>
                    <td className={tdClass}>
                      서비스 이용 시 네트워크를 통해 전송
                    </td>
                    <td className={tdClass}>{row.purpose}</td>
                    <td className={tdClass}>
                      위탁 목적 달성 시까지 (접속 기록은 3절의 보유 기간 내)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <p>
            국외 이전을 원하지 않으면 서비스 이용을 중단할 수 있습니다. 서비스는
            위 인프라를 거쳐서만 제공되므로, 이전을 거부하면 서비스를 이용할 수
            없습니다.
          </p>
        </PageSection>

        <PageSection
          title="7. 정보주체의 권리·의무 및 행사 방법"
          icon={<UserCheck />}
        >
          <ul className="mb-3 space-y-1.5">
            <Bullet>
              이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리
              정지를 요구할 수 있습니다. 법정대리인이나 위임을 받은 대리인을
              통해서도 요구할 수 있습니다.
            </Bullet>
            <Bullet>
              요구는 <IssuesLink /> 또는 홈 화면의 피드백 기능으로 보내 주세요.
              GitHub Issues는 누구나 볼 수 있으므로 개인정보는 적지 마세요.
            </Bullet>
            <Bullet>
              계정이 없어 본인을 확인할 수단이 없으므로, 대상 게시물을 특정할 수
              있는 정보(게시판 상세 주소의 요청 번호, 피드백 제목과 작성 시각
              등)를 함께 알려 주세요. 이를 기준으로 처리합니다.
            </Bullet>
            <Bullet>
              브라우저 토큰과 기기 저장소 데이터는 이용자가 브라우저 설정에서
              직접 삭제할 수 있습니다.
            </Bullet>
            <Bullet>
              이용자는 다른 사람의 개인정보를 입력해서는 안 되며, 잘못된 정보
              입력으로 생기는 문제에 대한 책임은 입력한 이용자에게 있습니다.
            </Bullet>
          </ul>
        </PageSection>

        <PageSection
          title="8. 자동 수집 장치의 설치·운영 및 거부"
          icon={<Cookie />}
        >
          <p className="mb-3">
            운영팀은 광고나 행태 분석을 위한 쿠키와 분석 도구를 사용하지
            않습니다. 대신 서비스 기능을 위해 브라우저 저장소에 다음 정보를
            저장합니다.
          </p>
          <section
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 가로 스크롤 표 키보드 접근 (axe scrollable-region-focusable)
            tabIndex={0}
            aria-label="기기 저장소 사용 현황"
            className="-mx-4 mb-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <table className="w-full min-w-[32rem] border-collapse text-base">
              <caption className="sr-only">기기 저장소 사용 현황</caption>
              <thead>
                <tr className="bg-muted/60">
                  <th scope="col" className={thClass}>
                    저장 위치
                  </th>
                  <th scope="col" className={thClass}>
                    이름
                  </th>
                  <th scope="col" className={thClass}>
                    내용 및 목적
                  </th>
                </tr>
              </thead>
              <tbody>
                {DEVICE_STORAGE.map((row) => (
                  <tr key={row.name}>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {row.where}
                    </td>
                    <td className={`${tdClass} break-all font-mono text-sm`}>
                      {row.name}
                    </td>
                    <td className={tdClass}>{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <ul className="space-y-1.5">
            <Bullet>
              브라우저 토큰은 처음 투표할 때 만들어지며, 투표할 때만 서버로
              전송됩니다. 나머지 데이터는 서버로 보내지 않습니다.
            </Bullet>
            <Bullet>
              브라우저 설정에서 사이트 데이터를 삭제하거나 저장을 차단할 수
              있습니다. 이 경우 투표 등 일부 기능을 이용하기 어려울 수 있습니다.
            </Bullet>
          </ul>
        </PageSection>

        <PageSection title="9. 개인정보의 안전성 확보 조치" icon={<Lock />}>
          <ul className="space-y-1.5">
            <Bullet>
              최소 수집: 개인을 직접 식별하는 정보를 수집하지 않고, 서비스에
              필요한 정보만 처리합니다.
            </Bullet>
            <Bullet>
              전송 구간 암호화: 서비스와 API 통신은 HTTPS로 암호화합니다.
            </Bullet>
            <Bullet>
              네트워크 보안: API 서버 앞단에 Cloudflare 네트워크 보안 서비스를
              적용합니다.
            </Bullet>
          </ul>
        </PageSection>

        <PageSection title="10. 개인정보 보호책임자" icon={<UserCog />}>
          <p className="mb-3">
            개인정보 처리에 관한 업무를 총괄하고 관련 문의와 불만을 처리하기
            위해 다음과 같이 개인정보 보호책임자를 두고 있습니다.
          </p>
          <ul className="space-y-1.5">
            <Bullet>
              개인정보 보호책임자: <strong>대림대학교 BlueSky 팀</strong>
            </Bullet>
            <Bullet>
              문의: <IssuesLink /> 또는 홈 화면의 피드백 기능
            </Bullet>
          </ul>
        </PageSection>

        <PageSection title="11. 권익침해 구제방법" icon={<Scale />}>
          <p className="mb-3">
            개인정보 침해에 대한 신고나 상담이 필요하면 아래 기관에 문의할 수
            있습니다.
          </p>
          <ul className="space-y-1.5">
            {REMEDIES.map((r) => (
              <Bullet key={r.name}>
                {r.name}: {r.phone},{" "}
                <ExternalTextLink href={r.url}>{r.label}</ExternalTextLink>
              </Bullet>
            ))}
          </ul>
        </PageSection>

        <PageSection title="12. 개인정보처리방침의 변경" icon={<FileText />}>
          <p className="mb-3">
            이 개인정보처리방침은{" "}
            <time dateTime={EFFECTIVE_DATE}>2026년 10월 22일</time>부터
            시행합니다. 내용이 바뀌면 시행 7일 전부터 이 페이지에서 알려
            드립니다.
          </p>
          <p>
            관련 안내:{" "}
            <Link href="/about" className="text-primary underline">
              서비스 소개 및 운영 정보
            </Link>
          </p>
        </PageSection>

        <p className="text-center text-sm tabular-nums">
          시행일: <time dateTime={EFFECTIVE_DATE}>{EFFECTIVE_DATE}</time>
        </p>
      </main>
    </div>
  );
}
