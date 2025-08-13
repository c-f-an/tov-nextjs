# 데이터베이스 설정 가이드

## 로컬 개발 환경 설정

### 1. MySQL 설치 (macOS)
```bash
# Homebrew를 사용한 설치
brew install mysql

# MySQL 서비스 시작
brew services start mysql

# MySQL 보안 설정 (선택사항)
mysql_secure_installation
```

### 2. 데이터베이스 생성
```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE tov_homepage;

# 사용자 생성 (선택사항)
CREATE USER 'tov_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON tov_homepage.* TO 'tov_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 환경 변수 설정
`.env` 파일을 수정하여 로컬 데이터베이스를 사용하도록 설정:

```env
# 비밀번호가 없는 경우
DATABASE_URL="mysql://root:@localhost:3306/tov_homepage"

# 비밀번호가 있는 경우
DATABASE_URL="mysql://root:your_password@localhost:3306/tov_homepage"

# 별도 사용자를 생성한 경우
DATABASE_URL="mysql://tov_user:your_password@localhost:3306/tov_homepage"
```

### 4. Prisma 마이그레이션
```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스에 스키마 적용
npx prisma db push

# 또는 마이그레이션 사용
npx prisma migrate dev --name init
```

### 5. 초기 데이터 시딩 (선택사항)
```bash
# prisma/seed.ts 파일이 있는 경우
npx prisma db seed
```

## 프로덕션 데이터베이스 연결

프로덕션 환경에서는 다음과 같이 설정합니다:

```env
DATABASE_URL="mysql://tov-client:password@your-rds-endpoint:3306/tov_prod"
```

## 문제 해결

### 연결 오류
1. MySQL 서비스가 실행 중인지 확인
   ```bash
   brew services list
   ```

2. 포트 확인
   ```bash
   lsof -i :3306
   ```

3. MySQL 접속 테스트
   ```bash
   mysql -u root -p -h localhost
   ```

### Prisma 오류
1. Prisma 클라이언트 재생성
   ```bash
   npx prisma generate
   ```

2. node_modules 재설치
   ```bash
   rm -rf node_modules
   npm install
   ```