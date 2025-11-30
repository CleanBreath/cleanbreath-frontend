"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as motion from "motion/react-client";
import {
  ArrowLeft,
  Scale,
  Building2,
  GraduationCap,
  Stethoscope,
  Users,
  BookOpen,
  Baby,
  Bus,
  Factory,
  Store,
  Hotel,
  Dumbbell,
  Heart,
  Bath,
  Gamepad2,
  UtensilsCrossed,
  BookMarked,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import statuteData from "@/json/statute.json";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ReactNode> = {
  "정부,지방청사": <Building2 size={20} />,
  "학교,유치원": <GraduationCap size={20} />,
  의료기관: <Stethoscope size={20} />,
  청소년시설: <Users size={20} />,
  노인시설: <Heart size={20} />,
  도서관: <BookOpen size={20} />,
  "어린이 시설": <Baby size={20} />,
  학원: <BookMarked size={20} />,
  "교통관련 시설": <Bus size={20} />,
  대형건물: <Building2 size={20} />,
  공장: <Factory size={20} />,
  "대규모 점포": <Store size={20} />,
  관광숙박업소: <Hotel size={20} />,
  체육시설: <Dumbbell size={20} />,
  "사회복지 시설": <Heart size={20} />,
  목욕장: <Bath size={20} />,
  "게임 PC방": <Gamepad2 size={20} />,
  음식점: <UtensilsCrossed size={20} />,
  만화방: <BookMarked size={20} />,
};

export default function StatutePage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
              <Scale size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="font-bold">금연구역 관련 법률</h1>
              <p className="text-xs text-muted-foreground">
                국민건강증진법 시행규칙
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <ScrollArea className="flex-1">
        <main className="mx-auto max-w-3xl p-4">
          {/* 안내 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6 border-0 bg-linear-to-br from-primary/10 to-primary/5 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  아래는 <strong>국민건강증진법</strong>에 따른 금연구역 지정
                  시설 및 관련 규정입니다. 각 시설 유형별로 금연구역 지정 범위와
                  흡연실 설치 가능 여부를 확인할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* 법률 목록 */}
          <div className="space-y-3">
            {statuteData.map((statute, index) => (
              <motion.div
                key={statute.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 0.5),
                }}
              >
                <Card
                  className={cn(
                    "cursor-pointer border-0 shadow-sm transition-all hover:shadow-md",
                    expandedIndex === index && "ring-2 ring-primary/20"
                  )}
                  onClick={() => toggleExpand(index)}
                >
                  <CardContent className="p-4">
                    {/* 카테고리 헤더 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          {categoryIcons[statute.category] || (
                            <Building2 size={20} />
                          )}
                        </div>
                        <div>
                          <h2 className="font-semibold">{statute.category}</h2>
                          <p className="text-xs text-muted-foreground">
                            {statute.designated_no_smoking_areas.length}개 항목
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        {expandedIndex === index ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </Button>
                    </div>

                    {/* 확장된 내용 */}
                    {expandedIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <Separator className="mb-4" />

                        {/* 지정 금연구역 */}
                        <div className="mb-4">
                          <h3 className="mb-2 text-sm font-medium text-primary">
                            지정 금연구역
                          </h3>
                          <div className="space-y-2">
                            {statute.designated_no_smoking_areas.map(
                              (area, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2 rounded-lg bg-muted/50 p-2"
                                >
                                  <Badge
                                    variant="secondary"
                                    className="mt-0.5 shrink-0 px-1.5 py-0.5 text-[10px]"
                                  >
                                    {i + 1}
                                  </Badge>
                                  <p className="text-sm text-muted-foreground">
                                    {area}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* 세부 내용 */}
                        <div>
                          <h3 className="mb-2 text-sm font-medium text-primary">
                            세부 규정
                          </h3>
                          <div className="space-y-2">
                            {statute.content.map((content, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 rounded-lg bg-green-50 p-2 dark:bg-green-950/30"
                              >
                                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                                <p className="text-sm text-muted-foreground">
                                  {content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* 하단 안내 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="mt-6 rounded-lg bg-muted/50 p-4 text-center"
          >
            <p className="text-xs text-muted-foreground">
              본 내용은 참고용이며, 정확한 법률 내용은 관련 법령을 확인해주세요.
            </p>
          </motion.div>
        </main>
      </ScrollArea>
    </div>
  );
}
