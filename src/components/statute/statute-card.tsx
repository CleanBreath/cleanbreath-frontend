import { Building2, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  const t = useTranslations("statute.card");
  const panelId = `statute-panel-${index}`;

  return (
    <Card
      className={cn(
        "gap-0 py-0 shadow-none",
        isExpanded && "border-primary/40",
      )}
    >
      {/* 카테고리 헤더: 아코디언 패턴(h2 > button[aria-expanded]) */}
      <h2>
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl p-4 text-left transition-colors hover:bg-muted/50"
        >
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            {icon || <Building2 size={20} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{category}</span>
            <span className="block text-sm font-normal text-muted-foreground tabular-nums">
              {t("itemCount", { count: designatedNoSmokingAreas.length })}
            </span>
          </span>
          <ChevronDown
            size={20}
            aria-hidden
            className={cn(
              "shrink-0 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
          />
        </button>
      </h2>

      {/* 확장된 내용: 크롤러가 읽도록 항상 렌더링하고 접힘은 CSS로 처리 */}
      <div
        id={panelId}
        inert={!isExpanded}
        className={cn(
          "grid transition-opacity duration-200",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 sm:px-6 sm:pb-6">
            <Separator className="mb-4" />

            {/* 지정 금연구역 */}
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-semibold text-primary">
                {t("designatedAreas")}
              </h3>
              <div className="space-y-2">
                {designatedNoSmokingAreas.map((area, i) => (
                  <div
                    key={area}
                    className="flex items-start gap-2 rounded-lg bg-muted/60 p-3"
                  >
                    <Badge
                      variant="secondary"
                      className="mt-0.5 shrink-0 bg-background tabular-nums"
                    >
                      {i + 1}
                    </Badge>
                    <p className="text-muted-foreground">{area}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 세부 내용 */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-primary">
                {t("details")}
              </h3>
              <div className="space-y-2">
                {content.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-lg bg-zone-non-smoking/10 p-3"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-zone-non-smoking-ink"
                    />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
