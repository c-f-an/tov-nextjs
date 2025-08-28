#!/bin/bash

# EC2에서 실행할 배포 스크립트
# Usage: ./deploy-on-ec2.sh

set -e  # 에러 발생시 중단

# 환경 변수
S3_BUCKET_NAME="tov-deploy/production"
APP_DIR="/apps/tov-homepage"
SERVICE_NAME="tov-homepage"

echo "🚀 Starting deployment from S3..."

# 1. 디렉토리 생성
echo "📁 Creating application directory..."
sudo mkdir -p $APP_DIR
cd $APP_DIR

# 2. S3에서 최신 빌드 다운로드
echo "📥 Downloading latest build from S3..."
aws s3 cp s3://${S3_BUCKET_NAME}/deployments/latest.tar.gz ./

# 3. 현재 실행 중인 서비스 중지
echo "🛑 Stopping current service..."
sudo systemctl stop $SERVICE_NAME || true

# 4. 백업 생성
if [ -d "current" ]; then
    echo "💾 Creating backup..."
    sudo mv current backup-$(date +%Y%m%d%H%M%S)
fi

# 5. 새 버전 압축 해제
echo "📦 Extracting new version..."
sudo tar -xzf latest.tar.gz
sudo mv deploy-package current
sudo rm latest.tar.gz

# 6. 권한 설정
echo "🔐 Setting permissions..."
sudo chown -R $USER:$USER $APP_DIR/current

# 7. 프로덕션 의존성 설치
echo "📚 Installing production dependencies..."
cd current
npm install --production

# 8. 환경 변수 설정 (.env 파일 생성)
echo "⚙️ Setting up environment variables..."
cat > .env << 'ENV_FILE'
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL="mysql://tov-client:A0oMDPDoRn3H6Y0@ptax-prod-rds.cnec2c6ca6bh.ap-northeast-2.rds.amazonaws.com:3306/tov_prod"

# Auth
JWT_ACCESS_SECRET="tov-access-token-in-production"
JWT_REFRESH_SECRET="dev-refresh-token-in-production"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
ENV_FILE

# 9. systemd 서비스 생성/업데이트
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null << SERVICE_CONFIG
[Unit]
Description=TOV Homepage Next.js Application
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR/current
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=$SERVICE_NAME
Environment="NODE_ENV=production"
Environment="PORT=3000"

[Install]
WantedBy=multi-user.target
SERVICE_CONFIG

# 10. systemd 재로드 및 서비스 시작
echo "🔄 Reloading systemd and starting service..."
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME

# 11. 서비스 상태 확인
echo "✅ Checking service status..."
sudo systemctl status $SERVICE_NAME --no-pager

# 12. 포트 확인
echo "🌐 Checking if application is running on port 3000..."
sleep 5
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Application is running successfully!"
else
    echo "❌ Application might not be running. Check logs with: sudo journalctl -u $SERVICE_NAME -f"
fi

echo "🎉 Deployment completed!"