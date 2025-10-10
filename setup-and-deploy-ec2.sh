#!/bin/bash

# EC2에서 AWS CLI 설치 및 배포 스크립트
# Usage: ./setup-and-deploy-ec2.sh

set -e  # 에러 발생시 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 EC2 배포 스크립트 시작...${NC}"

# AWS CLI 설치 확인 및 설치
echo -e "${YELLOW}📦 AWS CLI 설치 확인...${NC}"
if ! command -v aws &> /dev/null; then
    echo -e "${YELLOW}AWS CLI가 설치되어 있지 않습니다. 설치를 시작합니다...${NC}"
    
    # OS 확인
    if [ -f /etc/redhat-release ]; then
        # Amazon Linux / Red Hat 계열
        echo "Amazon Linux/RHEL 시스템 감지..."
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        sudo yum install -y unzip
        unzip awscliv2.zip
        sudo ./aws/install
        rm -rf awscliv2.zip aws/
    elif [ -f /etc/debian_version ]; then
        # Ubuntu / Debian 계열
        echo "Ubuntu/Debian 시스템 감지..."
        sudo apt-get update
        sudo apt-get install -y unzip curl
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        rm -rf awscliv2.zip aws/
    else
        echo -e "${RED}❌ 지원하지 않는 OS입니다.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ AWS CLI 설치 완료!${NC}"
else
    echo -e "${GREEN}✅ AWS CLI가 이미 설치되어 있습니다.${NC}"
    aws --version
fi

# AWS 자격 증명 설정
echo -e "${YELLOW}🔐 AWS 자격 증명 설정...${NC}"
echo "AWS Access Key ID와 Secret Access Key가 필요합니다."
echo "EC2 인스턴스에 IAM Role이 연결되어 있다면 Enter를 눌러 건너뛰세요."

read -p "AWS 설정을 진행하시겠습니까? (y/n/skip): " answer
if [ "$answer" = "y" ]; then
    # AWS 자격 증명 입력
    read -p "AWS Access Key ID: " DEPLOY_AWS_ACCESS_KEY_ID
    read -sp "AWS Secret Access Key: " DEPLOY_AWS_SECRET_ACCESS_KEY
    echo
    
    # AWS CLI 설정
    aws configure set aws_access_key_id "$DEPLOY_AWS_ACCESS_KEY_ID"
    aws configure set aws_secret_access_key "$DEPLOY_AWS_SECRET_ACCESS_KEY"
    aws configure set region "ap-northeast-2"
    aws configure set output "json"
    
    echo -e "${GREEN}✅ AWS 자격 증명 설정 완료!${NC}"
else
    echo -e "${YELLOW}⚠️  AWS 자격 증명 설정을 건너뜁니다. IAM Role이 연결되어 있는지 확인하세요.${NC}"
fi

# S3 접근 테스트
echo -e "${YELLOW}🔍 S3 접근 테스트...${NC}"
DEPLOY_S3_BUCKET_NAME="tov-deploy/production"
if aws s3 ls s3://${DEPLOY_S3_BUCKET_NAME}/deployments/ &> /dev/null; then
    echo -e "${GREEN}✅ S3 버킷 접근 성공!${NC}"
else
    echo -e "${RED}❌ S3 버킷에 접근할 수 없습니다. AWS 자격 증명을 확인하세요.${NC}"
    exit 1
fi

# Node.js 설치 확인
echo -e "${YELLOW}📦 Node.js 설치 확인...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js가 설치되어 있지 않습니다. 설치를 시작합니다...${NC}"
    
    # NodeSource 저장소 추가
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
    
    echo -e "${GREEN}✅ Node.js 설치 완료!${NC}"
    node --version
    npm --version
else
    echo -e "${GREEN}✅ Node.js가 이미 설치되어 있습니다.${NC}"
    node --version
fi

# 배포 시작
echo -e "${GREEN}🚀 배포를 시작합니다...${NC}"

# 환경 변수
APP_DIR="/apps/tov-homepage"
SERVICE_NAME="tov-homepage"

# 1. 디렉토리 생성
echo -e "${YELLOW}📁 애플리케이션 디렉토리 생성...${NC}"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR
cd $APP_DIR

# 2. S3에서 최신 빌드 다운로드
echo -e "${YELLOW}📥 S3에서 최신 빌드 다운로드...${NC}"
aws s3 cp s3://${S3_BUCKET_NAME}/deployments/latest.tar.gz ./ --region ap-northeast-2

# 3. 현재 실행 중인 서비스 중지
echo -e "${YELLOW}🛑 현재 서비스 중지...${NC}"
sudo systemctl stop $SERVICE_NAME || true

# 4. 백업 생성
if [ -d "current" ]; then
    echo -e "${YELLOW}💾 백업 생성...${NC}"
    mv current backup-$(date +%Y%m%d%H%M%S)
fi

# 5. 새 버전 압축 해제
echo -e "${YELLOW}📦 새 버전 압축 해제...${NC}"
tar -xzf latest.tar.gz
mv deploy-package current
rm latest.tar.gz

# 6. 권한 설정
echo -e "${YELLOW}🔐 권한 설정...${NC}"
chown -R $USER:$USER $APP_DIR/current

# 7. 프로덕션 의존성 설치
echo -e "${YELLOW}📚 프로덕션 의존성 설치...${NC}"
cd current
npm install --production

# 8. 환경 변수 설정
echo -e "${YELLOW}⚙️  환경 변수 설정...${NC}"
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
echo -e "${YELLOW}🔧 systemd 서비스 생성...${NC}"
sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null << SERVICE_CONFIG
[Unit]
Description=TOV Homepage Next.js Application
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR/current
ExecStart=$(which node) $(which npm) start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME
Environment="NODE_ENV=production"
Environment="PORT=3000"

# 메모리 제한 (필요시)
# MemoryLimit=1G

[Install]
WantedBy=multi-user.target
SERVICE_CONFIG

# 10. systemd 재로드 및 서비스 시작
echo -e "${YELLOW}🔄 systemd 재로드 및 서비스 시작...${NC}"
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME

# 11. 서비스 상태 확인
echo -e "${YELLOW}✅ 서비스 상태 확인...${NC}"
sleep 3
sudo systemctl status $SERVICE_NAME --no-pager

# 12. 포트 확인
echo -e "${YELLOW}🌐 애플리케이션 실행 확인...${NC}"
sleep 5
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ 애플리케이션이 성공적으로 실행되고 있습니다!${NC}"
else
    echo -e "${RED}❌ 애플리케이션이 실행되지 않을 수 있습니다.${NC}"
    echo -e "${YELLOW}로그 확인: sudo journalctl -u $SERVICE_NAME -f${NC}"
fi

# 13. 유용한 명령어 안내
echo -e "${GREEN}🎉 배포가 완료되었습니다!${NC}"
echo -e "${YELLOW}유용한 명령어:${NC}"
echo "  - 서비스 상태: sudo systemctl status $SERVICE_NAME"
echo "  - 서비스 재시작: sudo systemctl restart $SERVICE_NAME"
echo "  - 로그 확인: sudo journalctl -u $SERVICE_NAME -f"
echo "  - 최근 로그: sudo journalctl -u $SERVICE_NAME -n 100"