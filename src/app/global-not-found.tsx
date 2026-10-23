import { MapPinOff } from "lucide-react";
import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "../../styles/global.css";

// 언어를 알 수 없는 요청(proxy matcher 밖의 경로, 잘못된 [locale] 값)용 404. 레이아웃을 거치지 않아 한국어로 둔다
export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 | CleanBreath",
};

export default function GlobalNotFound() {
  return (
    <html lang="ko">
      <body>
        <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
          <div
            aria-hidden
            className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
          >
            <MapPinOff size={28} />
          </div>
          <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
          <p className="text-base text-muted-foreground">
            요청하신 주소가 없거나 이동되었습니다.
          </p>
          {/* 레이아웃 밖이라 next-intl Link 대신 일반 링크 */}
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            홈으로 이동
          </a>
        </main>
      </body>
    </html>
  );
}
