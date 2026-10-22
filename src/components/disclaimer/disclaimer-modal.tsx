"use client";

import { AlertTriangle, Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DISCLAIMER_KEY = "cleanbreath-disclaimer-accepted";

// 위치는 셸이 정한다 (fixed/absolute 없음). 지도 위 카드로 표시
export function DisclaimerModal() {
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
      aria-label="서비스 이용 안내"
      className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
    >
      <Card className="gap-0 py-0 shadow-md">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <AlertTriangle size={16} aria-hidden />
            </div>
            <p className="text-sm leading-relaxed">
              표시되는 금연·흡연구역 정보는 <strong>참고용</strong>이며 실제
              현장과 다를 수 있습니다.
            </p>
          </div>

          <div
            id={detailsId}
            hidden={!isExpanded}
            className="max-h-[40dvh] space-y-2 overflow-y-auto overscroll-contain rounded-lg bg-muted p-3 text-sm leading-relaxed text-muted-foreground"
          >
            <p>
              본 서비스에서 제공하는 금연구역 및 흡연구역 정보는{" "}
              <strong>참고용</strong>으로만 제공됩니다. 실제 현장의 상황과 다를
              수 있으며, 정보의 정확성 및 법적 책임에 대해서는 보증하지
              않습니다.
            </p>
            <p>
              정확한 금연구역 정보는 해당 지역의 관할 기관에 문의하시기
              바랍니다.
            </p>
            <p>
              본 서비스 이용으로 발생하는 문제에 대해 운영자는 책임을 지지
              않습니다.
            </p>
            <p>
              정보가 부정확하거나 변경이 필요한 경우 피드백을 통해 알려주세요.
            </p>
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
              {isExpanded ? "접기" : "자세히"}
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
              확인
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
