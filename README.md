# 🏢 빌딩 수익 관리 앱

빌딩 임대 수익을 쉽고 정확하게 관리하는 웹 애플리케이션

## ✨ 주요 기능

### 1. 📊 수익 대시보드
- 월별 임대 수익, 지출, 실수익 자동 계산
- 인터랙티브 차트와 그래프
- 주요 지표 실시간 모니터링

### 2. 📄 계약 관리
- 임대차 계약 등록 및 관리
- 계약 만료 자동 알림 (D-90, D-30, D-7)
- PDF 계약서 업로드 (AI 파싱 기능 예정)
- 계약 상태별 필터링

### 3. 💰 납입 추적
- 월세/관리비 납입 내역 관리
- 미납 자동 감지 및 알림
- 통장 내역 업로드 (자동 분석 예정)
- 납입 현황 대시보드

### 4. 💵 수익 계산
- 수입/지출 상세 관리
- 카테고리별 통계
- 월별 비교 차트
- 세금 안내 및 계산

### 5. 🎯 운영 시뮬레이션
- 6개월 수익 예측
- 6가지 위기 시나리오 시뮬레이션:
  - 공실 발생
  - 수리비 급증
  - 금리 인상
  - 세법 변경
  - 세입자 분쟁
  - 재해/화재
- 시나리오별 대처 방안 제공

### 6. 📈 세금 리포트
- 임대소득세 자동 계산
- 필요경비 관리
- 세금 캘린더
- PDF 리포트 생성

### 7. 🔔 알림 센터
- 계약 만료 알림
- 미납 알림
- 중요 일정 관리

### 8. ⚙️ 설정
- 빌딩 정보 관리
- 알림 설정
- 데이터 내보내기

## 🔐 인증 시스템

- ✅ 이메일/비밀번호 로그인
- ✅ 구글 소셜 로그인 (설정 필요)
- ✅ 사용자별 데이터 격리 (구현 예정)
- ✅ 안전한 세션 관리

## 🚀 시작하기

### 1. 앱 접속
```
현재 Figma Make URL로 접속
또는
/login 페이지에서 회원가입
```

### 2. 회원가입 및 로그인
- **신규 사용자**: 이름, 이메일, 비밀번호 입력하여 회원가입
- **구글 계정**: 구글 소셜 로그인 사용 (설정 후)

### 3. 데이터 초기화
- 최초 로그인 시 샘플 데이터 자동 생성
- 대시보드에서 바로 사용 가능

---

## 🌐 Vercel 배포

### ⚠️ Figma Make에서는 직접 배포 불가

Figma Make는 개발 환경입니다. 실제 배포는 로컬 컴퓨터에서 진행하세요.

### 빠른 배포 (5분)

1. **프로젝트 다운로드**
   - Figma Make → Export → ZIP 다운로드

2. **자동 스크립트 실행**
   ```bash
   # Mac/Linux
   chmod +x deploy.sh && ./deploy.sh
   
   # Windows
   deploy.bat
   ```

3. **완료!** URL이 출력됩니다.

### 상세 배포 가이드

- **[START_HERE.md](./START_HERE.md)** - 여기서 시작
- **[FINAL_DEPLOYMENT_GUIDE.md](./FINAL_DEPLOYMENT_GUIDE.md)** - 완전한 배포 가이드
- **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** - Vercel 전용 가이드
- **[DEPLOY_NOW.md](./DEPLOY_NOW.md)** - 즉시 배포
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - 체크리스트

## 🛠️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Tailwind CSS v4** - 스타일링
- **React Router 7** - 라우팅
- **Recharts** - 차트 라이브러리
- **Radix UI** - 접근성 높은 컴포넌트
- **Sonner** - 토스트 알림

### Backend
- **Supabase** - 백엔드 및 인증
- **Hono** - Edge Function 웹 프레임워크
- **KV Store** - 데이터 저장소

### 배포
- **Vercel** - 프론트엔드 호스팅
- **Supabase Edge Functions** - 서버리스 백엔드

## 📱 반응형 디자인

- ✅ 데스크톱 (1920px+)
- ✅ 태블릿 (768px+)
- ✅ 모바일 (375px+)

## 🔮 로드맵

### 1단계 (완료) ✅
- 핵심 기능 구현
- Supabase 연동
- 사용자 인증

### 2단계 (진행 중) 🚧
- **사용자별 데이터 격리**
- PDF 계약서 AI 파싱
- 통장 내역 자동 분석
- 이메일 알림

### 3단계 (예정) 📅
- 모바일 앱 (React Native)
- 고급 분석 및 리포트
- 다중 빌딩 관리
- 세무사/회계사 연동

## 📖 상세 문서

- [배포 가이드](./DEPLOYMENT_GUIDE.md) - A, B, C, D 모든 배포 방법
- [API 문서](./API_DOCS.md) - 백엔드 API 명세 (추후 제공)

## 🤝 기여하기

이 프로젝트는 오픈소스입니다. 기여를 환영합니다!

### 개발 환경 설정
```bash
# 저장소 클론
git clone https://github.com/YOUR_USERNAME/building-revenue-manager.git

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 📄 라이선스

MIT License

## 🙋‍♂️ 문의

- 버그 리포트: GitHub Issues
- 기능 제안: GitHub Discussions

---

**만든이:** Figma Make
**버전:** 1.0.0 (MVP)
**최종 업데이트:** 2026년 3월 18일