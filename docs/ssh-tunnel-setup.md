# SSH 터널링을 통한 데이터베이스 접속 가이드

## 개요
프로덕션 RDS 데이터베이스는 보안상 직접 접속이 불가능하며, SSH 터널링을 통해서만 접속할 수 있습니다.

## 연결 정보

### SSH 접속 정보
- **SSH Host**: 43.203.123.181:22
- **SSH User**: ubuntu
- **SSH Key**: `/Users/leehwayeon/.ssh/AWS/TFAN_SEOUL.pem`

### MySQL 접속 정보
- **MySQL Host**: ptax-prod-rds.cnec2c6ca6bh.ap-northeast-2.rds.amazonaws.com
- **MySQL Port**: 3306
- **Database**: tov_prod
- **Username**: tov-client
- **Password**: A0oMDPDoRn3H6Y0

### 로컬 터널링 설정
- **Local Port**: 3307 (localhost:3307 → RDS:3306)

## 사용 방법

### 1. SSH 터널 생성

**Mac/Linux:**
```bash
./scripts/mac/setup-ssh-tunnel.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\windows\setup-ssh-tunnel.ps1
```

**Windows (Command Prompt):**
```batch
scripts\windows\setup-ssh-tunnel.bat
```

### 2. 터널 연결 확인
```bash
# 데이터베이스 연결 테스트
node scripts/test-db-connection.js

# MySQL 클라이언트로 직접 접속
node scripts/mysql-connect.js
```

### 3. 애플리케이션 실행
```bash
npm run dev
```

## 환경 설정

### .env 파일 설정
로컬 개발 시에는 localhost:3307을 통해 데이터베이스에 접속합니다:

```env
# SSH 터널링을 통한 로컬 접속
DATABASE_URL="mysql://tov-client:A0oMDPDoRn3H6Y0@localhost:3307/tov_prod"

# 직접 접속 (터널링 없이는 작동하지 않음)
# DATABASE_URL="mysql://tov-client:A0oMDPDoRn3H6Y0@ptax-prod-rds.cnec2c6ca6bh.ap-northeast-2.rds.amazonaws.com:3306/tov_prod"
```

## 터널 관리

### 터널 상태 확인
```bash
# 3307 포트 사용 중인 프로세스 확인
lsof -i:3307
```

### 터널 종료
```bash
# 3307 포트의 프로세스 종료
lsof -ti:3307 | xargs kill -9
```

## 문제 해결

### 연결 실패 시 확인사항
1. SSH 키 파일 권한 확인

   **Mac/Linux:**
   ```bash
   chmod 600 /Users/leehwayeon/.ssh/AWS/TFAN_SEOUL.pem
   # Or use the fix script:
   ./scripts/mac/fix-ssh-permissions.sh
   ```

   **Windows (PowerShell as Administrator):**
   ```powershell
   .\scripts\windows\fix-ssh-permissions.ps1
   ```

2. SSH 터널이 실행 중인지 확인
   ```bash
   ps aux | grep ssh | grep 3307
   ```

3. 로컬 3307 포트가 사용 중인지 확인
   ```bash
   lsof -i:3307
   ```

### 일반적인 오류 메시지
- **"Connection refused"**: SSH 터널이 실행되지 않음
- **"Access denied"**: 데이터베이스 사용자 정보 확인 필요
- **"Unknown database"**: 데이터베이스 이름 확인 필요

## 보안 주의사항
- SSH 키 파일을 절대 공유하지 마세요
- 데이터베이스 비밀번호를 코드에 하드코딩하지 마세요
- .env 파일을 git에 커밋하지 마세요 (.gitignore에 포함됨)