import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// src/i18n/request.ts를 next-intl 설정으로 연결
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // 루트 레이아웃이 [locale]이라 언어 없는 404는 app/global-not-found.tsx가 맡는다
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
