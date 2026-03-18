# 🎯 여기서 시작하세요!

## 🚀 Vercel 배포 - 3가지 방법

당신에게 맞는 방법을 선택하세요:

---

## 방법 1: 자동 스크립트 (가장 쉬움) ⭐

### Mac / Linux
```bash
chmod +x deploy.sh
./deploy.sh
```

### Windows
```bash
deploy.bat
```

스크립트가 자동으로:
- ✅ Vercel CLI 설치
- ✅ 로그인 처리
- ✅ 환경 변수 설정
- ✅ 빌드 및 배포

**5분 소요**

---

## 방법 2: Vercel CLI (개발자용)

```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 로그인
vercel login

# 3. 배포
vercel --prod
```

**10분 소요**

---

## 방법 3: Vercel Dashboard (GUI)

1. 코드를 GitHub에 업로드
2. [Vercel Dashboard](https://vercel.com/new) 접속
3. GitHub 리포지토리 선택
4. 환경 변수 입력
5. Deploy 버튼 클릭

**15분 소요**

---

## 📋 필요한 정보

배포 전에 준비하세요:

### Supabase 정보
```
URL: https://uuaebyjxmvymyyvavjer.supabase.co
Anon Key: (Supabase Dashboard에서 복사)
```

**Supabase Anon Key 찾는 법:**
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. Settings → API
4. "anon public" 키 복사

---

## ⚡ 빠른 배포 (1분)

이미 Vercel CLI가 설치되어 있다면:

```bash
# 프로젝트 폴더에서
vercel --prod

# 환경 변수 추가 (처음만)
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

---

## 🎉 배포 완료 후

### 1. URL 확인
```
https://building-revenue-manager.vercel.app
```

### 2. 로그인 테스트
```
https://building-revenue-manager.vercel.app/login
```

### 3. 회원가입
- 이름, 이메일, 비밀번호 입력
- 대시보드 자동 이동

### 4. 공유
- URL을 팀원/친구에게 전달
- 각자 회원가입하여 사용

---

## 📚 상세 가이드

더 자세한 정보가 필요하면:

- **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** - 완전한 배포 가이드
- **[QUICK_START.md](./QUICK_START.md)** - 빠른 시작 가이드
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - 전체 배포 옵션
- **[README.md](./README.md)** - 프로젝트 개요

---

## 🐛 문제 해결

### 빌드 실패
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 환경 변수 에러
```bash
# 환경 변수 다시 설정
vercel env rm VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_URL

vercel env rm VITE_SUPABASE_ANON_KEY
vercel env add VITE_SUPABASE_ANON_KEY

# 재배포
vercel --prod
```

### 로그인 안 됨
- Supabase URL과 Anon Key 확인
- 브라우저 콘솔 (F12) 에러 확인
- 페이지 새로고침 (Ctrl + F5)

---

## 💡 팁

### 자동 배포 설정
GitHub에 푸시하면 자동 배포:
```bash
git add .
git commit -m "Update"
git push
# Vercel이 자동으로 배포!
```

### Preview 배포
```bash
vercel
# Preview URL 생성 (프로덕션 아님)
```

### 롤백
```bash
# Vercel Dashboard에서 이전 버전으로 롤백 가능
```

---

## 🎯 다음 단계

배포 후 할 일:

- [ ] 로그인 테스트
- [ ] 계약 추가 테스트
- [ ] 팀원들에게 URL 공유
- [ ] 구글 소셜 로그인 설정 (선택)
- [ ] 커스텀 도메인 연결 (선택)

---

## 📞 도움이 필요하신가요?

1. **자동 스크립트 실행** (가장 쉬움)
   - Mac/Linux: `./deploy.sh`
   - Windows: `deploy.bat`

2. **상세 가이드 읽기**
   - [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

3. **문서 찾아보기**
   - [Vercel 공식 문서](https://vercel.com/docs)

---

**🚀 지금 바로 배포하세요!**

```bash
# Mac/Linux
./deploy.sh

# Windows
deploy.bat

# 또는 수동으로
vercel --prod
```
