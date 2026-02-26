"use client";

import * as motion from "motion/react-client";
import { X, Code2, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VERSION_INFO = {
  current: "0.3.0",
  versions: [
    {
      version: "0.3.0",
      date: "2025.02",
      developers: ["최현준"],
      changes: [
        "데이터 로딩 속도 대폭 개선 (오프라인 지원)",
        "지도 조작 반응 속도 향상",
        "구역 등록 페이지 개선",
        "법령 정보 페이지 최적화",
        "버전 정보 화면 개선",
        "전반적인 성능 최적화",
      ],
    },
    {
      version: "0.2.0",
      date: "2024.12",
      developers: ["최현준"],
      changes: [
        "아파트 금연구역 지도 표시 기능 추가",
        "법령 정보 페이지 추가",
        "서버 상태 확인 페이지 추가",
        "UI/UX 개선 및 최적화",
      ],
    },
    {
      version: "0.1.0",
      date: "2024.11",
      developers: ["최현준", "문찬수", "김건우", "유현목", "최시헌", "김장환"],
      changes: [
        "금연구역 및 흡연구역 지도 시각화",
        "구역 목록 및 검색 기능",
        "피드백 및 구역 등록 기능",
        "초기 서비스 출시",
      ],
    },
  ],
};

export function VersionModal({ isOpen, onClose }: VersionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex w-full max-w-lg flex-col max-h-[90vh]"
      >
        <Card className="flex flex-col border-0 shadow-2xl overflow-hidden">
          <CardContent className="flex flex-col p-0 overflow-hidden">
            {/* 헤더 */}
            <div className="flex shrink-0 items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Code2 size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-bold">버전 정보</h2>
                  <p className="text-xs text-muted-foreground">
                    CleanBreath v{VERSION_INFO.current}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0"
              >
                <X size={18} />
              </Button>
            </div>

            {/* 버전 목록 */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {VERSION_INFO.versions.map((versionInfo, index) => (
                  <motion.div
                    key={versionInfo.version}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      className={`border-0 shadow-sm ${
                        index === 0
                          ? "bg-linear-to-br from-primary/10 to-primary/5"
                          : "bg-muted/50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                index === 0
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted-foreground/20"
                              }
                            >
                              v{versionInfo.version}
                            </Badge>
                            {index === 0 && (
                              <Badge variant="secondary" className="text-xs">
                                최신
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {versionInfo.date}
                          </span>
                        </div>

                        <Separator className="my-3" />

                        {/* 개발자 */}
                        <div className="mb-3">
                          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            {versionInfo.developers.length === 1 ? (
                              <User size={12} />
                            ) : (
                              <Users size={12} />
                            )}
                            <span>개발자</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {versionInfo.developers.map((dev) => (
                              <Badge
                                key={dev}
                                variant="secondary"
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
                            주요 변경사항
                          </p>
                          <ul className="space-y-1.5">
                            {versionInfo.changes.map((change, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                                <span>{change}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* 하단 */}
            <div className="shrink-0 border-t p-4 text-center">
              <p className="text-xs text-muted-foreground">
                © 2024 BlueSky Team. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
