# ⚠️ Figma Make에서 Vercel로 배포하는 방법

## 🔴 중요한 사실

**Figma Make는 개발 환경입니다.**

- ❌ Figma Make 내에서 직접 Vercel에 배포할 수 없습니다
- ❌ Figma Make 서버에서 `vercel` 명령어를 실행할 수 없습니다
- ❌ 여기서 배포 스크립트를 실행해도 작동하지 않습니다

## ✅ 해결 방법

**로컬 컴퓨터에서 배포해야 합니다!**

---

## 📥 단계별 가이드

### 1️⃣ Figma Make에서 프로젝트 다운로드

1. **Figma Make 좌측 메뉴** 클릭
2. **"Export"** 또는 **"Download"** 버튼 찾기
3. **ZIP 파일 다운로드**
4. ZIP 파일을 컴퓨터에 **압축 해제**

```
다운로드 위치 예시:
- Mac: ~/Downloads/building-revenue-manager
- Windows: C:\Users\YourName\Downloads\building-revenue-manager
```

---

### 2️⃣ 터미널/CMD 열기

#### Mac
1. **Spotlight** 열기 (Cmd + Space)
2. "Terminal" 입력
3. Enter

#### Windows
1. **시작 메뉴** 클릭
2. "PowerShell" 또는 "CMD" 검색
3. 실행

---

### 3️⃣ 프로젝트 폴더로 이동

```bash
# Mac 예시
cd ~/Downloads/building-revenue-manager

# Windows 예시
cd C:\Users\YourName\Downloads\building-revenue-manager
```

---

### 4️⃣ 배포 방법 선택

#### 옵션 A: 자동 스크립트 (⭐ 추천)

**Mac / Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```bash
deploy.bat
```
또는 `deploy.bat` 파일을 **더블클릭**

스크립트가 자동으로:
- ✅ Vercel CLI 설치 확인
- ✅ 로그인 처리
- ✅ 환경 변수 설정
- ✅ 빌드 및 배포

---

#### 옵션 B: 수동 명령어

```bash
# 1. Vercel CLI 설치 (처음만)
npm install -g vercel

# 2. 로그인
vercel login

# 3. 배포
vercel --prod
```

배포 중 환경 변수 입력 요청:
- **VITE_SUPABASE_URL**: `https://uuaebyjxmvymyyvavjer.supabase.co`
- **VITE_SUPABASE_ANON_KEY**: [Supabase에서 복사](#supabase-anon-key-찾기)
- **NODE_ENV**: `production`

---

#### 옵션 C: GitHub + Vercel Dashboard

**더 안정적이지만 시간이 조금 더 걸립니다.**

1. **GitHub 리포지토리 생성**
   - https://github.com/new
   - 리포지토리 이름: `building-revenue-manager`

2. **코드 업로드**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/building-revenue-manager.git
   git push -u origin main
   ```

3. **Vercel에서 Import**
   - https://vercel.com/new
   - "Import Git Repository" 선택
   - GitHub 리포지토리 선택

4. **환경 변수 설정**
   - `VITE_SUPABASE_URL`: `https://uuaebyjxmvymyyvavjer.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: [아래 참조](#supabase-anon-key-찾기)
   - `NODE_ENV`: `production`

5. **Deploy 클릭**

---

## 🔑 Supabase Anon Key 찾기

### 방법 1: Supabase Dashboard

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택
3. **Settings** → **API** 메뉴
4. **"anon public"** 키 복사

```
예시:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
```

### 방법 2: Figma Make 코드에서

프로젝트의 `/utils/supabase/info.tsx` 파일을 확인하세요.
(하지만 보안상 Dashboard에서 확인하는 것을 권장)

---

## ✅ 배포 완료 확인

### 성공 시 출력 예시

```
✅ Production: https://building-revenue-manager-abc123.vercel.app
```

### 테스트

1. **URL 접속**
2. **/login 페이지 이동**
3. **회원가입 테스트**
   - 이름: 테스트
   - 이메일: test@example.com
   - 비밀번호: test1234
4. **대시보드 확인**
5. **데이터 저장 테스트**

---

## 🎉 공유하기

배포 완료 후:

1. **URL 복사**
   ```
   https://building-revenue-manager-abc123.vercel.app
   ```

2. **팀원/친구에게 전달**

3. **각자 회원가입하여 사용**

⚠️ 현재는 모든 사용자가 같은 데이터를 공유합니다.

---

## 🐛 문제 해결

### "npm: command not found"

**Node.js가 설치되어 있지 않습니다.**

- **Mac**: `brew install node`
- **Windows**: https://nodejs.org 다운로드

### "vercel: command not found"

```bash
npm install -g vercel
```

### "Build failed"

```bash
# 로컬에서 빌드 테스트
npm install
npm run build

# 성공하면
vercel --prod
```

### "Permission denied: deploy.sh"

```bash
# Mac/Linux
chmod +x deploy.sh
./deploy.sh
```

### 환경 변수 에러

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add NODE_ENV
vercel --prod
```

---

## 📚 추가 문서

자세한 내용은 다음 파일을 참고하세요:

- **START_HERE.md** - 배포 시작 가이드
- **FINAL_DEPLOYMENT_GUIDE.md** - 완전한 배포 가이드
- **VERCEL_DEPLOY.md** - Vercel 전용 가이드
- **DEPLOYMENT_CHECKLIST.md** - 배포 체크리스트
- **DEPLOY_NOW.md** - 즉시 배포 가이드

---

## ❓ 자주 묻는 질문

### Q: Figma Make에서 직접 배포할 수 없나요?

**A:** 아니요. Figma Make는 프리뷰 환경으로, 실제 배포는 로컬 컴퓨터에서 진행해야 합니다.

### Q: 배포에 돈이 드나요?

**A:** Vercel 무료 플랜으로 충분히 사용 가능합니다. (Hobby Plan)

### Q: GitHub 계정이 필수인가요?

**A:** 아니요. Vercel CLI로도 배포 가능합니다. 하지만 GitHub 연동 시 자동 배포 등 편리한 기능을 사용할 수 있습니다.

### Q: 배포 후 수정은 어떻게 하나요?

**GitHub 연동 시:**
```bash
git add .
git commit -m "Update"
git push
# Vercel이 자동으로 재배포!
```

**CLI 사용 시:**
```bash
vercel --prod
```

### Q: 도메인 연결은 어떻게 하나요?

**A:** `VERCEL_DEPLOY.md`의 "커스텀 도메인 연결" 섹션을 참고하세요.

---

## 🎯 요약

```
1. Figma Make에서 다운로드 (Export → ZIP)
   ↓
2. 로컬 컴퓨터에서 압축 해제
   ↓
3. 터미널/CMD 열기
   ↓
4. 프로젝트 폴더로 이동
   ↓
5. deploy.sh 또는 deploy.bat 실행
   ↓
6. 배포 완료!
```

---

## 💡 다음 단계

배포 완료 후:

- [ ] 실제 빌딩 데이터 입력
- [ ] 팀원들에게 URL 공유
- [ ] 구글 소셜 로그인 설정 (선택)
- [ ] 커스텀 도메인 연결 (선택)

---

**🚀 성공을 기원합니다!**

문의사항이 있으시면 관련 문서를 참고하시거나, GitHub Issues를 이용해주세요.

---

**Made with ❤️ using Figma Make + Vercel + Supabase**
