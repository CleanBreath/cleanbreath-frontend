import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// src/i18n/request.ts를 next-intl 설정으로 연결
const withNextIntl = createNextIntlPlugin();

// CSP에는 경로 없이 origin만 넣는다 (src/api/client.ts와 같은 기본값)
const apiOrigin = new URL(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1",
).origin;

// 네이버 지도 JS v3 (운영 HTTPS에서 확인): 스크립트·인증 oapi.map.naver.com, 타일·스타일 JSONP·아이콘·CSS *.pstatic.net
const naver = "https://*.pstatic.net https://*.naver.com https://*.naver.net";
// 지도 오류 로그(nelo)와 역지오코딩 XHR(maps-geocoder.js → maps.apigw.ntruss.com)
const naverConnect = "https://*.navercorp.com https://maps.apigw.ntruss.com";

// 전체 정책은 위반만 콘솔에 보고(Report-Only)하고, 차단해도 안전한 지시어만 강제한다
const cspReportOnly = [
  "default-src 'self'",
  // Next 인라인 부트스트랩·JSON-LD 때문에 'unsafe-inline' 필요 (nonce 전환 전까지)
  `script-src 'self' 'unsafe-inline' ${naver}`,
  "style-src 'self' 'unsafe-inline' https://*.pstatic.net",
  `img-src 'self' data: blob: ${naver}`,
  `connect-src 'self' ${apiOrigin} ${naver} ${naverConnect}`,
  "font-src 'self' data:",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
  },
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  experimental: {
    // 루트 레이아웃이 [locale]이라 언어 없는 404는 app/global-not-found.tsx가 맡는다
    globalNotFound: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
