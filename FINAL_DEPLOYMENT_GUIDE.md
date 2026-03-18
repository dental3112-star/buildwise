# 🎯 최종 배포 가이드 - Vercel

## ⚠️ 중요: Figma Make 환경에서는 배포 불가

**Figma Make**는 개발 환경으로, 여기서 직접 Vercel에 배포할 수 없습니다.
아래 단계를 따라 **로컬 컴퓨터**에서 배포하세요.

---

## 📥 1단계: 프로젝트 다운로드

### Figma Make에서 Export

1. **좌측 메뉴** 클릭
2. **"Export"** 또는 **"Download"** 선택
3. **ZIP 파일** 다운로드
4. ZIP 파일을 원하는 위치에 **압축 해제**

```
예시 경로:
- Mac: ~/Downloads/building-revenue-manager
- Windows: C:\Users\YourName\Downloads\building-revenue-manager
```

---

## 🚀 2단계: 배포 방법 선택

### 옵션 A: 자동 스크립트 (⭐ 추천 - 5분)

가장 쉽고 빠른 방법입니다.

#### Mac / Linux

```bash
# 터미널 열기
cd ~/Downloads/building-revenue-manager

# 스크립트 실행 권한 부여
chmod +x deploy.sh

# 스크립트 실행
./deploy.sh
```

스크립트가 자동으로:
- ✅ Vercel CLI 설치
- ✅ 로그인 처리
- ✅ 환경 변수 설정
- ✅ 빌드 및 배포

#### Windows

```bash
# PowerShell 또는 CMD 열기
cd C:\Users\YourName\Downloads\building-revenue-manager

# 스크립트 실행 (더블클릭도 가능)
deploy.bat
```

---

### 옵션 B: Vercel CLI (수동 - 10분)

개발자에게 익숙한 방법입니다.

```bash
# 1. 프로젝트 폴더로 이동
cd /path/to/building-revenue-manager

# 2. Vercel CLI 설치 (처음만)
npm install -g vercel

# 3. Vercel 로그인
vercel login
# 브라우저가 열리면 GitHub 또는 Email로 로그인

# 4. 환경 변수 설정
vercel env add VITE_SUPABASE_URL
# 값 입력: https://uuaebyjxmvymyyvavjer.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# 값 입력: (아래 "Supabase Key 찾기" 참조)

vercel env add NODE_ENV
# 값 입력: production

# 5. 배포!
vercel --prod

# 또는 npm 스크립트 사용
npm run deploy
```

---

### 옵션 C: Vercel Dashboard (GitHub 연동 - 15분)

GUI를 선호하는 경우 최적입니다.

#### Step 1: GitHub에 코드 업로드

```bash
cd /path/to/building-revenue-manager

# Git 초기화
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Building Revenue Manager"

# GitHub 리포지토리 연결 (사전에 GitHub에서 리포지토리 생성 필요)
git remote add origin https://github.com/YOUR_USERNAME/building-revenue-manager.git

# 푸시
git branch -M main
git push -u origin main
```

#### Step 2: Vercel에서 Import

1. [Vercel Dashboard](https://vercel.com/new) 접속
2. **"Add New..."** → **"Project"** 클릭
3. **"Import Git Repository"** 선택
4. GitHub 리포지토리 `building-revenue-manager` 선택
5. **"Import"** 클릭

#### Step 3: 환경 변수 설정

**Environment Variables** 섹션에서 추가:

```
VITE_SUPABASE_URL = https://uuaebyjxmvymyyvavjer.supabase.co
VITE_SUPABASE_ANON_KEY = (Supabase에서 복사한 Anon Key)
NODE_ENV = production
```

#### Step 4: 배포

1. **"Deploy"** 버튼 클릭
2. 2-3분 대기 (빌드 로그 실시간 확인 가능)
3. ✅ 배포 완료!

---

## 🔑 Supabase Anon Key 찾기

### 방법 1: Supabase Dashboard

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **API** 메뉴
4. **"Project API keys"** 섹션
5. **"anon public"** 키 복사

```
예시:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1YWVieWp4bXZ5bXl5dmF2amVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc5NzQ5MDQsImV4cCI6MjAwMzU1MDkwNH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 방법 2: 프로젝트 코드에서

현재 프로젝트의 `/utils/supabase/info.tsx` 파일에서 확인 가능합니다.
(하지만 보안상 Dashboard에서 확인하는 것을 권장)

---

## ✅ 3단계: 배포 확인

### 배포 성공 시

터미널에 다음과 같은 URL이 출력됩니다:

```
✅ Production: https://building-revenue-manager-xxx.vercel.app
```

### 배포 확인 체크리스트

- [ ] URL 접속 성공
- [ ] `/login` 페이지 정상 표시
- [ ] 회원가입 테스트
  - 이름: 테스트
  - 이메일: test@example.com
  - 비밀번호: test1234
- [ ] 자동 로그인 후 대시보드 이동
- [ ] 차트 및 데이터 정상 표시
- [ ] 계약 추가 테스트
- [ ] 데이터 저장 확인

---

## 🎯 4단계: 공유 및 사용

### URL 공유

배포된 URL을 팀원, 친구, 동료에게 공유:

```
https://building-revenue-manager-xxx.vercel.app
```

### 사용자별 계정

각 사용자는:
1. `/login` 페이지 접속
2. **회원가입** 탭에서 가입
3. 자동 로그인 후 사용

⚠️ **현재는 모든 사용자가 같은 데이터를 공유합니다.**
사용자별 데이터 격리는 다음 단계에서 구현 예정입니다.

---

## 🌐 추가 설정 (선택사항)

### 커스텀 도메인 연결

1. 도메인 구매 (Namecheap, Gabia 등)
2. Vercel Dashboard → **Settings** → **Domains**
3. 도메인 입력 및 DNS 설정
4. 10분 ~ 48시간 후 적용

```
예시:
https://buildingmanager.com
https://mybuilding.app
```

### 구글 소셜 로그인 활성화

1. [Google Cloud Console](https://console.cloud.google.com/)에서 OAuth 설정
2. [Supabase Dashboard](https://supabase.com/dashboard)에서 Google Provider 활성화
3. Client ID와 Secret 입력
4. 테스트

상세 가이드: [Supabase Google Auth](https://supabase.com/docs/guides/auth/social-login/auth-google)

### 자동 배포 설정 (GitHub 연동 시)

GitHub에 푸시하면 Vercel이 자동으로 배포:

```bash
# 코드 수정 후
git add .
git commit -m "Update feature"
git push

# Vercel이 자동으로 새 버전 배포!
```

---

## 🐛 문제 해결

### "vercel: command not found"

```bash
npm install -g vercel
```

Node.js가 설치되어 있지 않다면:
- Mac: `brew install node`
- Windows: [nodejs.org](https://nodejs.org) 다운로드

### "Build failed"

```bash
# 로컬에서 빌드 테스트
npm install
npm run build

# 성공하면
vercel --prod
```

### "Environment variable missing"

```bash
# 환경 변수 다시 추가
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add NODE_ENV

# 재배포
vercel --prod
```

### 로그인 실패

- Supabase URL 확인
- Anon Key 확인
- 브라우저 콘솔 (F12) 에러 확인
- 네트워크 탭에서 API 호출 확인

### 404 에러 (새로고침 시)

✅ 이미 해결됨! `vercel.json` 설정으로 SPA 라우팅 지원

---

## 📊 배포 후 모니터링

### Vercel Dashboard

배포 후 다음 정보를 확인할 수 있습니다:

- **Analytics**: 방문자 수, 페이지뷰
- **Speed Insights**: 로딩 속도, Core Web Vitals
- **Logs**: 에러 로그, API 호출 로그
- **Deployments**: 배포 이력, 롤백 가능

---

## 📚 관련 문서

프로젝트에 포함된 배포 관련 문서:

- **START_HERE.md** - 여기서 시작하세요
- **VERCEL_DEPLOY.md** - 완전한 Vercel 배포 가이드
- **DEPLOY_NOW.md** - 즉시 배포 가이드
- **DEPLOYMENT_CHECKLIST.md** - 배포 체크리스트
- **QUICK_START.md** - 5분 빠른 시작

---

## 🎉 축하합니다!

배포가 완료되었습니다! 이제 빌딩 수익 관리 앱을 전 세계 어디서나 사용할 수 있습니다.

### 다음 단계

- [ ] 실제 빌딩 데이터 입력
- [ ] 팀원들에게 URL 공유
- [ ] 피드백 수집
- [ ] 추가 기능 개발

---

## 📞 지원

### 공식 문서
- [Vercel 문서](https://vercel.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [React Router 문서](https://reactrouter.com/)

### 커뮤니티
- [Vercel Discord](https://vercel.com/discord)
- [Supabase Discord](https://discord.supabase.com/)

---

**🚀 Happy Deploying!**

Made with ❤️ using Figma Make
