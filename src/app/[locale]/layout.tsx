import type { Metadata, Viewport } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "../../../styles/global.css";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { QueryProvider } from "@/components/providers/query-provider";
import { SchedulerProvider } from "@/components/providers/scheduler-provider";
import { localeMetadata } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";

const APP_NAME = "CleanBreath";
const APP_TITLE_TEMPLATE = "%s | CleanBreath";

// 언어별 정적 생성 (/, /en, /ja). 그 밖의 [locale] 값(/foo.txt 등 proxy를 거치지 않는 경로)은 바로 404
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("title");
  const description = t("description");
  // 홈(클라이언트 페이지) 기준값. 하위 세그먼트는 localeMetadata(locale, 경로)로 alternates·openGraph를 각자 덮어써야 함
  const localized = localeMetadata(locale, "/");

  return {
    metadataBase: new URL("https://cleanbreath.cmu02-studio.com"),
    applicationName: APP_NAME,
    title: {
      default: title,
      template: APP_TITLE_TEMPLATE,
    },
    description,
    icons: {
      icon: "/cleanBreathFavicon.ico",
    },
    keywords: t("keywords"),
    authors: [
      {
        name: t("author"),
        url: "https://github.com/CleanBreath/cleanbreath-frontend",
      },
    ],
    manifest: "/manifest.json",
    alternates: localized.alternates,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title,
      // startUpImage: [],
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      ...localized.openGraph,
      type: "website",
      siteName: APP_NAME,
      title: {
        default: title,
        template: APP_TITLE_TEMPLATE,
      },
      description,
      images: [
        {
          url: "https://cleanbreath.cmu02-studio.com/OGImage.png",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    // title/description을 비워두면 Next가 경로별 openGraph 값으로 채운다
    twitter: {
      card: "summary",
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    verification: {
      other: {
        "naver-site-verification": "6966c0f44b19d32900c068b84aac20a3a0591742",
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // 정적 렌더링 유지: 하위 서버 컴포넌트의 next-intl 호출이 헤더 대신 이 값을 읽는다
  setRequestLocale(locale);
  // about·privacy는 서버 컴포넌트에서만 쓰므로 모든 페이지 RSC 페이로드에 싣지 않는다
  const {
    about: _about,
    privacy: _privacy,
    ...clientMessages
  } = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={clientMessages}>
          <QueryProvider>
            <SchedulerProvider>{children}</SchedulerProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
