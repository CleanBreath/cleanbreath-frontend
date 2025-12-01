"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import * as motion from "motion/react-client";
import {
  ArrowLeft,
  Activity,
  Server,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { checkServerHealth } from "@/api";

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
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkHealth = async () => {
    setIsRefreshing(true);
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
    } catch (error) {
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
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkHealth();

    // 30초마다 자동으로 헬스 체크
    const interval = setInterval(() => {
      checkHealth();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const allHealthy = services.every((s) => s.status === "healthy");
  const anyUnhealthy = services.some((s) => s.status === "unhealthy");

  return (
    <div className="flex min-h-dvh flex-col bg-linear-to-b from-background to-muted/30">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 p-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Activity size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="font-bold">서버 상태</h1>
              <p className="text-xs text-muted-foreground">시스템 헬스 체크</p>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mx-auto w-full max-w-3xl flex-1 p-4">
        {/* 전체 상태 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className={`mb-6 border-0 shadow-sm ${
              allHealthy
                ? "bg-linear-to-br from-green-500/10 to-green-500/5"
                : anyUnhealthy
                ? "bg-linear-to-br from-red-500/10 to-red-500/5"
                : "bg-linear-to-br from-yellow-500/10 to-yellow-500/5"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                    allHealthy
                      ? "bg-green-500"
                      : anyUnhealthy
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {allHealthy ? (
                    <CheckCircle2 size={32} className="text-white" />
                  ) : anyUnhealthy ? (
                    <XCircle size={32} className="text-white" />
                  ) : (
                    <AlertCircle size={32} className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    {allHealthy
                      ? "모든 시스템 정상"
                      : anyUnhealthy
                      ? "시스템 오류 발생"
                      : "시스템 확인 중"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {allHealthy
                      ? "모든 서비스가 정상적으로 작동하고 있습니다."
                      : anyUnhealthy
                      ? "일부 서비스에 문제가 발생했습니다."
                      : "시스템 상태를 확인하고 있습니다."}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={12} />
                    <span>
                      마지막 확인: {lastChecked.toLocaleTimeString("ko-KR")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 서비스 상태 목록 */}
        <div className="space-y-3">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        service.status === "healthy"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : service.status === "unhealthy"
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <Badge
                          className={
                            service.status === "healthy"
                              ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300"
                              : service.status === "unhealthy"
                              ? "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-300"
                          }
                        >
                          {service.status === "healthy"
                            ? "정상"
                            : service.status === "unhealthy"
                            ? "오류"
                            : "확인 중"}
                        </Badge>
                      </div>
                      {service.message && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          상태: {service.message}
                        </p>
                      )}
                      {service.responseTime !== undefined && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          응답 시간: {service.responseTime}ms
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* 안내 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border-0 bg-muted/50 shadow-sm">
            <CardContent className="p-4">
              <h3 className="mb-2 font-semibold">서버 상태 안내</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  <span>
                    <strong>정상:</strong> 서비스가 정상적으로 작동하고
                    있습니다.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>
                    <strong>오류:</strong> 서비스에 문제가 발생했습니다.
                    관리자에게 문의하세요.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
                  <span>
                    <strong>확인 중:</strong> 서비스 상태를 확인하고 있습니다.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
