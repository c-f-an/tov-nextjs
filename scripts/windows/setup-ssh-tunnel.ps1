# SSH 터널링 설정 스크립트 (Windows PowerShell)
# 사용법: .\scripts\windows\setup-ssh-tunnel.ps1

$SSH_HOST = "43.203.123.181"
$SSH_PORT = "22"
$SSH_USER = "ubuntu"
$SSH_KEY_PATH = "C:\.ssh\TFAN_SEOUL.pem"
$LOCAL_PORT = "3307"
$RDS_ENDPOINT = "ptax-prod-rds.cnec2c6ca6bh.ap-northeast-2.rds.amazonaws.com"
$RDS_PORT = "3306"

# SSH 키 파일 존재 및 권한 확인
if (-not (Test-Path $SSH_KEY_PATH)) {
    Write-Host "❌ SSH key file not found at: $SSH_KEY_PATH" -ForegroundColor Red
    Write-Host "Please ensure the SSH key file exists at the specified location." -ForegroundColor Yellow
    exit 1
}

# 권한 확인 (간단한 체크)
$acl = Get-Acl $SSH_KEY_PATH
$accessRules = $acl.Access | Where-Object { $_.IdentityReference -notmatch $env:USERNAME }
if ($accessRules.Count -gt 0) {
    Write-Host "⚠️  SSH key permissions may be too open!" -ForegroundColor Yellow
    Write-Host "Run the following command as Administrator to fix permissions:" -ForegroundColor Yellow
    Write-Host "  .\scripts\windows\fix-ssh-permissions.ps1" -ForegroundColor Cyan
    Write-Host ""
    $response = Read-Host "Do you want to continue anyway? (y/n)"
    if ($response -ne 'y') {
        exit 1
    }
}

Write-Host "🚇 Setting up SSH tunnel for MySQL connection..." -ForegroundColor Green
Write-Host "📍 SSH Host: $SSH_HOST" -ForegroundColor Yellow
Write-Host "👤 SSH User: $SSH_USER" -ForegroundColor Yellow
Write-Host "🔑 SSH Key: $SSH_KEY_PATH" -ForegroundColor Yellow
Write-Host "🌐 Local Port: $LOCAL_PORT -> RDS: ${RDS_ENDPOINT}:${RDS_PORT}" -ForegroundColor Yellow
Write-Host ""

# 기존 터널이 있다면 종료
$existingProcess = Get-NetTCPConnection -LocalPort $LOCAL_PORT -ErrorAction SilentlyContinue
if ($existingProcess) {
    $pid = $existingProcess.OwningProcess
    Write-Host "⚠️  Killing existing process on port $LOCAL_PORT (PID: $pid)" -ForegroundColor Yellow
    Stop-Process -Id $pid -Force
}

# SSH 터널 생성
Write-Host "🔧 Creating SSH tunnel..." -ForegroundColor Cyan
Write-Host "📌 Keep this terminal open to maintain the tunnel connection" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Your .env file should have:" -ForegroundColor Magenta
Write-Host "DATABASE_URL=`"mysql://tov-client:A0oMDPDoRn3H6Y0@localhost:$LOCAL_PORT/tov_prod`"" -ForegroundColor Magenta
Write-Host ""
Write-Host "🛑 Press Ctrl+C to stop the tunnel" -ForegroundColor Red
Write-Host ""
Write-Host "🚇 Tunnel is running..." -ForegroundColor Green

# SSH 터널 실행
# -N: 원격 명령을 실행하지 않음
# -L: 로컬 포트 포워딩
ssh -N -L ${LOCAL_PORT}:${RDS_ENDPOINT}:${RDS_PORT} -i $SSH_KEY_PATH ${SSH_USER}@${SSH_HOST}