import * as motion from "motion/react-client";
import { ChevronDown, ChevronUp, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface StatuteCardProps {
  category: string;
  designatedNoSmokingAreas: string[];
  content: string[];
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

export function StatuteCard({
  category,
  designatedNoSmokingAreas,
  content,
  icon,
  isExpanded,
  onToggle,
  index,
}: StatuteCardProps) {
  return (
    <motion.div
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
          isExpanded && "ring-2 ring-primary/20",
        )}
        onClick={onToggle}
      >
        <CardContent className="p-4">
          {/* 카테고리 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {icon || <Building2 size={20} />}
              </div>
              <div>
                <h2 className="font-semibold">{category}</h2>
                <p className="text-xs text-muted-foreground">
                  {designatedNoSmokingAreas.length}개 항목
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0">
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>

          {/* 확장된 내용 */}
          {isExpanded && (
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
                  {designatedNoSmokingAreas.map((area, i) => (
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
                      <p className="text-sm text-muted-foreground">{area}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 세부 내용 */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-primary">
                  세부 규정
                </h3>
                <div className="space-y-2">
                  {content.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-lg bg-green-50 p-2 dark:bg-green-950/30"
                    >
                      <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
