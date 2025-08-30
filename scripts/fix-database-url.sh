#!/bin/bash

# EC2에서 DATABASE_URL 문제 해결 스크립트
# 사용법: EC2에서 이 스크립트 실행

echo "Checking DATABASE_URL configuration..."

cd /apps/tov-homepage/current

# 현재 환경변수 확인
echo "Current DATABASE_URL in .env:"
grep DATABASE_URL .env

# systemd 서비스에서 환경변수 확인
echo -e "\nChecking systemd service environment:"
sudo systemctl show tov-homepage | grep -E "Environment|DATABASE"

# 프로세스의 실제 환경변수 확인
echo -e "\nChecking running process environment:"
PID=$(pgrep -f "node server.js" | head -1)
if [ ! -z "$PID" ]; then
    sudo cat /proc/$PID/environ | tr '\0' '\n' | grep DATABASE_URL
else
    echo "Process not found"
fi

# DATABASE_URL 형식 확인
echo -e "\n=== Verifying DATABASE_URL format ==="
if [ -f .env ]; then
    DB_URL=$(grep DATABASE_URL .env | cut -d '=' -f2-)
    echo "DATABASE_URL value: $DB_URL"
    
    if [[ ! "$DB_URL" =~ ^mysql:// ]]; then
        echo "ERROR: DATABASE_URL does not start with mysql://"
        echo "Expected format: mysql://username:password@host:port/database"
        
        # 가능한 수정사항 제안
        if [[ "$DB_URL" =~ ^\"(.*)\"$ ]]; then
            echo "WARNING: DATABASE_URL has quotes. Removing quotes..."
            sed -i 's/DATABASE_URL=".*"/DATABASE_URL='${BASH_REMATCH[1]}'/' .env
        fi
    else
        echo "DATABASE_URL format looks correct"
    fi
fi

# 환경변수 파일 권한 확인
echo -e "\n=== Checking file permissions ==="
ls -la .env

# Prisma 클라이언트 재생성 제안
echo -e "\n=== Suggested fixes ==="
echo "1. Check .env file and ensure DATABASE_URL starts with mysql://"
echo "2. Remove any quotes around the DATABASE_URL value"
echo "3. Run: npx prisma generate"
echo "4. Restart service: sudo systemctl restart tov-homepage"

echo -e "\nExample correct format:"
echo "DATABASE_URL=mysql://username:password@hostname:3306/database_name"