import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** 게시판 상세처럼 한국어 원문 데이터를 넣을 때는 `<span lang="ko">`로 감싸 넘긴다 */
  title: React.ReactNode;
  description?: React.ReactNode;
  icon: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  /** lg 이상에서 좁은 사이드 패널(등록 페이지 w-96) 안에 놓일 때. 그 폭에서도 모바일처럼 배지를 숨기고 언어 선택을 아이콘으로 줄인다 */
  inPanel?: boolean;
}

/** 하위 페이지 공통 헤더. 페이지의 유일한 h1을 렌더링한다 */
export function PageHeader({
  title,
  description,
  icon,
  backHref = "/",
  backLabel,
  inPanel = false,
}: PageHeaderProps) {
  const t = useTranslations("common");
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2">
        <Button variant="ghost" size="icon-touch" asChild className="shrink-0">
          <Link href={backHref} aria-label={backLabel ?? t("backHome")}>
            <ArrowLeft className="size-5" aria-hidden />
          </Link>
        </Button>
        {/* 375px에서 언어 선택이 들어갈 자리를 위해 장식 배지는 sm 미만에서 숨김 */}
        <div
          aria-hidden
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary max-sm:hidden [&_svg]:size-5 [&_svg]:stroke-[2.5]",
            inPanel && "lg:hidden",
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg leading-snug font-bold text-balance">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {/* sm 미만(inPanel이면 lg 이상도)은 제목 자리를 위해 아이콘만 */}
        <LocaleSwitcher
          iconOnly
          className={inPanel ? "sm:max-lg:hidden" : "sm:hidden"}
        />
        <LocaleSwitcher
          className={cn("max-sm:hidden", inPanel && "lg:hidden")}
        />
      </div>
    </header>
  );
}
