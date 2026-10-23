import { MapPinOff } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

// 루트의 canonical·og:url·robots(index)를 물려받지 않도록 비움 (noindex는 Next가 404에 자동 삽입)
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("errors.notFoundPage");
  return {
    title: t("title"),
    alternates: null,
    openGraph: null,
    robots: null,
  };
}

export default function NotFound() {
  const t = useTranslations("errors.notFoundPage");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div
        aria-hidden
        className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
      >
        <MapPinOff size={28} />
      </div>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="text-base text-muted-foreground">{t("description")}</p>
      <Button size="touch" asChild>
        <Link href="/">{t("home")}</Link>
      </Button>
    </main>
  );
}
