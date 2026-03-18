# ✅ Vercel 배포 체크리스트

## 📋 배포 전 준비

### 1. 계정 준비
- [ ] Vercel 계정 생성 - [vercel.com/signup](https://vercel.com/signup)
- [ ] GitHub 계정 준비 (Dashboard 배포 시)
- [ ] Supabase 프로젝트 정보 확인

### 2. Supabase 정보 수집
- [ ] Supabase Dashboard 접속
- [ ] Project URL 복사
  ```
  https://uuaebyjxmvymyyvavjer.supabase.co
  ```
- [ ] Anon Key 복사
  - Settings → API → "anon public" 키
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

### 3. 코드 준비
- [ ] Figma Make에서 Export
- [ ] ZIP 파일 압축 해제
- [ ] 터미널에서 프로젝트 폴더로 이동

---

## 🚀 배포 방법 선택

### 방법 A: 자동 스크립트 (추천) ⭐

#### Mac / Linux
```bash
cd /path/to/building-revenue-manager
chmod +x deploy.sh
./deploy.sh
```

#### Windows
```bash
cd C:\path\to\building-revenue-manager
deploy.bat
```

**체크리스트:**
- [ ] 스크립트 실행
- [ ] Vercel 로그인 완료
- [ ] 환경 변수 입력
- [ ] 배포 URL 확인
- [ ] 로그인 테스트

---

### 방법 B: Vercel CLI (수동)

```bash
# 1. CLI 설치
npm install -g vercel

# 2. 로그인
vercel login

# 3. 환경 변수 추가
vercel env add VITE_SUPABASE_URL
# 값: https://uuaebyjxmvymyyvavjer.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# 값: (Supabase Anon Key)

vercel env add NODE_ENV
# 값: production

# 4. 배포
vercel --prod
```

**체크리스트:**
- [ ] Vercel CLI 설치 완료
- [ ] 로그인 성공
- [ ] 환경 변수 3개 추가
- [ ] 배포 성공
- [ ] URL 확인

---

### 방법 C: Vercel Dashboard (GUI)

#### 1단계: GitHub 업로드
```bash
cd /path/to/building-revenue-manager
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/building-revenue-manager.git
git push -u origin main
```

**체크리스트:**
- [ ] GitHub 리포지토리 생성
- [ ] 코드 푸시 완료

#### 2단계: Vercel Import
1. [Vercel Dashboard](https://vercel.com/new) 접속
2. "Add New..." → "Project" 클릭
3. GitHub 리포지토리 선택
4. Import 클릭

**체크리스트:**
- [ ] Vercel에서 리포지토리 찾음
- [ ] Import 성공

#### 3단계: 프로젝트 설정
**Framework Preset:** Vite (자동 감지)

**Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Environment Variables:**
| Key | Value |
|-----|-------|
| VITE_SUPABASE_URL | https://uuaebyjxmvymyyvavjer.supabase.co |
| VITE_SUPABASE_ANON_KEY | (복사한 Anon Key) |
| NODE_ENV | production |

**체크리스트:**
- [ ] Framework 자동 감지됨
- [ ] Build Command 확인
- [ ] 환경 변수 3개 추가
- [ ] "Deploy" 버튼 클릭

#### 4단계: 배포 완료
**체크리스트:**
- [ ] 빌드 로그 확인
- [ ] 배포 성공 메시지
- [ ] URL 클릭하여 접속

---

## 🧪 배포 후 테스트

### 1. 기본 접속 테스트
- [ ] 메인 URL 접속
  ```
  https://building-revenue-manager.vercel.app
  ```
- [ ] `/login` 페이지 접속
- [ ] 페이지 로딩 정상

### 2. 회원가입 테스트
- [ ] 회원가입 탭 클릭
- [ ] 정보 입력
  - 이름: 테스트
  - 이메일: test@example.com
  - 비밀번호: test1234
- [ ] 회원가입 성공
- [ ] 자동 로그인 확인
- [ ] 대시보드 리다이렉트

### 3. 로그인 테스트
- [ ] 로그아웃
- [ ] 로그인 탭에서 재로그인
- [ ] 대시보드 접속 성공

### 4. 기능 테스트
- [ ] 대시보드 차트 정상 표시
- [ ] 계약 관리 페이지 접속
- [ ] 신규 계약 추가
- [ ] 데이터 저장 확인
- [ ] 페이지 새로고침 후 데이터 유지

### 5. API 연결 테스트
- [ ] 브라우저 콘솔 열기 (F12)
- [ ] Network 탭 확인
- [ ] API 호출 성공 (200 OK)
- [ ] 에러 없음

### 6. 반응형 테스트
- [ ] 데스크톱 (1920px)
- [ ] 태블릿 (768px)
- [ ] 모바일 (375px)
- [ ] 모든 기기에서 정상 작동

---

## 🔐 보안 체크

### Supabase 설정
- [ ] RLS (Row Level Security) 활성화 예정
- [ ] API Key가 코드에 노출되지 않음
- [ ] 환경 변수로만 관리
- [ ] Service Role Key는 서버에만 사용

### Vercel 설정
- [ ] HTTPS 자동 적용 확인
- [ ] 환경 변수 암호화 확인
- [ ] 도메인 설정 (선택)

---

## 🌐 추가 설정 (선택)

### 구글 소셜 로그인
- [ ] Google Cloud Console 설정
- [ ] OAuth Client ID 생성
- [ ] Supabase에 Google Provider 추가
- [ ] 테스트 완료

### 커스텀 도메인
- [ ] 도메인 구매
- [ ] Vercel에 도메인 추가
- [ ] DNS 설정 (A, CNAME 레코드)
- [ ] SSL 인증서 자동 발급 확인
- [ ] 도메인 접속 테스트

### 자동 배포 (GitHub 연동 시)
- [ ] main 브랜치 푸시 → 자동 배포
- [ ] 다른 브랜치 → Preview 배포
- [ ] 배포 알림 설정 (Slack/Discord)

---

## 📊 모니터링

### Vercel Analytics
- [ ] Analytics 활성화
- [ ] 방문자 수 확인
- [ ] 페이지뷰 추적

### Speed Insights
- [ ] Speed Insights 활성화
- [ ] Core Web Vitals 확인
- [ ] 성능 최적화 필요 시 개선

### Error Tracking
- [ ] 에러 로그 모니터링
- [ ] Sentry 연동 (선택)

---

## 🎉 완료!

### 배포 성공 확인
- [ ] ✅ 앱이 정상적으로 작동
- [ ] ✅ 로그인/회원가입 성공
- [ ] ✅ 데이터 저장 및 불러오기 정상
- [ ] ✅ 모든 페이지 접근 가능
- [ ] ✅ 에러 없음

### 다음 단계
- [ ] 팀원들에게 URL 공유
- [ ] 실제 데이터 입력 시작
- [ ] 피드백 수집
- [ ] 기능 개선 계획

---

## 🆘 문제 해결

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm install
npm run build

# 성공하면 다시 배포
vercel --prod
```

### 환경 변수 에러
```bash
# 환경 변수 확인
vercel env ls

# 다시 추가
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# 재배포
vercel --prod
```

### 404 에러
- ✅ vercel.json의 rewrites 설정 확인
- ✅ 이미 설정되어 있음!

### API 연결 실패
- Supabase URL 확인
- Anon Key 확인
- CORS 설정 확인 (이미 설정됨)
- Network 탭에서 에러 상세 확인

---

## 📞 지원

### 문서
- [START_HERE.md](./START_HERE.md) - 빠른 시작
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - 상세 가이드
- [QUICK_START.md](./QUICK_START.md) - 5분 가이드

### 커뮤니티
- [Vercel Discord](https://vercel.com/discord)
- [Supabase Discord](https://discord.supabase.com/)

---

**🎯 이 체크리스트를 따라하면 100% 배포 성공!**
