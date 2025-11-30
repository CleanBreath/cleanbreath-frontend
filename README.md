# CleanBreath 🌬️

안양시 금연구역 및 흡연구역 정보를 제공하는 지도 서비스입니다.

## 주요 기능

- 🗺️ 카카오맵 기반 금연/흡연구역 지도
- 🚭 금연구역 마커 표시 (녹색)
- 🚬 흡연구역 마커 표시 (빨간색)
- 📋 구역 목록 조회 및 검색
- ⚖️ 금연구역 관련 법률 정보 제공
- 📍 신규 구역 등록 요청
- 💬 피드백 기능

## 기술 스택

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Motion (Framer Motion)
- Tanstack Query
- Radix UI + shadcn/ui
- Kakao Maps API

## 시작하기

### 환경 변수 설정

`.env.local` 파일에 카카오맵 API 키를 설정하세요:

```env
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/              # 페이지 라우트
│   ├── page.tsx      # 메인 지도 페이지
│   ├── register/     # 구역 등록 페이지
│   └── statute/      # 법률 정보 페이지
├── components/       # 컴포넌트
│   ├── feedback/     # 피드백 모달
│   ├── map/          # 지도 관련
│   ├── sidebar/      # 사이드바
│   └── ui/           # shadcn/ui 컴포넌트
├── api/              # API 클라이언트
├── hooks/            # 커스텀 훅
├── json/             # 정적 데이터 (법률 정보)
└── types/            # 타입 정의
```

## 라이선스

MIT
