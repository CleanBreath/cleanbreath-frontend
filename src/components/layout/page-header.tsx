import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  icon: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

/** 하위 페이지 공통 헤더. 페이지의 유일한 h1을 렌더링한다 */
export function PageHeader({
  title,
  description,
  icon,
  backHref = "/",
  backLabel,
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
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary max-sm:hidden [&_svg]:size-5"
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
        {/* sm 미만은 제목 자리를 위해 아이콘만 */}
        <LocaleSwitcher iconOnly className="sm:hidden" />
        <LocaleSwitcher className="max-sm:hidden" />
      </div>
    </header>
  );
}
