#!/bin/bash

# EC2에서 DATABASE_URL 문제 빠르게 해결하기
# EC2에서 복사해서 실행

cd /apps/tov-homepage/current

# .env 파일 백업
cp .env .env.backup

# DATABASE_URL에서 큰따옴표 제거
sed -i 's/DATABASE_URL="\(.*\)"/DATABASE_URL=\1/' .env

# 확인
echo "Updated DATABASE_URL:"
grep DATABASE_URL .env

# Prisma 클라이언트 재생성
echo "Regenerating Prisma client..."
npx prisma generate

# 서비스 재시작
echo "Restarting service..."
sudo systemctl restart tov-homepage

# 상태 확인
sleep 3
sudo systemctl status tov-homepage --no-pager

echo "Done! Check logs with: sudo journalctl -u tov-homepage -f"