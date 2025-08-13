#!/bin/bash

echo "🔧 로컬 데이터베이스 설정 스크립트"
echo "================================"

# MySQL 설치 확인
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL이 설치되어 있지 않습니다."
    echo "📦 Homebrew로 MySQL을 설치하시겠습니까? (y/n)"
    read -r response
    if [[ "$response" == "y" ]]; then
        brew install mysql
        brew services start mysql
    else
        echo "MySQL을 먼저 설치해주세요."
        exit 1
    fi
fi

echo "✅ MySQL이 설치되어 있습니다."

# MySQL 서비스 상태 확인
if brew services list | grep mysql | grep started > /dev/null; then
    echo "✅ MySQL 서비스가 실행 중입니다."
else
    echo "🔄 MySQL 서비스를 시작합니다..."
    brew services start mysql
fi

# 데이터베이스 생성
echo ""
echo "📊 데이터베이스 생성"
echo "MySQL root 비밀번호를 입력하세요 (없으면 엔터):"
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS tov_homepage;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ 데이터베이스 'tov_homepage'가 생성되었습니다."
else
    echo "❌ 데이터베이스 생성 실패. MySQL 접속 정보를 확인하세요."
    exit 1
fi

# .env 파일 생성
echo ""
echo "🔐 환경 변수 설정"
if [ ! -f .env ]; then
    echo "MySQL root 비밀번호를 입력하세요 (없으면 엔터):"
    read -s mysql_password
    
    if [ -z "$mysql_password" ]; then
        DATABASE_URL="mysql://root:@localhost:3306/tov_homepage"
    else
        DATABASE_URL="mysql://root:${mysql_password}@localhost:3306/tov_homepage"
    fi
    
    cat > .env << EOF
# Database
DATABASE_URL="${DATABASE_URL}"

# Auth
JWT_ACCESS_SECRET="dev-access-token-secret-change-in-production"
JWT_REFRESH_SECRET="dev-refresh-token-secret-change-in-production"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
EOF
    echo "✅ .env 파일이 생성되었습니다."
else
    echo "ℹ️  .env 파일이 이미 존재합니다. DATABASE_URL을 확인하세요."
fi

# Prisma 설정
echo ""
echo "🔄 Prisma 설정 중..."
npx prisma generate
npx prisma db push

echo ""
echo "✨ 로컬 데이터베이스 설정이 완료되었습니다!"
echo "🚀 'npm run dev'로 개발 서버를 시작할 수 있습니다."