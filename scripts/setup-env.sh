#!/bin/bash

# 환경별 .env 파일 설정 스크립트

ENV=${1:-local}

echo "Setting up environment: $ENV"

case $ENV in
  "local")
    if [ -f .env.local ]; then
      cp .env.local .env
      echo "✅ Local environment configured"
    else
      echo "❌ .env.local file not found!"
      echo "Please create .env.local from .env.example"
      exit 1
    fi
    ;;
  
  "production")
    if [ -f .env.production ]; then
      cp .env.production .env
      echo "✅ Production environment configured"
    else
      echo "❌ .env.production file not found!"
      exit 1
    fi
    ;;
  
  *)
    echo "❌ Unknown environment: $ENV"
    echo "Usage: ./scripts/setup-env.sh [local|production]"
    exit 1
    ;;
esac

# Prisma 클라이언트 재생성
echo "Regenerating Prisma client..."
npx prisma generate

echo "✅ Environment setup complete!"