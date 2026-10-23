"use client";

import { Code2, User, Users } from "lucide-react";
import { useTranslations } from "next-intl";
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
const VERSION_INFO = {
  current: "0.3.0",
  versions: [
    {
      version: "0.3.0",
      date: "2025.02",
      developers: ["최현준"],
      changesKey: "v030",
    },
    {
      version: "0.2.0",
      date: "2024.12",
      developers: ["최현준"],
      changesKey: "v020",
    },
    {
      version: "0.1.0",
      date: "2024.11",
      developers: ["최현준", "문찬수", "김건우", "유현목", "최시헌", "김장환"],
      changesKey: "v010",
    },
  ],
} as const;

export function VersionModal({ isOpen, onClose }: VersionModalProps) {
  const t = useTranslations("overlays.version");
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
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
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
                    className={
                      index === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground/20 text-foreground"
                    }
                  >
                    v{versionInfo.version}
                  </Badge>
                  {index === 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {t("latest")}
                    </Badge>
                  )}
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {versionInfo.date}
                </span>
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
        </div>

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
