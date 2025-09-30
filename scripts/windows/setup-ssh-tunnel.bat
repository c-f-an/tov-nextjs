@echo off
REM SSH 터널링 설정 스크립트 (Windows Batch)
REM 사용법: scripts\windows\setup-ssh-tunnel.bat

set SSH_HOST=43.203.123.181
set SSH_PORT=22
set SSH_USER=ubuntu
set SSH_KEY_PATH=C:\.ssh\TFAN_SEOUL.pem
set LOCAL_PORT=3307
set RDS_ENDPOINT=ptax-prod-rds.cnec2c6ca6bh.ap-northeast-2.rds.amazonaws.com
set RDS_PORT=3306

echo.
echo ===================================================
echo SSH Tunnel Setup for MySQL Connection
echo ===================================================
echo SSH Host: %SSH_HOST%
echo SSH User: %SSH_USER%
echo SSH Key: %SSH_KEY_PATH%
echo Local Port: %LOCAL_PORT% -^> RDS: %RDS_ENDPOINT%:%RDS_PORT%
echo.

REM 기존 포트 사용 확인
netstat -ano | findstr :%LOCAL_PORT% >nul
if %errorlevel%==0 (
    echo WARNING: Port %LOCAL_PORT% is already in use.
    echo Please close any existing connections first.
    echo.
)

echo Creating SSH tunnel...
echo Keep this window open to maintain the tunnel connection
echo.
echo Your .env file should have:
echo DATABASE_URL="mysql://tov-client:A0oMDPDoRn3H6Y0@localhost:%LOCAL_PORT%/tov_prod"
echo.
echo Press Ctrl+C to stop the tunnel
echo.
echo Tunnel is running...
echo.

REM SSH 터널 실행
ssh -N -L %LOCAL_PORT%:%RDS_ENDPOINT%:%RDS_PORT% -i %SSH_KEY_PATH% %SSH_USER%@%SSH_HOST%