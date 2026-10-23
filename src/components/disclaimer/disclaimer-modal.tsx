"use client";

import { AlertTriangle, Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DISCLAIMER_KEY = "cleanbreath-disclaimer-accepted";

const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

// 위치는 셸이 정한다 (fixed/absolute 없음). 지도 위 카드로 표시
export function DisclaimerModal() {
  const t = useTranslations("overlays.disclaimer");
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsId = useId();

  useEffect(() => {
    // 로컬 스토리지에서 동의 여부 확인 (접근 불가 환경에서는 안내 표시)
    try {
      if (!localStorage.getItem(DISCLAIMER_KEY)) setIsOpen(true);
    } catch {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(DISCLAIMER_KEY, "true");
    } catch {}
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <section
      // biome-ignore lint/a11y/noRedundantRoles: 랜드마크 역할을 명시적으로 유지 (기존 계약)
      role="region"
      aria-label={t("label")}
      className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
    >
      <Card className="gap-0 py-0 shadow-md">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <AlertTriangle size={16} aria-hidden />
            </div>
            <p className="text-sm leading-relaxed">
              {t.rich("summary", { strong })}
            </p>
          </div>

          <div
            id={detailsId}
            hidden={!isExpanded}
            className="max-h-[40dvh] space-y-2 overflow-y-auto overscroll-contain rounded-lg bg-muted p-3 text-sm leading-relaxed text-muted-foreground"
          >
            <p>{t.rich("details1", { strong })}</p>
            <p>{t("details2")}</p>
            <p>{t("details3")}</p>
            <p>{t("details4")}</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="touch"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-controls={detailsId}
              className="flex-1 gap-1"
            >
              {isExpanded ? t("collapse") : t("expand")}
              <ChevronDown
                size={16}
                aria-hidden
                className={cn(
                  "transition-transform duration-200",
                  isExpanded && "rotate-180",
                )}
              />
            </Button>
            <Button
              size="touch"
              onClick={handleAccept}
              className="flex-1 gap-2"
            >
              <Check size={16} aria-hidden />
              {t("accept")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
