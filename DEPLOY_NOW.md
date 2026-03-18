# ⚡ 지금 바로 배포하기

## 🎯 3가지 간단한 방법

---

## 1️⃣ 원클릭 스크립트 (30초)

### Mac / Linux
```bash
chmod +x deploy.sh && ./deploy.sh
```

### Windows (더블클릭)
```
deploy.bat
```

✅ **끝!** 스크립트가 모든 걸 처리합니다.

---

## 2️⃣ 수동 명령어 (1분)

```bash
# Vercel CLI 설치 (처음만)
npm install -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

환경 변수 입력 요청 시:
- `VITE_SUPABASE_URL`: https://uuaebyjxmvymyyvavjer.supabase.co
- `VITE_SUPABASE_ANON_KEY`: (Supabase에서 복사)

✅ **완료!** URL이 출력됩니다.

---

## 3️⃣ npm 스크립트 (Vercel CLI 설치 후)

```bash
npm run deploy
```

✅ **한 줄로 끝!**

---

## 📋 Supabase Anon Key 찾기 (10초)

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택
3. **Settings** → **API**
4. **"anon public"** 키 복사

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎉 배포 완료 후

### URL 확인
```
https://building-revenue-manager-xxx.vercel.app
```

### 테스트
1. `/login` 접속
2. 회원가입
3. 대시보드 확인

### 공유
- URL을 친구/팀원에게 전달
- 각자 회원가입하여 사용

---

## ⚠️ 오류 발생 시

### "vercel: command not found"
```bash
npm install -g vercel
```

### "Build failed"
```bash
npm install
npm run build
# 성공하면
vercel --prod
```

### "Environment variable missing"
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod
```

---

## 📚 더 자세한 가이드

- **초보자**: [START_HERE.md](./START_HERE.md)
- **상세**: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
- **체크리스트**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 💡 다음 단계

### 자동 배포 설정
```bash
# GitHub에 푸시
git push

# Vercel이 자동으로 배포!
```

### 커스텀 도메인
- Vercel Dashboard → Settings → Domains
- 도메인 입력 → DNS 설정

---

**🚀 지금 바로 시작하세요!**

```bash
./deploy.sh
```

또는

```bash
npm run deploy
```
