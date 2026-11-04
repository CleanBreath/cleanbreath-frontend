// 공공데이터 roadAddress에서 서울 구 이름을 읽는다. 대부분 "서울특별시 <구> <도로명>"이지만
// 원본에 "서울 구로구", "서을특별시 금천구", "서울특별시 종로구새문안로3길"처럼 표기가 흔들리는 행이 있다
const SEOUL_GU = [
  "종로구",
  "중구",
  "용산구",
  "성동구",
  "광진구",
  "동대문구",
  "중랑구",
  "성북구",
  "강북구",
  "도봉구",
  "노원구",
  "은평구",
  "서대문구",
  "마포구",
  "양천구",
  "강서구",
  "구로구",
  "금천구",
  "영등포구",
  "동작구",
  "관악구",
  "서초구",
  "강남구",
  "송파구",
  "강동구",
] as const;

const SEOUL_GU_RE = new RegExp(
  `^(?:서울특별시|서을특별시|서울시|서울)\\s*(${SEOUL_GU.join("|")})`,
);

/** 서울 주소면 구 이름("강남구"), 아니면 null */
export function parseSeoulGu(roadAddress: string | null): string | null {
  if (!roadAddress) return null;
  return SEOUL_GU_RE.exec(roadAddress.trim())?.[1] ?? null;
}
