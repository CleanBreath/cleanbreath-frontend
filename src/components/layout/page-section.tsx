import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PageSectionProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  /** 제목 오른쪽에 둘 보조 요소(버튼, 개수 뱃지 등) */
  action?: React.ReactNode;
  className?: string;
  /** 페이지 안 앵커(#data-sources 등)로 쓸 id */
  id?: string;
  /** 제목 태그. 상위 h2 아래에 놓이는 카드는 h3 (기본 h2) */
  headingLevel?: "h2" | "h3";
  children: React.ReactNode;
}

/** 하위 페이지 본문의 카드 섹션. title이 있으면 h2(headingLevel)로 렌더링한다 */
export function PageSection({
  title,
  icon,
  action,
  className,
  id,
  headingLevel: Heading = "h2",
  children,
}: PageSectionProps) {
  return (
    <Card id={id} className={cn("gap-0 py-0 shadow-none", className)}>
      <CardContent className="p-4 sm:p-6">
        {title && (
          <div className="mb-3 flex items-center justify-between gap-3">
            <Heading
              className={cn(
                "flex items-center gap-2 font-semibold text-foreground",
                // 상위 h2 아래 카드의 h3는 한 단계 작게
                Heading === "h3" ? "text-base" : "text-lg",
              )}
            >
              {icon && (
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4"
                >
                  {icon}
                </span>
              )}
              {title}
            </Heading>
            {action}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
