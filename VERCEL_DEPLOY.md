# 🚀 Vercel 자동 배포 가이드

## 📋 사전 준비 체크리스트

- [ ] Vercel 계정 (무료) - [vercel.com/signup](https://vercel.com/signup)
- [ ] GitHub 계정
- [ ] 코드 다운로드 완료
- [ ] Supabase 프로젝트 정보 (URL, Anon Key)

---

## 방법 1: Vercel CLI로 배포 (가장 빠름 - 5분)

### 1단계: Vercel CLI 설치

```bash
# npm을 사용하는 경우
npm install -g vercel

# 또는 yarn을 사용하는 경우
yarn global add vercel
```

### 2단계: 프로젝트 폴더로 이동

```bash
# Figma Make에서 다운로드한 폴더로 이동
cd /path/to/building-revenue-manager
```

### 3단계: Vercel 로그인

```bash
vercel login
```

- 이메일 또는 GitHub로 로그인
- 브라우저가 열리면 인증 완료

### 4단계: 환경 변수 설정

배포 전에 환경 변수를 설정하세요:

```bash
# Supabase URL
vercel env add VITE_SUPABASE_URL
# 값 입력: https://uuaebyjxmvymyyvavjer.supabase.co

# Supabase Anon Key
vercel env add VITE_SUPABASE_ANON_KEY
# 값 입력: (Supabase Dashboard에서 복사)

# Node 환경
vercel env add NODE_ENV
# 값 입력: production
```

### 5단계: 배포!

```bash
# 프로덕션 배포
vercel --prod
```

실행 후:
1. 프로젝트 설정 확인 (Enter 연타로 기본값 사용)
2. 2-3분 대기
3. 배포 완료! URL이 자동으로 표시됩니다

```
✅ Production: https://building-revenue-manager.vercel.app
```

---

## 방법 2: Vercel Dashboard로 배포 (GitHub 연동)

### 1단계: GitHub에 코드 업로드

#### a. GitHub 리포지토리 생성
1. [GitHub](https://github.com/new) 접속
2. 리포지토리 이름: `building-revenue-manager`
3. **Public** 선택 (또는 Private)
4. **Create repository** 클릭

#### b. 코드 업로드
```bash
cd /path/to/building-revenue-manager

# Git 초기화
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Building Revenue Manager"

# GitHub 연결 (YOUR_USERNAME을 본인 계정으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/building-revenue-manager.git

# 푸시
git branch -M main
git push -u origin main
```

### 2단계: Vercel에서 Import

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **"Add New..."** → **"Project"** 클릭
3. **"Import Git Repository"** 선택
4. GitHub 리포지토리 `building-revenue-manager` 선택
5. **"Import"** 클릭

### 3단계: 프로젝트 설정

#### Framework Preset
```
Vite (자동 감지됨)
```

#### Build & Development Settings
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Development Command: npm run dev
```

#### Environment Variables
**"Environment Variables"** 섹션에서 추가:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://uuaebyjxmvymyyvavjer.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | (Supabase Dashboard에서 복사) |
| `NODE_ENV` | `production` |

### 4단계: 배포 시작

1. **"Deploy"** 버튼 클릭
2. 2-3분 대기 (빌드 로그 실시간 확인 가능)
3. ✅ 배포 완료!

---

## 📍 Supabase Anon Key 찾기

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **API** 메뉴
4. **Project API keys** 섹션에서:
   - **URL**: `Project URL` 복사
   - **Anon Key**: `anon` `public` 키 복사 (매우 긴 문자열)

```
예시:
URL: https://uuaebyjxmvymyyvavjer.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...
```

---

## 🎯 배포 후 확인

### 1. URL 접속
```
https://building-revenue-manager.vercel.app
```

### 2. 로그인 테스트
1. `/login` 페이지 접속
2. 회원가입 또는 로그인
3. 대시보드 정상 작동 확인

### 3. API 연결 확인
- 계약 추가 테스트
- 데이터가 Supabase에 저장되는지 확인

---

## 🔄 자동 배포 설정 (GitHub 연동 시)

GitHub 연동으로 배포한 경우:

✅ **main 브랜치에 푸시하면 자동 배포!**

```bash
# 코드 수정 후
git add .
git commit -m "Update feature"
git push

# Vercel이 자동으로 새 버전 배포
```

### Preview 배포
```bash
# 새 브랜치 생성
git checkout -b feature/new-feature

# 코드 수정 후 푸시
git push origin feature/new-feature

# Vercel이 Preview URL 자동 생성
# 예: https://building-revenue-manager-git-feature-new-feature.vercel.app
```

---

## 🌐 커스텀 도메인 연결

### 1단계: 도메인 구매
추천 업체:
- [Namecheap](https://www.namecheap.com/) - 글로벌
- [Gabia](https://www.gabia.com/) - 한국
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) - 저렴

도메인 예시:
- `buildingmanager.com`
- `mybuilding.app`
- `realestate-manager.co`

### 2단계: Vercel에 도메인 추가

1. Vercel 프로젝트 → **Settings** → **Domains**
2. 구매한 도메인 입력
3. **"Add"** 클릭

### 3단계: DNS 설정

Vercel이 제공하는 값을 도메인 등록 업체의 DNS 설정에 추가:

#### A 레코드
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 자동 또는 3600
```

#### CNAME 레코드
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 자동 또는 3600
```

### 4단계: 완료!

- DNS 전파 대기 (5분 ~ 48시간, 보통 10분)
- `https://your-domain.com` 접속
- ✅ SSL 인증서 자동 적용

---

## 📊 Vercel 대시보드 기능

### Analytics
- 방문자 수
- 페이지뷰
- 국가별 트래픽

### Speed Insights
- Core Web Vitals
- 페이지 로딩 속도
- 성능 점수

### Logs
- 실시간 에러 로그
- API 호출 로그
- 빌드 로그

---

## 🐛 문제 해결

### 빌드 실패 시

**증상**: 빌드 중 에러 발생
```bash
Error: Cannot find module 'some-package'
```

**해결**:
1. `package.json` 확인
2. 로컬에서 `npm install` 실행
3. `package-lock.json` 또는 `pnpm-lock.yaml` 커밋
4. 다시 배포

### 환경 변수 에러

**증상**: API 호출 실패, undefined 에러
```
Error: VITE_SUPABASE_URL is not defined
```

**해결**:
1. Vercel Dashboard → Settings → Environment Variables
2. 모든 변수 확인
3. **"Redeploy"** 클릭

### 404 에러 (새로고침 시)

**증상**: `/contracts` 같은 경로에서 새로고침하면 404

**해결**:
✅ 이미 해결됨! `vercel.json`의 rewrites 설정으로 SPA 라우팅 지원

---

## 🎉 성공!

배포가 완료되었습니다!

### 다음 단계
1. ✅ 팀원들에게 URL 공유
2. ✅ 구글 소셜 로그인 설정 (선택사항)
3. ✅ 커스텀 도메인 연결 (선택사항)
4. ✅ 실제 데이터 입력 시작

### URL 예시
```
메인: https://building-revenue-manager.vercel.app
로그인: https://building-revenue-manager.vercel.app/login
대시보드: https://building-revenue-manager.vercel.app/
```

---

## 📞 지원

- [Vercel 문서](https://vercel.com/docs)
- [Vercel 커뮤니티](https://github.com/vercel/vercel/discussions)
- [Discord](https://vercel.com/discord)

---

**🚀 Happy Deploying!**
