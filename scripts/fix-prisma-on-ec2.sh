#!/bin/bash

# EC2에서 Prisma 클라이언트 재생성 스크립트
# 사용법: EC2에서 이 스크립트 실행

echo "Fixing Prisma client on EC2..."

# 앱 디렉토리로 이동
cd /apps/tov-homepage/current

# Prisma 클라이언트 생성
echo "Generating Prisma client..."
npx prisma generate

# 서비스 재시작
echo "Restarting service..."
sudo systemctl restart tov-homepage

# 상태 확인
sleep 3
sudo systemctl status tov-homepage --no-pager

echo "Done! Check the logs with: sudo journalctl -u tov-homepage -f"