# MySQL 성능 최적화 적용 가이드

## 빠른 시작 (3분 안에 적용)

### 1. 최적화된 MySQL 모듈로 교체
```bash
# 기존 mysql.ts를 백업하고 새 버전 사용
cp src/infrastructure/database/mysql.ts src/infrastructure/database/mysql-backup.ts
cp src/infrastructure/database/mysql-optimized.ts src/infrastructure/database/mysql.ts
```

### 2. 환경 변수 확인 (.env)
```env
# 기존 설정 유지
DATABASE_URL="mysql://user:password@ptax-prod-rds.cnec2c6ca6bh.ap-northeast-2.rds.amazonaws.com:3306/tov_homepage"

# 모니터링용 시크릿 추가 (선택사항)
DB_MONITOR_SECRET="your-secret-key-here"
```

### 3. 대시보드 라우트 최적화
```bash
# 병렬 쿼리 버전으로 교체
cp src/app/api/admin/dashboard/route-optimized.ts src/app/api/admin/dashboard/route.ts
```

### 4. 디버깅 스크립트 실행
```bash
# 현재 성능 상태 확인
npm install dotenv  # 없으면 설치
node scripts/debug-db-performance.js
```

## 주요 변경사항

### 연결 풀 설정 변경
- **connectionLimit**: 10 → 5 (t2.micro에 최적화)
- **idleTimeout**: 60초 → 30초 (빠른 연결 정리)
- **queueLimit**: 0 → 20 (메모리 보호)
- **싱글톤 패턴**: 프로덕션 환경에서 연결 재사용

### 성능 모니터링 추가
- 쿼리 실행 시간 추적
- 느린 쿼리 자동 감지 (1초 이상)
- 연결 풀 상태 실시간 모니터링
- 메모리 사용량 추적

### API 최적화
- 대시보드 쿼리 병렬 실행 (7개 → Promise.all)
- 캐시 헤더 추가 (1분 캐싱)
- 불필요한 데이터 필드 제거

## 필수 인덱스 생성

RDS MySQL에 접속하여 다음 인덱스를 생성하세요:

```sql
-- 1. users 테이블
ALTER TABLE users ADD INDEX idx_status (status);
ALTER TABLE users ADD INDEX idx_last_login (last_login_at);

-- 2. posts 테이블  
ALTER TABLE posts ADD INDEX idx_status (status);
ALTER TABLE posts ADD INDEX idx_created_at (created_at);

-- 3. consultations 테이블
ALTER TABLE consultations ADD INDEX idx_status (status);
ALTER TABLE consultations ADD INDEX idx_user_id (user_id);

-- 4. donations 테이블
ALTER TABLE donations ADD INDEX idx_created_at (created_at);
```

## 모니터링 방법

### 1. 실시간 DB 상태 확인
```bash
# 개발 환경
curl http://localhost:3000/api/admin/db-monitor | jq

# 프로덕션 (시크릿 키 필요)
curl -H "Authorization: Bearer YOUR_DB_MONITOR_SECRET" \
  https://your-domain.com/api/admin/db-monitor | jq
```

### 2. 성능 로그 확인
```javascript
// 콘솔에서 확인 가능한 항목들:
// [MySQL] Slow query detected (1234.56ms): SELECT * FROM ...
// [MySQL] Connection pool near capacity
// [MySQL] High memory usage: 512MB RSS
```

## 문제 발생시 롤백

```bash
# 이전 버전으로 복원
cp src/infrastructure/database/mysql-backup.ts src/infrastructure/database/mysql.ts

# PM2 재시작 (사용하는 경우)
pm2 restart tov-nextjs

# 또는 일반 재시작
npm run build && npm start
```

## 예상 개선 효과

1. **연결 시간**: 3-5초 → 0.5-1초
2. **대시보드 로딩**: 2-3초 → 0.3-0.5초  
3. **메모리 사용량**: 30% 감소
4. **동시 처리 능력**: 2배 향상

## 추가 최적화 옵션

### Redis 캐싱 (선택사항)
```javascript
// 자주 조회되는 데이터 캐싱
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// 캐시 래퍼 함수
async function withCache(key, ttl, queryFn) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await queryFn();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}
```

### CDN 캐싱 (선택사항)
```javascript
// 정적 API 응답에 캐시 헤더 추가
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  },
});
```