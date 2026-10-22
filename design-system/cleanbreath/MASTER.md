# CleanBreath 디자인 시스템 — MASTER

> 전역 기준 문서. 페이지별 예외는 `pages/<page>.md`에 두고, 있으면 그 파일이 우선한다.
> 근거: ui-ux-pro-max `--design-system` (variance 3 / motion 3 / density 5) 결과 중 검증된 항목 + 기존 코드의 의미 체계.

## 1. 방향 — "Civic Map Utility"

- 스타일: Minimalism & Swiss. 지도가 주인공이고 UI는 지도 위의 도구다.
- 피할 것: 장식용 그라데이션(특히 보라/핑크 AI 그라데이션), 장식 모션, 낮은 대비, 이모지 아이콘, 반투명 블러 남용(블러는 시트/오버레이 배경 구분 용도만).
- 다크 모드: 현재 앱이 `.dark`를 켜지 않으므로 이번 개편 범위는 라이트 모드. 기존 `.dark` 토큰은 지우지 않는다.

## 2. 색상

### 2.1 UI 토큰 (`styles/global.css`, shadcn 변수)

- `--primary`는 기존 teal `oklch(0.48 0.12 195)` 유지 (브랜드 연속성). 흰 글자 대비 4.5:1 이상을 실측으로 확인한다.
- 컴포넌트에 raw hex/임의 색 금지. 반드시 토큰(`bg-primary`, `text-muted-foreground` 등)을 쓴다.
- 본문 텍스트 대비 ≥ 4.5:1, 큰 텍스트·아이콘·컨트롤 경계 ≥ 3:1.

### 2.2 구역 의미 색 (지도 폴리곤/마커 + 범례가 같은 소스를 쓴다)

기존 의미를 **유지**한다(사용자가 이미 학습한 범례). 정의는 한 모듈(예: `src/lib/zone-style.ts`)로 모으고 `naver-map.tsx`, `detail-naver-map.tsx`, 범례 UI가 모두 여기서 읽는다.

| 타입                 | 의미                    | 색 계열             | 색 외 구분 수단    |
| -------------------- | ----------------------- | ------------------- | ------------------ |
| `NON_SMOKING_ZONE`   | 금연구역                | 초록                | 금연 아이콘        |
| `SMOKING_ZONE_OPEN`  | 개방형 흡연구역         | 주황                | 흡연 아이콘 + 실선 |
| `SMOKING_ZONE_CLOSE` | 폐쇄형 흡연구역(흡연실) | 빨강                | 흡연 아이콘 + 실선 |
| `SMOKING_ZONE_LINE`  | 라인형 흡연구역         | 보라                | 흡연 아이콘 + 실선 |
| `*_IMPLICIT`         | 암묵적(비공식) 구역     | 같은 계열의 연한 톤 | **점선 테두리**    |
| 아파트(공동주택)     | 금연아파트              | 파랑                | 건물 아이콘        |
- 색만으로 구분하지 않는다(`color-not-only`): 범례·카드·목록에는 항상 아이콘 + 텍스트 라벨을 함께 둔다.
- 지도 폴리곤 fill은 낮은 불투명도, stroke는 지도 타일 대비 3:1 이상.

## 3. 타이포그래피

- 서체: **Pretendard Variable** (self-host, dynamic subset — 외부 CDN CSS 금지). 폴백: `system-ui, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`.
- 스케일(px): 12 / 14 / 16 / 18 / 20 / 24. 12px 미만 금지. 모바일 본문·폼 입력 16px.
- 굵기: 제목 600–700, 본문 400, 라벨 500. 줄간격 본문 1.5–1.7.
- 숫자 데이터(개수, 날짜)는 `tabular-nums`.

## 4. 간격 · 모양 · 레이어

- 간격: 4/8 리듬 (Tailwind 1·2·3·4·6·8). 섹션 간 24/32.
- 반경: 기존 `--radius: 0.75rem` 유지. 칩·pill은 `rounded-full`.
- 그림자: 지도 위 떠 있는 요소만 `shadow-md` 한 단계, 시트는 `shadow-lg` 한 단계. 임의 그림자 값 금지.
- z-index 스케일: 지도 0 · 지도 위 컨트롤 10 · 플로팅 버튼/칩 20 · 바텀시트/사이드바 30 · 배너 40 · 모달/다이얼로그 50 · 토스트 60.

## 5. 레이아웃 패턴

### 홈(지도)

- **모바일(<1024px)**: 전체 화면 지도 + **바텀 시트** 1개.
  - 스냅: 접힘(핸들 + 요약 한 줄) / 반 / 전체. 시트 안에 서비스 소개·목록·범례·법령 링크가 들어간다(기존 사이드바 콘텐츠 재배치, SEO용 서버 렌더 텍스트와 H1은 반드시 유지).
  - 드래그 외에 버튼(핸들 탭/토글)으로도 스냅 변경 가능(`dragging-alternative`), 키보드 조작 가능, 내부 스크롤과 드래그 충돌 없음, `overscroll-behavior: contain`.
  - safe-area 하단 여백(`env(safe-area-inset-bottom)`) 반영.
- **데스크톱(≥1024px)**: 왼쪽 사이드바 유지(접기 가능).
- **상단 오버레이**: 필터 칩 행(금연/흡연/아파트 등 기존 AreaToggle 기능) — 각 칩 높이 ≥ 44px(모바일), `aria-pressed`로 상태 노출, 아이콘 + 텍스트.
- **플로팅 버튼 정리**: 주 CTA 1개만 지도 위에(예: 등록된 구역 보기/내 위치 등 기존 기능 중 하나). 버전 정보·피드백 등 보조 동작은 시트/사이드바 메뉴로 이동. 기존 기능은 하나도 제거하지 않는다(위치만 이동).

### 하위 페이지 (statute, about, board, board/[id], register, health)

- 공통 헤더: sticky, 뒤로가기(44px) + 아이콘 배지 + `h1` 제목 + 보조 설명. `max-w-3xl` 본문.
- 카드 섹션: `Card` + 섹션 제목 `h2`. 본문 16px.

## 6. 모션

- 수준 낮음. 허용: 시트 스냅, 카드/모달 진입(opacity + 작은 translate), 칩 상태 전환. 지속시간 150–250ms, 퇴장은 진입의 60–70%.
- `prefers-reduced-motion: reduce`에서 비필수 모션 제거(`motion` 라이브러리의 reduced motion 설정 또는 CSS).
- transform/opacity만 애니메이션. width/height/top/left 애니메이션 금지.

## 7. 접근성 체크 (배포 전 필수)

- 터치 타깃 ≥ 44×44px, 인접 타깃 간 8px 이상.
- 아이콘 전용 버튼은 `aria-label`. 텍스트 옆 장식 아이콘은 `aria-hidden`.
- 포커스 링 보이기(`focus-visible:ring`), 고정 UI가 포커스를 가리지 않기.
- 페이지당 `h1` 하나, 제목 단계 건너뛰지 않기.
- 375px에서 가로 스크롤 없음.
