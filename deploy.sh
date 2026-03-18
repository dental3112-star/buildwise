#!/bin/bash

echo "🚀 빌딩 수익 관리 앱 - Vercel 배포 스크립트"
echo "=============================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI가 설치되어 있지 않습니다."
    echo "📦 설치 중..."
    npm install -g vercel
    echo "✅ Vercel CLI 설치 완료!"
    echo ""
fi

# Check if user is logged in
echo "🔐 Vercel 로그인 확인 중..."
vercel whoami &> /dev/null

if [ $? -ne 0 ]; then
    echo "📝 Vercel 로그인이 필요합니다."
    vercel login
else
    echo "✅ 이미 로그인되어 있습니다."
fi

echo ""
echo "📋 환경 변수 설정"
echo "===================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚙️ .env 파일이 없습니다. 환경 변수를 입력해주세요:"
    echo ""
    
    read -p "Supabase URL (예: https://xxx.supabase.co): " SUPABASE_URL
    read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
    
    echo "VITE_SUPABASE_URL=$SUPABASE_URL" > .env
    echo "VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY" >> .env
    echo "NODE_ENV=production" >> .env
    
    echo "✅ .env 파일 생성 완료!"
else
    echo "✅ .env 파일이 이미 존재합니다."
fi

echo ""
echo "🔨 프로덕션 빌드 시작..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 빌드 실패! package.json과 의존성을 확인해주세요."
    exit 1
fi

echo "✅ 빌드 성공!"
echo ""

echo "🚀 Vercel에 배포 중..."
echo "======================"
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 배포 성공!"
    echo "=============="
    echo ""
    echo "✅ 앱이 성공적으로 배포되었습니다!"
    echo "🌐 URL은 위 출력에서 확인하세요."
    echo ""
    echo "📝 다음 단계:"
    echo "  1. 배포된 URL 접속"
    echo "  2. /login 페이지에서 회원가입"
    echo "  3. 대시보드 확인"
    echo ""
    echo "📖 더 많은 정보: VERCEL_DEPLOY.md"
else
    echo "❌ 배포 실패!"
    echo "VERCEL_DEPLOY.md를 참고하여 문제를 해결해주세요."
    exit 1
fi
