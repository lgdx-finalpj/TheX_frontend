# The Ex Frontend
사이트: https://the-x-frontend.vercel.app/

<img width="1581" height="509" alt="readme" src="https://github.com/user-attachments/assets/0570aeb0-2557-4ce1-944f-3a8674d05e8f" />


LG전자 스마트홈 시나리오를 가정한 모바일 중심 프론트엔드 프로젝트입니다.  
React + TypeScript + Vite 기반으로 작성되어 있으며, 홈 화면에서 디바이스 탐색, 커피머신 레시피 관리, 스마트 루틴/무드 커스텀 생성까지 하나의 흐름으로 연결됩니다.

이 프로젝트는 단순 화면 목업이 아니라 실제 백엔드 API와 연결되는 구조를 포함하고 있습니다.

## 1. 프로젝트 개요

### 핵심 목표

- 사용자가 보유한 스마트 디바이스를 한 화면에서 확인하고 이동할 수 있도록 구성
- 커피머신 중심의 레시피 조회, 저장, 공유, 직접 생성 기능 제공
- 여러 제품 설정을 묶어 실행할 수 있는 스마트 루틴 / 무드 커스텀 UX 제공

### 주요 도메인

- 홈
- 디바이스 목록 및 그룹화
- 커피머신 상세
- 레시피 탐색/저장/공유/생성
- 스마트 루틴
- 무드 커스텀
- 조명/스피커 설정

## 2. 주요 기능

### 홈 화면

- 사용자의 등록 디바이스 목록을 조회해 홈 카드로 노출
- 선택한 디바이스 종류에 따라 상세 페이지로 라우팅
- 스마트 루틴 진입 버튼 제공
- 하단 탭 네비게이션 제공

### 디바이스 관리

- `/auth/my-product-list` 응답을 기반으로 사용자의 디바이스 목록 조회
- 로컬 디바이스 카탈로그와 매핑해 아이콘, 상태, 상세 경로 구성
- 여러 디바이스를 선택해 제품 그룹 생성 가능
- 그룹 생성 시 `/product/create-group`, `/product/group` API 순차 호출

### 커피머신

- 커피머신 상태 카드 표시
- 실시간 센서 API(`/sensor/latest`)를 이용한 온도/습도 표시
- AI 추천 커피 API(`/coffee/recipes/ai-recommend`) 연동
- 기본 레시피, 인기 레시피, 내 레시피, 직접 만들기 흐름으로 연결

### 레시피 기능

- 기본 레시피 조회
- 인기 레시피 조회
- 내 레시피 조회 및 상세 보기
- 레시피 저장
- 레시피 공유 상태 토글
- 커피 레시피 직접 생성
- 논커피(차/스무디) 레시피 직접 생성

### 스마트 루틴 / 무드 커스텀

- 내가 저장한 무드 목록 조회
- 공유된 추천 무드 조회
- 무드 저장, 공유, 실행 기능 제공
- 무드 이름 입력 -> 무드 선택 -> 제품 선택 -> 제품별 설정 -> 적용 순서로 진행
- 최대 3개 제품(커피머신, 조명, 스피커)까지 조합 가능
- 적용 시 제품별 커스텀 API 생성 후 최종 무드 생성 API 호출

## 3. 기술 스택

### 프론트엔드

- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- React Icons

### 개발 도구

- ESLint
- TypeScript Project References

### UI 특성

- 모바일 앱 프레임 중심 레이아웃
- 공통 `MobileLayout` 사용
- 페이지 배경 이미지/테마 컬러 동적 적용
- PWA용 `manifest.json` 포함

## 4. 디렉터리 구조

```text
TheX_frontend/
├─ public/
│  ├─ fonts/
│  ├─ icon-192.png
│  ├─ icon-512.png
│  └─ manifest.json
├─ src/
│  ├─ api/                # Axios 클라이언트와 도메인별 API 함수
│  ├─ assets/             # 이미지, 아이콘, 배경 리소스
│  ├─ components/         # 화면 단위 재사용 컴포넌트
│  ├─ features/           # 커피머신 설정 등 기능 단위 모듈
│  ├─ hooks/              # 사용자 정의 훅
│  ├─ layouts/            # 공통 레이아웃
│  ├─ mocks/              # 디바이스/백엔드 목업 데이터
│  ├─ pages/              # 라우트 대응 페이지
│  ├─ routes/             # 라우터 및 경로 상수
│  ├─ state/              # 무드 커스텀 상태 관리
│  ├─ styles/             # 전역 스타일
│  ├─ types/              # 공통 타입 정의
│  └─ utils/              # 로컬 저장소, 경로 매핑 등 유틸
├─ .env.example
├─ package.json
└─ vite.config.ts
```

## 5. 라우트 구성

### 홈/디바이스

- `/` : 홈
- `/devices` : 디바이스 목록
- `/devices/grouped` : 그룹 디바이스 화면
- `/devices/coffee-machine` : 커피머신 메인
- `/devices/lighting` : 조명 메인
- `/devices/speaker` : 스피커 메인

### 레시피

- `/devices/coffee-machine/view-basic-recipes`
- `/devices/coffee-machine/view-basic-recipes/:recipeId`
- `/devices/coffee-machine/view-popular-recipes`
- `/devices/coffee-machine/view-popular-recipes/:recipeId`
- `/devices/coffee-machine/view-my-recipes`
- `/devices/coffee-machine/view-my-recipes/:recipeId`
- `/devices/coffee-machine/create-recipe/select-category`
- `/devices/coffee-machine/create-recipe/coffee`
- `/devices/coffee-machine/create-recipe/non-coffee/:categoryKey`
- `/devices/coffee-machine/ai-recommended`
- `/devices/coffee-machine/ai-recommended/:recipeId`

### 스마트 루틴 / 무드 커스텀

- `/smartroutine`
- `/smartroutine/create`
- `/smartroutine/create/recipe/coffee-machine`
- `/smartroutine/mood-custom`
- `/smartroutine/mood-custom/name`
- `/smartroutine/mood-custom/mood`
- `/smartroutine/mood-custom/products`
- `/smartroutine/mood-custom/products/:productType`
- 환경 변수 규칙 정리
- 사용자 프로필 API 실제 연결
- 에러 메시지 및 로딩 상태 UX 고도화
- 디바이스 종류 확장 시 카탈로그/매핑 구조 일반화

---

프로젝트 온보딩이 목적이라면, 가장 먼저 `src/routes/Router.tsx`, `src/pages`, `src/api`, `src/state` 순서로 읽는 것을 추천합니다.
