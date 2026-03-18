# 📁 프로젝트 구조

## 전체 구조

```
building-revenue-manager/
├── 📄 배포 관련 파일
│   ├── vercel.json                    # Vercel 설정
│   ├── .gitignore                     # Git 제외 파일
│   ├── .env.example                   # 환경 변수 샘플
│   ├── deploy.sh                      # Mac/Linux 배포 스크립트
│   ├── deploy.bat                     # Windows 배포 스크립트
│   └── package.json                   # 프로젝트 설정
│
├── 📚 문서
│   ├── README.md                      # 프로젝트 개요
│   ├── START_HERE.md                  # 여기서 시작
│   ├── FINAL_DEPLOYMENT_GUIDE.md      # 최종 배포 가이드
│   ├── VERCEL_DEPLOY.md               # Vercel 배포 가이드
│   ├── DEPLOY_NOW.md                  # 즉시 배포
│   ├── DEPLOYMENT_GUIDE.md            # 전체 배포 옵션
│   ├── DEPLOYMENT_CHECKLIST.md        # 배포 체크리스트
│   ├── QUICK_START.md                 # 빠른 시작
│   ├── DEPLOY_INSTRUCTIONS.txt        # 배포 안내 (텍스트)
│   └── PROJECT_STRUCTURE.md           # 이 파일
│
├── 📱 소스 코드
│   └── src/
│       ├── app/
│       │   ├── App.tsx                # 앱 진입점
│       │   ├── routes.ts              # 라우팅 설정
│       │   │
│       │   ├── components/            # 재사용 가능한 컴포넌트
│       │   │   ├── Layout.tsx         # 메인 레이아웃
│       │   │   ├── NotificationCenter.tsx
│       │   │   └── ui/                # UI 컴포넌트 라이브러리
│       │   │       ├── button.tsx
│       │   │       ├── card.tsx
│       │   │       ├── dialog.tsx
│       │   │       ├── input.tsx
│       │   │       ├── select.tsx
│       │   │       ├── tabs.tsx
│       │   │       └── ... (30+ 컴포넌트)
│       │   │
│       │   ├── pages/                 # 페이지 컴포넌트
│       │   │   ├── Login.tsx          # 로그인/회원가입 페이지
│       │   │   ├── Dashboard.tsx      # 수익 대시보드
│       │   │   ├── Contracts.tsx      # 계약 관리
│       │   │   ├── Payments.tsx       # 납입 추적
│       │   │   ├── Income.tsx         # 수익 계산
│       │   │   ├── Simulation.tsx     # 운영 시뮬레이션
│       │   │   ├── TaxReport.tsx      # 세금 리포트
│       │   │   ├── Notifications.tsx  # 알림 센터
│       │   │   └── Settings.tsx       # 설정
│       │   │
│       │   └── utils/                 # 유틸리티 함수
│       │       └── api.ts             # API 호출 함수
│       │
│       ├── styles/                    # 스타일 파일
│       │   ├── theme.css              # Tailwind 테마
│       │   └── fonts.css              # 폰트 설정
│       │
│       └── index.html                 # HTML 진입점
│
└── 🔧 백엔드 (Supabase Edge Functions)
    └── supabase/
        └── functions/
            └── server/
                ├── index.tsx          # 메인 서버
                └── kv_store.tsx       # KV 저장소 유틸리티
```

---

## 주요 파일 설명

### 📄 배포 관련

#### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [...],  // SPA 라우팅
  "headers": [...]    // 보안 헤더
}
```
- Vercel 배포 설정
- SPA 라우팅 지원
- 보안 헤더 설정

#### `deploy.sh` / `deploy.bat`
- 자동 배포 스크립트
- Vercel CLI 설치
- 로그인 및 환경 변수 설정
- 빌드 및 배포 자동화

#### `.env.example`
```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
NODE_ENV=production
```
- 환경 변수 템플릿
- 실제 `.env` 파일 생성 시 참고

#### `package.json`
```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "deploy": "vercel --prod",
    "deploy:preview": "vercel"
  }
}
```
- npm 스크립트 정의
- 의존성 관리

---

### 📱 프론트엔드

#### `src/app/App.tsx`
```tsx
import { RouterProvider } from 'react-router';
import { router } from './routes';

function App() {
  return <RouterProvider router={router} />;
}
```
- 앱의 진입점
- React Router 설정

#### `src/app/routes.ts`
```tsx
export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "contracts", Component: Contracts },
      // ...
    ],
  },
]);
```
- 라우팅 설정
- 로그인 보호

#### `src/app/components/Layout.tsx`
- 공통 레이아웃
- 사이드바 네비게이션
- 헤더
- 로그아웃 기능

#### `src/app/pages/Login.tsx`
- 로그인/회원가입 UI
- 이메일 인증
- 구글 소셜 로그인
- Supabase Auth 연동

#### `src/app/pages/Dashboard.tsx`
- 월별 수익/지출 차트
- 주요 지표 카드
- 최근 활동 목록
- Recharts 사용

#### `src/app/pages/Contracts.tsx`
- 계약 목록
- 계약 추가/수정/삭제
- 만료 알림
- 상태별 필터링

#### `src/app/pages/Payments.tsx`
- 납입 내역 관리
- 미납 감지
- 통장 내역 업로드
- 납입 현황 차트

#### `src/app/pages/Income.tsx`
- 수입/지출 관리
- 카테고리별 통계
- 월별 비교
- 세금 계산

#### `src/app/pages/Simulation.tsx`
- 6개월 수익 예측
- 6가지 위기 시나리오
- 시나리오별 대처 방안
- 인터랙티브 차트

#### `src/app/pages/TaxReport.tsx`
- 임대소득세 계산
- 필요경비 관리
- 세금 캘린더
- PDF 리포트 생성

#### `src/app/utils/api.ts`
```tsx
// API 호출 헬퍼 함수
export async function getContracts() {...}
export async function addContract(contract) {...}
export async function getPayments() {...}
// ...
```
- API 호출 중앙 관리
- 에러 처리
- 인증 토큰 관리

---

### 🔧 백엔드

#### `supabase/functions/server/index.tsx`
```tsx
import { Hono } from "npm:hono";

const app = new Hono();

// 인증
app.post("/make-server-663c61b0/signup", async (c) => {...});

// 계약 관리
app.get("/make-server-663c61b0/contracts", async (c) => {...});
app.post("/make-server-663c61b0/contracts", async (c) => {...});

// 납입 관리
app.get("/make-server-663c61b0/payments", async (c) => {...});
// ...

Deno.serve(app.fetch);
```
- Hono 웹 프레임워크
- RESTful API
- Supabase Auth
- CORS 설정

#### `supabase/functions/server/kv_store.tsx`
```tsx
export async function get(key: string) {...}
export async function set(key: string, value: any) {...}
export async function del(key: string) {...}
export async function getByPrefix(prefix: string) {...}
```
- KV Store 유틸리티
- 데이터 저장/조회
- Prefix 기반 필터링

---

## 데이터 흐름

```
사용자
  ↓
[React UI]
  ↓
[API 호출] (utils/api.ts)
  ↓
[Supabase Edge Function] (server/index.tsx)
  ↓
[KV Store] (kv_store.tsx)
  ↓
[Postgres Database]
```

---

## 환경 변수

### 프론트엔드 (.env)
```bash
VITE_SUPABASE_URL=https://uuaebyjxmvymyyvavjer.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
NODE_ENV=production
```

### 백엔드 (Supabase)
```bash
SUPABASE_URL=https://uuaebyjxmvymyyvavjer.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SUPABASE_DB_URL=postgresql://...
```

---

## API 엔드포인트

### 인증
- `POST /signup` - 회원가입

### 계약
- `GET /contracts` - 계약 목록
- `POST /contracts` - 계약 추가
- `PUT /contracts/:id` - 계약 수정
- `DELETE /contracts/:id` - 계약 삭제

### 납입
- `GET /payments` - 납입 내역
- `POST /payments` - 납입 추가
- `PUT /payments/:id` - 납입 수정
- `DELETE /payments/:id` - 납입 삭제

### 수익
- `GET /income` - 수입/지출 목록
- `POST /income` - 수입/지출 추가
- `PUT /income/:id` - 수입/지출 수정
- `DELETE /income/:id` - 수입/지출 삭제

### 알림
- `GET /notifications` - 알림 목록
- `POST /notifications` - 알림 추가
- `PUT /notifications/:id/read` - 알림 읽음 처리
- `DELETE /notifications/:id` - 알림 삭제

---

## 빌드 프로세스

### 개발 모드
```bash
npm run dev
# → Vite 개발 서버 실행
# → http://localhost:5173
```

### 프로덕션 빌드
```bash
npm run build
# → TypeScript 컴파일
# → Vite 빌드
# → dist/ 폴더 생성
```

### 배포
```bash
npm run deploy
# → vercel --prod
# → 빌드 + 배포
# → URL 생성
```

---

## 기술 스택 상세

### Frontend
- **React 18.3.1** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite 6.3.5** - 빌드 도구
- **Tailwind CSS 4.1.12** - 스타일링
- **React Router 7.13.0** - 라우팅
- **Recharts 2.15.2** - 차트
- **Radix UI** - 컴포넌트
- **Supabase Client 2.99.2** - 인증/DB
- **Sonner 2.0.3** - 토스트 알림

### Backend
- **Deno** - 런타임
- **Hono** - 웹 프레임워크
- **Supabase** - BaaS
- **PostgreSQL** - 데이터베이스

### DevOps
- **Vercel** - 프론트엔드 호스팅
- **Supabase Edge Functions** - 백엔드 호스팅
- **Git** - 버전 관리
- **GitHub** - 코드 저장소

---

## 보안

### 프론트엔드
- ✅ XSS 방지 (React 기본 보호)
- ✅ CSRF 토큰
- ✅ HTTPS 강제
- ✅ 보안 헤더 (vercel.json)

### 백엔드
- ✅ JWT 토큰 인증
- ✅ CORS 설정
- ✅ API Key 환경 변수 관리
- ✅ SQL Injection 방지 (Supabase)

### 배포
- ✅ 환경 변수 암호화 (Vercel)
- ✅ SSL/TLS 자동 적용
- ✅ CDN 캐싱

---

## 성능 최적화

### 프론트엔드
- ✅ Code Splitting (React Router)
- ✅ Lazy Loading
- ✅ Tree Shaking (Vite)
- ✅ 이미지 최적화

### 백엔드
- ✅ Edge Functions (글로벌 배포)
- ✅ API 캐싱
- ✅ Database Indexing

---

## 다음 단계

### 개발 예정
- [ ] 사용자별 데이터 격리
- [ ] PDF AI 파싱
- [ ] 이메일 알림
- [ ] 모바일 앱

### 인프라 개선
- [ ] Redis 캐싱
- [ ] CDN 최적화
- [ ] 에러 트래킹 (Sentry)
- [ ] Analytics (Vercel Analytics)

---

**📖 더 자세한 정보는 각 파일의 주석을 참고하세요!**
