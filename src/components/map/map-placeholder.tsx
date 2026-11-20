import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * 지도 스크립트·타일이 오기 전 첫 페인트용 자리표시자 (자체 SVG 1KB 남짓, 외부 요청 없음).
 * 지도 영역을 absolute로 덮기만 해서 레이아웃을 바꾸지 않는다.
 * 라벨을 읽어 주는 live region(role="status")은 호출부가 항상 렌더해 둔다 (이 컴포넌트와 함께 생기고 사라지면 낭독이 불안정)
 */
export function MapPlaceholder({
  label,
  isError = false,
}: {
  label: string;
  /** 로드 실패 문구는 길어 여러 줄로 감기므로 알약 대신 둥근 사각형으로 */
  isError?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#eef1f3]">
      <Image
        src="/images/map-placeholder.svg"
        alt=""
        fill
        unoptimized
        preload
        sizes="100vw"
        className="object-cover"
      />
      {/* w-max: absolute left-1/2의 기본 너비는 지도 폭의 절반까지라 긴 문구가 일찍 줄바꿈된다 */}
      <p
        className={cn(
          "absolute top-1/2 left-1/2 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 bg-background/90 px-4 py-2 text-balance text-center text-muted-foreground text-sm shadow-sm",
          isError ? "rounded-xl" : "rounded-full",
        )}
      >
        {label}
      </p>
    </div>
  );
}
