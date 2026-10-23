"use client";

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Server,
  XCircle,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { checkServerHealth } from "@/api";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 상태색은 토큰만 사용: 정상=primary, 오류=destructive, 확인 중=muted
const STATUS_STYLE = {
  healthy: {
    tone: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  unhealthy: {
    tone: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
  checking: {
    tone: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
} as const;

interface ServiceStatus {
  /** health.services 아래 서비스 이름 키 */
  name: "api";
  status: "healthy" | "unhealthy" | "checking";
  /** 백엔드가 준 상태 값 (UP 등) */
  message?: string;
  /** 연결 자체가 실패했는지. 문구는 화면 언어로 표시 */
  failed?: boolean;
  responseTime?: number;
  icon: React.ReactNode;
}

export default function HealthPage() {
  const t = useTranslations("health");
  const format = useFormatter();
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "api",
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
            name: "api",
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
            name: "api",
            status: "unhealthy",
            failed: true,
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
        title={t("header.title")}
        description={t("header.description")}
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
                {t(`overall.${overall}.title`)}
              </h2>
              <p className="text-muted-foreground">
                {t(`overall.${overall}.description`)}
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} aria-hidden />
                <span className="tabular-nums">
                  {t("lastChecked", {
                    time: lastChecked
                      ? format.dateTime(lastChecked, { timeStyle: "medium" })
                      : "-",
                  })}
                </span>
              </div>
            </div>
          </div>
        </PageSection>

        {/* 서비스 상태 목록 */}
        <div className="space-y-3">
          {services.map((service) => {
            const style = STATUS_STYLE[service.status];
            const message = service.failed
              ? t("connectionFailed")
              : service.message;
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
                      <h3 className="font-semibold">
                        {t(`services.${service.name}`)}
                      </h3>
                      <Badge className={cn("border-transparent", style.tone)}>
                        {t(`status.${service.status}`)}
                      </Badge>
                    </div>
                    {message && (
                      <p className="mt-1 text-muted-foreground">
                        {t("statusLine", { message })}
                      </p>
                    )}
                    {service.responseTime !== undefined && (
                      <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                        {t("responseTime", { ms: service.responseTime })}
                      </p>
                    )}
                  </div>
                </div>
              </PageSection>
            );
          })}
        </div>

        {/* 안내 정보 */}
        <PageSection title={t("guide.title")} className="bg-muted/60">
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
                {t.rich("guide.healthy", {
                  b: (chunks) => <strong>{chunks}</strong>,
                })}
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
                {t.rich("guide.unhealthy", {
                  b: (chunks) => <strong>{chunks}</strong>,
                })}
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
                {t.rich("guide.checking", {
                  b: (chunks) => <strong>{chunks}</strong>,
                })}
              </span>
            </li>
          </ul>
        </PageSection>
      </main>
    </div>
  );
}
