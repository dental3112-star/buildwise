# 빌딩 수익 관리 앱 - 배포 가이드

## 📋 목차
1. [현재 앱 공유하기 (A)](#a-현재-앱-공유하기)
2. [사용자 인증 시스템 (B, C)](#bc-사용자-인증-시스템)
3. [프로덕션 배포 (D)](#d-프로덕션-배포-vercel)
4. [추가 설정](#추가-설정)

---

## A. 현재 앱 공유하기

### Figma Make에서 직접 공유
현재 앱은 Figma Make 환경에서 실행되고 있습니다.

**공유 방법:**
1. 우측 상단의 **"Share"** 버튼 클릭
2. 공유 링크 생성
3. 링크를 다른 사람에게 전달

⚠️ **주의사항:**
- 모든 사용자가 같은 Supabase 데이터베이스를 공유합니다
- 실제 프로덕션에서는 사용자별 데이터 격리가 필요합니다

---

## B, C. 사용자 인증 시스템

### ✅ 이미 구현된 기능
- ✅ 이메일/비밀번호 회원가입 및 로그인
- ✅ 구글 소셜 로그인 (설정 필요)
- ✅ 로그아웃 기능
- ✅ 보호된 라우트 (미로그인 시 자동 리다이렉트)

### 로그인 페이지 접근
```
/login
```

### 구글 소셜 로그인 활성화 방법

1. **Supabase 대시보드 접속**
   ```
   https://supabase.com/dashboard
   ```

2. **프로젝트 선택 후 Authentication 메뉴 이동**

3. **Providers 탭에서 Google 활성화**
   - Google 제공자를 찾아 활성화
   - Client ID와 Client Secret 입력 필요

4. **Google Cloud Console 설정**
   - [Google Cloud Console](https://console.cloud.google.com/) 접속
   - OAuth 2.0 Client ID 생성
   - 승인된 리디렉션 URI 추가:
     ```
     https://uuaebyjxmvymyyvavjer.supabase.co/auth/v1/callback
     ```

5. **상세 가이드**
   - [Supabase 공식 문서](https://supabase.com/docs/guides/auth/social-login/auth-google)

### 카카오 소셜 로그인 추가 (선택사항)

Supabase는 카카오를 직접 지원하지 않지만, 다음 방법으로 구현 가능:
1. Generic OAuth Provider 사용
2. 카카오 REST API 직접 연동
3. Third-party 라이브러리 사용

---

## D. 프로덕션 배포 (Vercel)

### 사전 준비
1. GitHub 계정
2. Vercel 계정 (무료)
3. 도메인 (선택사항)

### 1단계: 코드를 GitHub에 업로드

#### Figma Make에서 코드 다운로드
1. 좌측 상단 메뉴 → **"Export"** 또는 **"Download"**
2. ZIP 파일로 다운로드

#### GitHub 리포지토리 생성
1. [GitHub](https://github.com/) 접속
2. **"New repository"** 클릭
3. 리포지토리 이름: `building-revenue-manager`
4. Public 또는 Private 선택
5. **"Create repository"** 클릭

#### 코드 업로드
```bash
# 터미널에서 실행
cd building-revenue-manager
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/building-revenue-manager.git
git push -u origin main
```

### 2단계: Vercel에 배포

#### Vercel 계정 생성 및 프로젝트 연결
1. [Vercel](https://vercel.com/) 접속
2. **"Sign Up"** → GitHub 계정으로 로그인
3. **"New Project"** 클릭
4. GitHub 리포지토리 선택: `building-revenue-manager`
5. **"Import"** 클릭

#### 환경 변수 설정
Vercel 프로젝트 설정에서 다음 환경 변수 추가:

```env
# Supabase 설정
VITE_SUPABASE_URL=https://uuaebyjxmvymyyvavjer.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# 프로덕션 모드
NODE_ENV=production
```

#### 배포 설정
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### 배포 실행
1. **"Deploy"** 클릭
2. 2-3분 대기
3. 배포 완료 후 자동으로 URL 생성

### 3단계: 커스텀 도메인 연결 (선택사항)

#### 도메인 구매
추천 도메인 등록 업체:
- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://www.godaddy.com/)
- [Gabia](https://www.gabia.com/) (한국)

#### Vercel에 도메인 추가
1. Vercel 프로젝트 → **Settings** → **Domains**
2. 구매한 도메인 입력 (예: `building-manager.com`)
3. **"Add"** 클릭
4. DNS 설정 안내에 따라 도메인 등록 업체에서 설정

#### DNS 설정 예시
도메인 등록 업체의 DNS 관리 페이지에서:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 추가 설정

### SSL/HTTPS
- ✅ Vercel이 자동으로 Let's Encrypt SSL 인증서 제공
- 추가 설정 불필요

### 성능 최적화
Vercel은 다음을 자동으로 제공:
- CDN을 통한 전 세계 배포
- 자동 이미지 최적화
- Edge Functions (필요 시)

### 모니터링
Vercel Dashboard에서 확인 가능:
- 방문자 통계
- 페이지 로딩 속도
- 에러 로그

---

## 사용자별 데이터 격리 구현 (다음 단계)

현재는 모든 사용자가 같은 데이터를 공유합니다. 사용자별 데이터를 분리하려면:

### 백엔드 수정 필요
1. 모든 API에 사용자 인증 체크 추가
2. KV Store의 key에 userId 포함:
   ```
   contract:${userId}:${contractId}
   payment:${userId}:${paymentId}
   ```
3. API에서 userId로 필터링

### 예시 코드
```typescript
// 서버 (index.tsx)
app.get("/make-server-663c61b0/contracts", async (c) => {
  const authHeader = c.req.header("Authorization");
  const user = await getUserFromToken(authHeader);
  
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  const contracts = await kv.getByPrefix(`contract:${user.id}:`);
  return c.json({ contracts: contracts || [] });
});
```

---

## 문제 해결

### 로그인이 안 돼요
- Supabase 대시보드에서 Authentication 활성화 확인
- 회원가입이 제대로 되었는지 확인
- 브라우저 콘솔에서 에러 확인

### 배포 후 데이터가 안 보여요
- Vercel 환경 변수 설정 확인
- Supabase URL과 API Key가 정확한지 확인
- Network 탭에서 API 호출 상태 확인

### 구글 로그인이 안 돼요
- Google Cloud Console에서 OAuth 설정 확인
- Supabase에서 Google Provider 활성화 확인
- 리디렉션 URI가 정확한지 확인

---

## 연락처 및 지원

- **Supabase 문서**: https://supabase.com/docs
- **Vercel 문서**: https://vercel.com/docs
- **React Router 문서**: https://reactrouter.com/

---

## 라이선스

MIT License

---

**🎉 축하합니다! 이제 빌딩 수익 관리 앱을 전 세계와 공유할 수 있습니다!**
