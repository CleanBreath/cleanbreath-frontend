import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 루트의 canonical·og:url·robots(index)를 물려받지 않도록 비움 (noindex는 Next가 404에 자동 삽입)
export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  alternates: null,
  openGraph: null,
  robots: null,
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground">
        요청하신 주소가 없거나 이동되었습니다.
      </p>
      <Button asChild>
        <Link href="/">홈으로 이동</Link>
      </Button>
    </main>
  );
}
