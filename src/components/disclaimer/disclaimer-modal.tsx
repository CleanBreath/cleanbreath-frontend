"use client";

import { AlertTriangle, Check, ChevronDown } from "lucide-react";
import * as motion from "motion/react-client";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DISCLAIMER_KEY = "cleanbreath-disclaimer-accepted";

// 지도를 가리지 않는 하단 플로팅 안내 (하단 버튼 h-12 위, 상단 토글/햄버거와 겹치지 않음)
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
    <motion.section
      role="region"
      aria-label="서비스 이용 안내"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-x-4 bottom-20 z-40 sm:left-auto sm:w-96"
    >
      <Card className="gap-0 py-0 shadow-2xl">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
              <AlertTriangle
                size={16}
                className="text-amber-600 dark:text-amber-400"
              />
            </div>
            <p className="text-sm leading-relaxed">
              표시되는 금연·흡연구역 정보는 <strong>참고용</strong>이며 실제
              현장과 다를 수 있습니다.
            </p>
          </div>

          <div
            id={detailsId}
            hidden={!isExpanded}
            className="max-h-[40dvh] space-y-2 overflow-y-auto rounded-lg bg-muted/50 p-3 text-sm leading-relaxed text-muted-foreground"
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
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-controls={detailsId}
              className="h-11 flex-1 gap-1"
            >
              {isExpanded ? "접기" : "자세히"}
              <ChevronDown
                size={16}
                className={cn(
                  "transition-transform",
                  isExpanded && "rotate-180",
                )}
              />
            </Button>
            <Button onClick={handleAccept} className="h-11 flex-1 gap-2">
              <Check size={16} />
              확인
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
