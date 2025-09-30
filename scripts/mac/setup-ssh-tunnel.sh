#!/bin/bash

# SSH 터널링 설정 스크립트
# 사용법: ./scripts/setup-ssh-tunnel.sh

SSH_HOST="43.203.123.181"
SSH_PORT="22"
SSH_USER="ubuntu"
SSH_KEY_PATH="/Users/leehwayeon/.ssh/AWS/TFAN_SEOUL.pem"
LOCAL_PORT="3307"
RDS_ENDPOINT="ptax-prod-rds.cnec2c6ca6bh.ap-northeast-2.rds.amazonaws.com"
RDS_PORT="3306"

echo "🚇 Setting up SSH tunnel for MySQL connection..."
echo "📍 SSH Host: $SSH_HOST"
echo "👤 SSH User: $SSH_USER"
echo "🔑 SSH Key: $SSH_KEY_PATH"
echo "🌐 Local Port: $LOCAL_PORT -> RDS: $RDS_ENDPOINT:$RDS_PORT"
echo ""

# 기존 터널이 있다면 종료
existing_pid=$(lsof -ti:$LOCAL_PORT)
if [ ! -z "$existing_pid" ]; then
    echo "⚠️  Killing existing process on port $LOCAL_PORT (PID: $existing_pid)"
    kill -9 $existing_pid
fi

# SSH 터널 생성
echo "🔧 Creating SSH tunnel..."
echo "📌 Keep this terminal open to maintain the tunnel connection"
echo ""
echo "📝 Your .env file should have:"
echo "DATABASE_URL=\"mysql://tov-client:A0oMDPDoRn3H6Y0@localhost:$LOCAL_PORT/tov_prod\""
echo ""
echo "🛑 Press Ctrl+C to stop the tunnel"
echo ""
echo "🚇 Tunnel is running..."

# -N: 원격 명령을 실행하지 않음
# -L: 로컬 포트 포워딩
# -v: verbose 모드로 상태 표시
ssh -N -L $LOCAL_PORT:$RDS_ENDPOINT:$RDS_PORT -i $SSH_KEY_PATH $SSH_USER@$SSH_HOST -v