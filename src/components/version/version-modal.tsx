"use client";

import { Code2, User, Users } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 변경사항 문구는 messages의 overlays.version.changes.<changesKey>
// date는 YYYY-MM (UTC로 파싱되어 Asia/Seoul에서도 같은 달). 화면에는 로케일 형식으로 표시
const VERSION_INFO = {
  current: "0.3.0",
  versions: [
    {
      version: "0.3.0",
      date: "2025-02",
      developers: ["최현준"],
      changesKey: "v030",
    },
    {
      version: "0.2.0",
      date: "2024-12",
      developers: ["최현준"],
      changesKey: "v020",
    },
    {
      version: "0.1.0",
      date: "2024-11",
      developers: ["최현준", "문찬수", "김건우", "유현목", "최시헌", "김장환"],
      changesKey: "v010",
    },
  ],
} as const;

export function VersionModal({ isOpen, onClose }: VersionModalProps) {
  const t = useTranslations("overlays.version");
  const format = useFormatter();
  // Trigger 없이 열리므로 Radix가 포커스를 돌려주지 못한다 → 연 요소를 기억해 직접 복원
  const returnFocusRef = useRef<HTMLElement | null>(null);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        aria-modal="true"
        onOpenAutoFocus={() => {
          returnFocusRef.current = document.activeElement as HTMLElement | null;
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          returnFocusRef.current?.focus();
        }}
        className="max-h-[90dvh] gap-0 rounded-t-xl pb-[env(safe-area-inset-bottom)] data-[state=closed]:duration-150 data-[state=open]:duration-200 sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border sm:pb-0 sm:data-[state=closed]:fade-out-0 sm:data-[state=closed]:slide-out-to-bottom-4 sm:data-[state=open]:fade-in-0 sm:data-[state=open]:slide-in-from-bottom-4"
      >
        <SheetHeader className="shrink-0 flex-row items-center gap-3 border-b pr-14">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Code2 size={20} aria-hidden />
          </div>
          <div className="space-y-0.5">
            <SheetTitle className="text-lg">{t("title")}</SheetTitle>
            <SheetDescription className="tabular-nums">
              CleanBreath v{VERSION_INFO.current}
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* 버전 목록 */}
        <section
          // biome-ignore lint/a11y/noNoninteractiveTabindex: 포커스 가능한 요소가 없는 세로 스크롤 영역 키보드 접근 (axe scrollable-region-focusable)
          tabIndex={0}
          aria-label={t("title")}
          // 모바일 시트는 화면 폭 전체라 전역 2px 바깥 링이 좌우로 잘린다 → 안쪽으로 그린다 (TabsContent와 같은 방식)
          className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 -outline-offset-2"
        >
          {VERSION_INFO.versions.map((versionInfo, index) => (
            <section
              key={versionInfo.version}
              aria-label={`v${versionInfo.version}`}
              className={cn(
                "rounded-lg border p-4",
                index === 0 ? "border-primary/30 bg-primary/5" : "bg-muted",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={index === 0 ? "default" : "outline"}
                    className={index === 0 ? undefined : "bg-card"}
                  >
                    v{versionInfo.version}
                  </Badge>
                  {index === 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {t("latest")}
                    </Badge>
                  )}
                </div>
                <time
                  dateTime={versionInfo.date}
                  className="text-xs tabular-nums text-muted-foreground"
                >
                  {format.dateTime(new Date(versionInfo.date), {
                    year: "numeric",
                    month: "short",
                  })}
                </time>
              </div>

              <Separator className="my-3" />

              {/* 개발자 */}
              <div className="mb-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  {versionInfo.developers.length === 1 ? (
                    <User size={12} aria-hidden />
                  ) : (
                    <Users size={12} aria-hidden />
                  )}
                  <span>
                    {t("developers", {
                      count: versionInfo.developers.length,
                    })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {versionInfo.developers.map((dev) => (
                    <Badge
                      key={dev}
                      variant="secondary"
                      lang="ko"
                      className="text-xs"
                    >
                      {dev}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 변경사항 */}
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  {t("changesTitle")}
                </p>
                <ul className="space-y-1.5">
                  {(t.raw(`changes.${versionInfo.changesKey}`) as string[]).map(
                    (change) => (
                      <li
                        key={change}
                        className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                        />
                        <span>{change}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </section>
          ))}
        </section>

        {/* 하단 */}
        <div className="shrink-0 border-t p-4 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 BlueSky Team. All rights reserved.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
