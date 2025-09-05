# TOV 홈페이지 DB 성능 디버깅 체크리스트

## 즉시 확인사항

### 1. 연결 풀 상태 확인
```bash
# DB 모니터링 API 호출 (개발 환경)
curl http://localhost:3000/api/admin/db-monitor

# 프로덕션에서는 시크릿 키 필요
curl -H "Authorization: Bearer YOUR_DB_MONITOR_SECRET" https://your-domain.com/api/admin/db-monitor
```

### 2. 느린 쿼리 확인
```bash
# 디버깅 스크립트 실행
node scripts/debug-db-performance.js
```

### 3. 현재 DB 연결 수 확인
```sql
-- MySQL에서 직접 확인
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Threads_connected';
SHOW VARIABLES LIKE 'max_connections';
```

## 성능 최적화 체크리스트

### ✅ 1. 연결 풀 최적화
- [ ] connectionLimit을 5로 줄였는가? (t2.micro 권장)
- [ ] idleTimeout을 30초로 설정했는가?
- [ ] 연결 풀 싱글톤 패턴을 사용하는가?
- [ ] NODE_ENV=production에서 글로벌 인스턴스를 사용하는가?

### ✅ 2. 쿼리 최적화
- [ ] 대시보드 쿼리를 병렬로 실행하는가? (Promise.all 사용)
- [ ] 불필요한 SELECT * 쿼리를 제거했는가?
- [ ] LIMIT을 사용하여 결과 수를 제한하는가?
- [ ] JOIN을 사용하여 N+1 문제를 방지하는가?

### ✅ 3. 인덱스 확인
```sql
-- 필수 인덱스 생성
ALTER TABLE users ADD INDEX idx_status (status);
ALTER TABLE users ADD INDEX idx_email (email);
ALTER TABLE users ADD INDEX idx_last_login (last_login_at);

ALTER TABLE posts ADD INDEX idx_status (status);
ALTER TABLE posts ADD INDEX idx_category_id (category_id);
ALTER TABLE posts ADD INDEX idx_created_at (created_at);

ALTER TABLE consultations ADD INDEX idx_user_id (user_id);
ALTER TABLE consultations ADD INDEX idx_status (status);

ALTER TABLE donations ADD INDEX idx_user_id (user_id);
ALTER TABLE donations ADD INDEX idx_created_at (created_at);
```

### ✅ 4. 메모리 사용량 확인
- [ ] Node.js 힙 사용량이 512MB 이하인가?
- [ ] RSS 메모리가 700MB 이하인가?
- [ ] 메모리 누수가 없는가?

### ✅ 5. Next.js 최적화
- [ ] API 라우트에 캐시 헤더를 추가했는가?
- [ ] 정적 데이터는 getStaticProps를 사용하는가?
- [ ] 개발 모드에서 연결 풀을 재사용하는가?

## 문제 해결 순서

### 1단계: 즉시 적용 가능한 해결책
```javascript
// 1. mysql-optimized.ts로 교체
import db from '@/infrastructure/database/mysql-optimized';

// 2. 병렬 쿼리 실행
const [result1, result2, result3] = await Promise.all([
  db.query('SELECT ...'),
  db.query('SELECT ...'),
  db.query('SELECT ...')
]);

// 3. 쿼리 결과 캐싱 (메모리 캐시)
const cache = new Map();
const CACHE_TTL = 60000; // 1분

async function getCachedData(key, queryFn) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await queryFn();
  cache.set(key, { data, time: Date.now() });
  return data;
}
```

### 2단계: DB 설정 최적화
```sql
-- RDS 파라미터 그룹에서 설정
SET GLOBAL query_cache_size = 67108864; -- 64MB
SET GLOBAL query_cache_type = ON;
SET GLOBAL max_connections = 50; -- t3.micro 권장값
SET GLOBAL innodb_buffer_pool_size = 536870912; -- 512MB (인스턴스 메모리의 50%)
```

### 3단계: 모니터링 설정
```javascript
// PM2 ecosystem 파일에 추가
module.exports = {
  apps: [{
    name: 'tov-nextjs',
    script: './node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1, // t2.micro는 싱글 인스턴스 권장
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=512' // 메모리 제한
    },
    max_memory_restart: '500M', // 메모리 초과시 재시작
    error_file: './logs/err.log',
    out_file: './logs/out.log',
  }]
};
```

## 성능 테스트 명령어

```bash
# 1. 부하 테스트 (Apache Bench)
ab -n 100 -c 10 http://localhost:3000/api/admin/dashboard

# 2. 메모리 프로파일링
node --inspect scripts/memory-profile.js

# 3. 쿼리 프로파일링
mysql -h your-rds-host -u your-user -p -e "SET profiling = 1; YOUR_QUERY; SHOW PROFILES;"
```

## 긴급 대응 방안

### DB 연결이 너무 느린 경우:
1. 연결 풀 크기를 3으로 줄이기
2. 쿼리 타임아웃을 10초로 설정
3. 불필요한 JOIN 제거
4. 캐싱 레이어 추가 (Redis 또는 메모리 캐시)

### 메모리 부족 시:
1. Node.js 메모리 제한 설정
2. 대용량 쿼리 결과 스트리밍으로 처리
3. 불필요한 데이터 필드 제거
4. 페이지네이션 강제 적용

### 트래픽 급증 시:
1. 읽기 전용 API에 캐시 헤더 추가
2. 정적 생성 (SSG) 활용
3. CDN 캐싱 설정
4. Rate limiting 적용

## 모니터링 대시보드 URL

- DB Monitor: `/api/admin/db-monitor`
- 실시간 상태 확인 가능한 항목:
  - 연결 풀 상태
  - 느린 쿼리 목록
  - 메모리 사용량
  - 쿼리 실행 시간
  - 에러 로그