import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// messages/<locale>/<namespace>.json. 파일 하나가 t()의 네임스페이스 하나
export const NAMESPACES = [
  "common",
  "meta",
  "errors",
  "home",
  "map",
  "sidebar",
  "overlays",
  "statute",
  "about",
  "privacy",
  "register",
  "board",
  "health",
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const entries = await Promise.all(
    NAMESPACES.map(
      async (ns) =>
        [
          ns,
          (await import(`../../messages/${locale}/${ns}.json`)).default,
        ] as const,
    ),
  );

  return {
    locale,
    messages: Object.fromEntries(entries),
    // 서버·클라이언트 날짜 포맷이 같아야 hydration 오류가 없다. 서비스 지역 기준
    timeZone: "Asia/Seoul",
  };
});
