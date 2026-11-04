import Image from "next/image";

/**
 * 지도 스크립트·타일이 오기 전 첫 페인트용 자리표시자 (자체 SVG 1KB 남짓, 외부 요청 없음).
 * 지도 영역을 absolute로 덮기만 해서 레이아웃을 바꾸지 않는다
 */
export function MapPlaceholder({ label }: { label: string }) {
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
      <p
        role="status"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/90 px-4 py-2 text-muted-foreground text-sm shadow-sm"
      >
        {label}
      </p>
    </div>
  );
}
