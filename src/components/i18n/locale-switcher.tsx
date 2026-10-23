"use client";

import { ChevronDown, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * 언어 선택. 같은 페이지(경로·쿼리 유지)의 다른 언어로 이동하고 NEXT_LOCALE 쿠키에 기억한다
 * @param iconOnly 좁은 헤더용 44px 아이콘 버튼 모양 (선택값은 aria-label과 함께 읽힘)
 */
export function LocaleSwitcher({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  const t = useTranslations("common");
  const locale = useLocale();
  // 언어 접두어를 뺀 한국어 기준 경로 (/ja/board/3 → /board/3)
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Locale;
    // 전체 페이지 이동: 네이버 지도 스크립트(language)를 새 언어로 다시 불러오기 위해.
    // 접두어를 강제(/ko/board)하면 proxy가 NEXT_LOCALE 쿠키를 갱신한 뒤 /board로 보낸다
    window.location.assign(
      getPathname({ href: pathname, locale: next, forcePrefix: true }) +
        window.location.search,
    );
  };

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <Languages
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground",
          iconOnly && "left-1/2 size-5 -translate-x-1/2 text-foreground",
        )}
      />
      {/* 모바일 확대 방지를 위해 16px. 네이티브 select라 키보드·스크린리더 조작이 기본 제공된다 */}
      <select
        aria-label={t("language")}
        value={locale}
        onChange={handleChange}
        className={cn(
          "h-11 cursor-pointer appearance-none rounded-md border bg-background pr-8 pl-9 text-base font-medium shadow-xs outline-none transition-colors hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          // 글자만 투명하게 해 select 동작은 그대로 두고 아이콘만 보이게 한다
          iconOnly &&
            "w-11 border-transparent px-0 text-transparent shadow-none",
        )}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} lang={l} className="text-foreground">
            {t(`languageNames.${l}`)}
          </option>
        ))}
      </select>
      {!iconOnly && (
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
      )}
    </div>
  );
}
