#!/bin/bash

# Prisma 환경별 설정 스크립트

ENV=${1:-dev}
ACTION=${2:-setup}

echo "🔧 Prisma Setup - Environment: $ENV, Action: $ACTION"

case $ENV in
  "dev"|"local")
    case $ACTION in
      "setup")
        echo "📦 Setting up Prisma for development..."
        npx prisma generate
        npx prisma migrate dev
        ;;
      "reset")
        echo "🔄 Resetting development database..."
        npx prisma migrate reset
        ;;
      "push")
        echo "⚡ Quick push for development (no migration)..."
        npx prisma db push
        ;;
    esac
    ;;
    
  "production"|"prod")
    case $ACTION in
      "setup")
        echo "📦 Setting up Prisma for production..."
        npx prisma generate
        npx prisma migrate deploy
        ;;
      "generate")
        echo "🏗️ Generating Prisma Client only..."
        npx prisma generate
        ;;
      *)
        echo "❌ Invalid action for production. Use 'setup' or 'generate'"
        exit 1
        ;;
    esac
    ;;
    
  "existing")
    echo "🔄 Setting up Prisma with existing database..."
    npx prisma db pull
    npx prisma generate
    echo "⚠️  Run 'npx prisma migrate dev --name init --create-only' to create baseline"
    ;;
    
  *)
    echo "❌ Unknown environment: $ENV"
    echo "Usage: ./scripts/prisma-setup.sh [dev|production|existing] [setup|reset|push|generate]"
    exit 1
    ;;
esac

echo "✅ Prisma setup complete!"