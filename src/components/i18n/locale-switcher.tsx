"use client";

import { ChevronDown, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
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
  const [picked, setPicked] = useState<Locale>(locale as Locale);
  // 닫힌 select에서 화살표·글자키로 값이 바뀌면 이동하지 않고 Enter로 확정한다 (WCAG 3.2.2).
  // 마우스·터치·펼친 목록에서 고른 경우는 바로 이동한다
  const keyPressing = useRef(false);

  // 이동 직전에 picked를 바꿔 두므로, 뒤로 가기로 bfcache에서 복원되면 현재 언어로 되돌린다
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => {
      if (e.persisted) setPicked(locale as Locale);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, [locale]);

  const go = (next: Locale) => {
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
        value={picked}
        onKeyDown={(e) => {
          // Enter는 확정 동작이라 보류하지 않는다 (펼친 목록에서 Enter로 고른 change도 바로 이동)
          // 값은 state가 아니라 select에서 바로 읽는다 (펼친 목록에서 고른 값이 state보다 먼저 올 수 있음)
          if (e.key === "Enter") {
            const value = e.currentTarget.value as Locale;
            if (value !== locale) {
              e.preventDefault();
              go(value);
            }
            return;
          }
          // 이 키 입력 동안 일어난 change만 키보드 탐색으로 본다
          keyPressing.current = true;
          setTimeout(() => {
            keyPressing.current = false;
          });
        }}
        onChange={(e) => {
          const next = e.target.value as Locale;
          setPicked(next);
          if (!keyPressing.current) go(next);
        }}
        onBlur={() => setPicked(locale as Locale)}
        className={cn(
          "h-11 cursor-pointer appearance-none rounded-md border border-input bg-background pr-8 pl-9 text-base font-medium shadow-xs transition-colors hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
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
      {/* 아이콘만 보이는 모양에서는 방향키로 고른(아직 Enter 전) 언어가 보이지 않으므로 코드 배지로 보여 준다. 이름은 select 값으로 읽힌다 */}
      {iconOnly && picked !== locale && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 rounded-sm bg-primary px-1 font-semibold text-[0.625rem] text-primary-foreground uppercase leading-4"
        >
          {picked}
        </span>
      )}
      {!iconOnly && (
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
      )}
    </div>
  );
}
