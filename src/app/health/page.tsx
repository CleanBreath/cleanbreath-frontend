"use client";

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Server,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { checkServerHealth } from "@/api";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 상태색은 토큰만 사용: 정상=primary, 오류=destructive, 확인 중=muted
const STATUS_STYLE = {
  healthy: {
    label: "정상",
    tone: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  unhealthy: {
    label: "오류",
    tone: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
  checking: {
    label: "확인 중",
    tone: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
} as const;

interface ServiceStatus {
  name: string;
  status: "healthy" | "unhealthy" | "checking";
  message?: string;
  responseTime?: number;
  icon: React.ReactNode;
}

export default function HealthPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "API 서버",
      status: "checking",
      icon: <Server size={20} />,
    },
  ]);
  // 정적 프리렌더 HTML과 시각이 어긋나 hydration 오류가 나지 않도록 첫 확인 전에는 비워 둔다
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      const startTime = Date.now();

      try {
        const health = await checkServerHealth();
        const responseTime = Date.now() - startTime;

        // API 서버 상태만 표시
        setServices([
          {
            name: "API 서버",
            status: health.status === "UP" ? "healthy" : "unhealthy",
            message: health.status,
            responseTime,
            icon: <Server size={20} />,
          },
        ]);
      } catch {
        const responseTime = Date.now() - startTime;
        setServices([
          {
            name: "API 서버",
            status: "unhealthy",
            message: "연결 실패",
            responseTime,
            icon: <Server size={20} />,
          },
        ]);
      }

      setLastChecked(new Date());
    };

    checkHealth();

    // 30초마다 자동으로 헬스 체크
    const interval = setInterval(() => {
      checkHealth();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const allHealthy = services.every((s) => s.status === "healthy");
  const anyUnhealthy = services.some((s) => s.status === "unhealthy");

  const overall = allHealthy
    ? "healthy"
    : anyUnhealthy
      ? "unhealthy"
      : "checking";

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <PageHeader
        title="서버 상태"
        description="시스템 헬스 체크"
        icon={<Activity />}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 pb-8 text-base">
        {/* 전체 상태 카드 */}
        <PageSection>
          <div aria-live="polite" className="flex items-center gap-4">
            <div
              aria-hidden
              className={cn(
                "flex size-16 shrink-0 items-center justify-center rounded-2xl",
                overall === "healthy" && "bg-primary text-primary-foreground",
                overall === "unhealthy" && "bg-destructive text-white",
                overall === "checking" && "bg-muted text-muted-foreground",
              )}
            >
              {overall === "healthy" ? (
                <CheckCircle2 size={32} />
              ) : overall === "unhealthy" ? (
                <XCircle size={32} />
              ) : (
                <AlertCircle size={32} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold">
                {allHealthy
                  ? "모든 시스템 정상"
                  : anyUnhealthy
                    ? "시스템 오류 발생"
                    : "시스템 확인 중"}
              </h2>
              <p className="text-muted-foreground">
                {allHealthy
                  ? "모든 서비스가 정상적으로 작동하고 있습니다."
                  : anyUnhealthy
                    ? "일부 서비스에 문제가 발생했습니다."
                    : "시스템 상태를 확인하고 있습니다."}
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} aria-hidden />
                <span className="tabular-nums">
                  마지막 확인:{" "}
                  {lastChecked ? lastChecked.toLocaleTimeString("ko-KR") : "-"}
                </span>
              </div>
            </div>
          </div>
        </PageSection>

        {/* 서비스 상태 목록 */}
        <div className="space-y-3">
          {services.map((service) => {
            const style = STATUS_STYLE[service.status];
            return (
              <PageSection key={service.name}>
                <div className="flex items-center gap-4">
                  <div
                    aria-hidden
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-xl",
                      style.tone,
                    )}
                  >
                    {service.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{service.name}</h3>
                      <Badge className={cn("border-transparent", style.tone)}>
                        {style.label}
                      </Badge>
                    </div>
                    {service.message && (
                      <p className="mt-1 text-muted-foreground">
                        상태: {service.message}
                      </p>
                    )}
                    {service.responseTime !== undefined && (
                      <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                        응답 시간: {service.responseTime}ms
                      </p>
                    )}
                  </div>
                </div>
              </PageSection>
            );
          })}
        </div>

        {/* 안내 정보 */}
        <PageSection title="서버 상태 안내" className="bg-muted/60">
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span
                aria-hidden
                className={cn(
                  "mt-2.5 size-1.5 shrink-0 rounded-full",
                  STATUS_STYLE.healthy.dot,
                )}
              />
              <span>
                <strong>정상:</strong> 서비스가 정상적으로 작동하고 있습니다.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                aria-hidden
                className={cn(
                  "mt-2.5 size-1.5 shrink-0 rounded-full",
                  STATUS_STYLE.unhealthy.dot,
                )}
              />
              <span>
                <strong>오류:</strong> 서비스에 문제가 발생했습니다. 관리자에게
                문의하세요.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                aria-hidden
                className={cn(
                  "mt-2.5 size-1.5 shrink-0 rounded-full",
                  STATUS_STYLE.checking.dot,
                )}
              />
              <span>
                <strong>확인 중:</strong> 서비스 상태를 확인하고 있습니다.
              </span>
            </li>
          </ul>
        </PageSection>
      </main>
    </div>
  );
}
