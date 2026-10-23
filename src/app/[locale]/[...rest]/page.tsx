import { notFound } from "next/navigation";

// [locale] 안의 모르는 경로(/ja/unknown 등)도 언어별 not-found를 보여 주기 위한 catch-all
export default function CatchAllPage() {
  notFound();
}
