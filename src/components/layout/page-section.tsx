import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PageSectionProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  /** 제목 오른쪽에 둘 보조 요소(버튼, 개수 뱃지 등) */
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** 하위 페이지 본문의 카드 섹션. title이 있으면 h2로 렌더링한다 */
export function PageSection({
  title,
  icon,
  action,
  className,
  children,
}: PageSectionProps) {
  return (
    <Card className={cn("gap-0 py-0 shadow-none", className)}>
      <CardContent className="p-4 sm:p-6">
        {title && (
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              {icon && (
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4"
                >
                  {icon}
                </span>
              )}
              {title}
            </h2>
            {action}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
