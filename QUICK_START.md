# 🚀 빠른 시작 가이드

## A. 지금 바로 공유하기 (5초)

### Figma Make에서 공유
1. 우측 상단 **"Share"** 버튼 클릭
2. 링크 복사
3. 친구/동료에게 전달

✅ **완료!** 하지만 모든 사용자가 같은 데이터를 봅니다.

---

## B. 이메일 로그인 (이미 완료!)

### 사용 방법
1. `/login` 페이지 접속
2. **회원가입** 탭 클릭
3. 정보 입력:
   - 이름: 홍길동
   - 이메일: your@email.com
   - 비밀번호: 6자 이상
4. **회원가입** 버튼 클릭
5. 자동 로그인 → 대시보드로 이동

### 로그인
- 등록한 이메일과 비밀번호로 로그인
- 토큰은 localStorage에 안전하게 저장

---

## C. 구글 소셜 로그인 (설정 필요)

### 활성화 단계
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 → **Authentication** → **Providers**
3. **Google** 찾아서 활성화
4. Google Cloud Console에서 OAuth 설정:
   - [Google Cloud Console](https://console.cloud.google.com/)
   - OAuth 2.0 Client ID 생성
   - 리디렉션 URI: `https://uuaebyjxmvymyyvavjer.supabase.co/auth/v1/callback`
5. Client ID와 Secret을 Supabase에 입력

### 사용 방법
1. `/login` 페이지에서 **"구글로 로그인"** 클릭
2. 구글 계정 선택
3. 권한 승인
4. 자동 로그인 → 대시보드로 이동

📖 **상세 가이드**: [Supabase 공식 문서](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

## D. Vercel 배포 (15분)

### 1단계: 코드 다운로드
1. 좌측 메뉴 → **Export** 클릭
2. ZIP 파일 다운로드
3. 압축 해제

### 2단계: GitHub 업로드
```bash
cd building-revenue-manager
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/building-revenue-manager.git
git push -u origin main
```

### 3단계: Vercel 배포
1. [Vercel](https://vercel.com/) 접속
2. **"New Project"** 클릭
3. GitHub 리포지토리 선택
4. **"Deploy"** 클릭
5. 2-3분 대기

### 4단계: 완료!
```
https://building-revenue-manager.vercel.app
```

🎉 **축하합니다!** 이제 전 세계 어디서나 접속 가능합니다.

---

## 📊 데이터 확인

### 샘플 데이터
최초 로그인 시 자동 생성:
- 계약 2건
- 납입 내역 2건
- 수입 1건
- 지출 1건
- 알림 1건

### 직접 데이터 추가
1. **계약 관리** → **"신규 계약 등록"**
2. **납입 추적** → **"납입 기록 추가"**
3. **수익 계산** → **"수입 추가"** / **"지출 추가"**

---

## 🔐 보안 체크리스트

- ✅ 강력한 비밀번호 사용 (8자 이상, 특수문자 포함)
- ✅ 정기적인 비밀번호 변경
- ✅ 민감한 데이터는 암호화
- ✅ HTTPS 연결 확인

---

## ⚡ 빠른 팁

### 키보드 단축키
- `/` - 검색 (준비 중)
- `Ctrl + S` - 저장 (자동 저장)
- `ESC` - 대화상자 닫기

### 모바일 사용
- 📱 모바일 브라우저에서도 완벽하게 작동
- 홈 화면에 추가하면 앱처럼 사용 가능

### 데이터 백업
- **설정** → **데이터 관리** → **내보내기**
- JSON 파일로 저장
- 정기적인 백업 권장

---

## 🆘 문제 해결

### 로그인이 안 돼요
```
브라우저 콘솔 열기 (F12)
→ Console 탭에서 에러 확인
→ 페이지 새로고침 (Ctrl + F5)
```

### 데이터가 안 보여요
```
네트워크 탭 확인
→ API 호출 실패 여부 확인
→ Supabase 서버 상태 확인
```

### 차트가 안 나와요
```
브라우저 캐시 삭제
→ 페이지 새로고침
→ 다른 브라우저에서 테스트
```

---

## 📞 지원

### 즉시 도움받기
1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - 상세 배포 가이드
2. [README.md](./README.md) - 전체 문서
3. GitHub Issues - 버그 리포트

### 커뮤니티
- Discord (준비 중)
- Slack (준비 중)

---

**🎯 다음 단계**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)에서 더 자세한 배포 방법을 확인하세요!
