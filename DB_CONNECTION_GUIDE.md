# TOV Homepage DB Connection 유지 가이드

## 구현된 해결책

### 1. **mysql.ts 개선사항**
- ✅ **getPool()** 함수 추가: 매 쿼리 실행 전 연결 상태 검증
- ✅ **2분 간격 Keep-Alive**: 5분에서 2분으로 단축
- ✅ **Connection ID 추적**: 연결 변경 감지
- ✅ **자동 재연결**: 연결 실패 시 즉시 pool 재생성

### 2. **Health Check API** (`/api/health`)
- **GET**: 연결 상태 확인 및 모니터링
- **POST**: 강제 재연결 (`{"action": "reconnect"}`)
- Connection ID, 메모리 사용량, Pool 상태 제공

### 3. **Middleware 자동 관리**
- 1분마다 백그라운드 health check
- 중요 API (auth, donations) 접근 시 자동 연결 갱신
- DB 집약적 라우트 추적

### 4. **Production Keep-Alive Service**
- 2분마다 연결 체크
- 3회 연속 실패 시 서비스 재시작
- PM2/systemd 자동 관리

## 배포 방법

### 로컬 테스트
```bash
# 빌드 및 실행
npm run build
npm start

# Health check 테스트
curl http://localhost:3000/api/health

# 강제 재연결 테스트
curl -X POST http://localhost:3000/api/health \
  -H "Content-Type: application/json" \
  -d '{"action":"reconnect"}'
```

### Production 서버 설정

1. **코드 배포**
```bash
# 서버 접속
ssh ec2-user@10.0.0.148

# 코드 pull
cd /home/ec2-user/tov-homepage
git pull origin main

# 빌드
npm install
npm run build
```

2. **Keep-Alive Service 설치**
```bash
# 스크립트 복사 및 권한 설정
cp scripts/keep-alive.sh /home/ec2-user/tov-homepage/scripts/
chmod +x /home/ec2-user/tov-homepage/scripts/keep-alive.sh

# systemd 서비스 설치
sudo ./scripts/setup-keepalive-service.sh

# 서비스 상태 확인
sudo systemctl status tov-keepalive
```

3. **PM2 재시작 (사용 중인 경우)**
```bash
pm2 restart tov-homepage
pm2 save
```

## 모니터링

### 실시간 로그 확인
```bash
# Keep-alive 로그
sudo journalctl -u tov-keepalive -f

# 또는
tail -f /var/log/tov-keepalive.log

# Next.js 로그
pm2 logs tov-homepage
```

### 연결 상태 모니터링
```bash
# 연속 모니터링 (10초 간격)
watch -n 10 'curl -s http://localhost:3000/api/health | jq .'
```

### MySQL 연결 확인
```bash
mysql -h [RDS_ENDPOINT] -u admin -p -e "
  SELECT user, COUNT(*) as count
  FROM information_schema.processlist
  WHERE user IN ('tov-client', 'admin')
  GROUP BY user;
"
```

## 문제 해결

### 연결이 계속 끊어질 때
1. Keep-alive 서비스 재시작
   ```bash
   sudo systemctl restart tov-keepalive
   ```

2. 강제 재연결
   ```bash
   curl -X POST http://localhost:3000/api/health \
     -H "Content-Type: application/json" \
     -d '{"action":"reconnect"}'
   ```

3. 전체 서비스 재시작
   ```bash
   pm2 restart tov-homepage
   # 또는
   sudo systemctl restart tov.service
   ```

### 로그 분석
```bash
# 에러 패턴 확인
grep -E "ERROR|FAIL|Lost" /var/log/tov-keepalive.log | tail -20

# Connection ID 변경 추적
grep "Connection ID changed" /var/log/tov-keepalive.log
```

## 주요 파일 위치

- **DB 연결 로직**: `src/infrastructure/database/mysql.ts`
- **Health API**: `src/app/api/health/route.ts`
- **Middleware**: `middleware.ts`
- **Keep-alive Script**: `scripts/keep-alive.sh`
- **Setup Script**: `scripts/setup-keepalive-service.sh`

## 환경변수 확인

`.env` 또는 `.env.production`:
```env
DATABASE_URL=mysql://user:password@host:port/database
DATABASE_HOST=your-rds-endpoint.rds.amazonaws.com
DATABASE_USER=tov-client
DATABASE_PASSWORD=your-password
DATABASE_NAME=tov_prod
NODE_ENV=production
```

## 성능 최적화 설정

현재 t2.micro (1GB RAM) 최적화:
- Connection Pool: 5개 (기존 10개에서 감소)
- Idle Timeout: 30초
- Keep-Alive: 2분 간격
- Connect Timeout: 30초

메모리 부족 시 조정 가능한 값들을 `mysql.ts`에서 수정하세요.