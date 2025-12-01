"use client";

import { useEffect, useState } from "react";
import * as motion from "motion/react-client";
import { AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DISCLAIMER_KEY = "cleanbreath-disclaimer-accepted";

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 동의 여부 확인
    const hasAccepted = localStorage.getItem(DISCLAIMER_KEY);
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(DISCLAIMER_KEY, "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-0">
            {/* 헤더 */}
            <div className="bg-linear-to-br from-amber-500/10 to-orange-500/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20">
                  <AlertTriangle
                    size={24}
                    className="text-amber-600 dark:text-amber-400"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold">서비스 이용 안내</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    CleanBreath를 이용하기 전에 확인해주세요
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* 내용 */}
            <div className="space-y-4 p-6">
              <div className="rounded-lg bg-muted/50 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                    !
                  </span>
                  책임 한계 안내
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  본 서비스에서 제공하는 금연구역 및 흡연구역 정보는{" "}
                  <strong>참고용</strong>으로만 제공됩니다. 실제 현장의 상황과
                  다를 수 있으며, 정보의 정확성 및 법적 책임에 대해서는 보증하지
                  않습니다.
                </p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    정확한 금연구역 정보는 해당 지역의 관할 기관에 문의하시기
                    바랍니다.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    본 서비스 이용으로 발생하는 문제에 대해 운영자는 책임을 지지
                    않습니다.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    정보가 부정확하거나 변경이 필요한 경우 피드백을 통해
                    알려주세요.
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* 하단 버튼 */}
            <div className="p-6">
              <Button onClick={handleAccept} className="w-full gap-2" size="lg">
                <Check size={18} />
                확인했습니다
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                위 내용을 확인하고 서비스를 이용합니다
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
