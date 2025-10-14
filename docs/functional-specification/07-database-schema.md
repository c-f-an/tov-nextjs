# 🗄️ 데이터베이스 스키마 (Database Schema)

## 📋 개요

TOV 시스템의 MySQL 데이터베이스 구조 및 관계 명세입니다.

## 🏗️ 데이터베이스 구조

### 데이터베이스 정보
- **Engine**: MySQL 8.0
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci
- **Storage Engine**: InnoDB

## 📊 테이블 구조

### users (사용자)
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(50),
  phone VARCHAR(20),
  churchName VARCHAR(100),
  position VARCHAR(50),
  denomination VARCHAR(50),
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  status ENUM('active', 'inactive', 'suspended', 'deleted') DEFAULT 'active',
  loginType VARCHAR(20) DEFAULT 'email',
  adminNote TEXT,
  profileImage VARCHAR(255),
  lastLoginAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created (createdAt)
);
```

### posts (게시물)
```sql
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoryId INT,
  userId INT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  thumbnail VARCHAR(255),
  viewCount INT DEFAULT 0,
  isPublished BOOLEAN DEFAULT true,
  isPinned BOOLEAN DEFAULT false,
  publishedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_category (categoryId),
  INDEX idx_published (isPublished, publishedAt),
  FULLTEXT idx_search (title, content)
);
```

### categories (카테고리)
```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parentId INT,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  displayOrder INT DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parentId) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_slug (slug),
  INDEX idx_parent (parentId)
);
```

### consultations (상담)
```sql
CREATE TABLE consultations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  name VARCHAR(50),
  email VARCHAR(100),
  phone VARCHAR(20),
  preferredDate DATE,
  preferredTime TIME,
  status ENUM('pending', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  assignedTo INT,
  consultationNote TEXT,
  completedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (assignedTo) REFERENCES users(id),
  INDEX idx_user (userId),
  INDEX idx_status (status),
  INDEX idx_type (type)
);
```

### donations (후원)
```sql
CREATE TABLE donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  sponsorId INT,
  amount DECIMAL(10, 2) NOT NULL,
  type ENUM('one-time', 'monthly', 'yearly') DEFAULT 'one-time',
  paymentMethod VARCHAR(50),
  paymentStatus ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  transactionId VARCHAR(100),
  donorName VARCHAR(50),
  donorEmail VARCHAR(100),
  donorPhone VARCHAR(20),
  message TEXT,
  isAnonymous BOOLEAN DEFAULT false,
  receiptIssued BOOLEAN DEFAULT false,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (sponsorId) REFERENCES sponsors(id),
  INDEX idx_user (userId),
  INDEX idx_sponsor (sponsorId),
  INDEX idx_status (paymentStatus),
  INDEX idx_date (createdAt)
);
```

### sponsors (후원자)
```sql
CREATE TABLE sponsors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  type ENUM('individual', 'organization') DEFAULT 'individual',
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  organizationName VARCHAR(100),
  totalAmount DECIMAL(12, 2) DEFAULT 0,
  donationCount INT DEFAULT 0,
  lastDonationDate DATETIME,
  grade VARCHAR(20),
  note TEXT,
  isActive BOOLEAN DEFAULT true,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_user (userId),
  INDEX idx_email (email),
  INDEX idx_grade (grade)
);
```

### comments (댓글)
```sql
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  postId INT NOT NULL,
  userId INT NOT NULL,
  parentId INT,
  content TEXT NOT NULL,
  isDeleted BOOLEAN DEFAULT false,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (parentId) REFERENCES comments(id) ON DELETE CASCADE,
  INDEX idx_post (postId),
  INDEX idx_user (userId),
  INDEX idx_parent (parentId)
);
```

### attachments (첨부파일)
```sql
CREATE TABLE attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entityType VARCHAR(50) NOT NULL,
  entityId INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  originalName VARCHAR(255),
  mimeType VARCHAR(100),
  size INT,
  url VARCHAR(500),
  uploadedBy INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploadedBy) REFERENCES users(id),
  INDEX idx_entity (entityType, entityId),
  INDEX idx_uploaded_by (uploadedBy)
);
```

### faqs (자주 묻는 질문)
```sql
CREATE TABLE faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoryId INT,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  displayOrder INT DEFAULT 0,
  viewCount INT DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id),
  INDEX idx_category (categoryId),
  INDEX idx_active (isActive),
  FULLTEXT idx_search (question, answer)
);
```

### admin_logs (관리자 로그)
```sql
CREATE TABLE admin_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entityType VARCHAR(50),
  entityId INT,
  details JSON,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_user (userId),
  INDEX idx_action (action),
  INDEX idx_entity (entityType, entityId),
  INDEX idx_created (createdAt)
);
```

### refresh_tokens (리프레시 토큰)
```sql
CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (userId),
  INDEX idx_token (token),
  INDEX idx_expires (expiresAt)
);
```

### newsletters (뉴스레터 구독)
```sql
CREATE TABLE newsletters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(50),
  isActive BOOLEAN DEFAULT true,
  subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  unsubscribedAt DATETIME,
  unsubscribeToken VARCHAR(100) UNIQUE,
  INDEX idx_email (email),
  INDEX idx_active (isActive)
);
```

### menus (메뉴)
```sql
CREATE TABLE menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parentId INT,
  name VARCHAR(50) NOT NULL,
  url VARCHAR(255),
  target VARCHAR(20) DEFAULT '_self',
  position VARCHAR(20) DEFAULT 'header',
  displayOrder INT DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  requiredRole VARCHAR(20),
  icon VARCHAR(50),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parentId) REFERENCES menus(id) ON DELETE CASCADE,
  INDEX idx_parent (parentId),
  INDEX idx_position (position),
  INDEX idx_active (isActive)
);
```

### banners (배너)
```sql
CREATE TABLE banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  imageUrl VARCHAR(500) NOT NULL,
  linkUrl VARCHAR(500),
  position VARCHAR(50) DEFAULT 'main',
  displayOrder INT DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  startDate DATETIME,
  endDate DATETIME,
  clickCount INT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_position (position),
  INDEX idx_active (isActive),
  INDEX idx_date (startDate, endDate)
);
```

### settings (시스템 설정)
```sql
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) UNIQUE NOT NULL,
  `value` TEXT,
  `type` VARCHAR(20) DEFAULT 'string',
  description VARCHAR(255),
  groupName VARCHAR(50),
  isPublic BOOLEAN DEFAULT false,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (`key`),
  INDEX idx_group (groupName)
);
```

## 🔗 테이블 관계

### 주요 관계
1. **users ↔ posts**: 1:N (작성자)
2. **users ↔ consultations**: 1:N (신청자)
3. **users ↔ donations**: 1:N (후원자)
4. **users ↔ comments**: 1:N (작성자)
5. **categories ↔ posts**: 1:N (카테고리)
6. **posts ↔ comments**: 1:N (댓글)
7. **sponsors ↔ donations**: 1:N (후원 내역)

### ER 다이어그램 (간략)
```
users ────┬──── posts ──── comments
          ├──── consultations
          ├──── donations ──── sponsors
          └──── admin_logs

categories ──┬── posts
             └── faqs

attachments (다형성: posts, consultations, etc.)
```

## 🔍 인덱스 전략

### 성능 최적화 인덱스
1. **검색용**: FULLTEXT 인덱스 (posts, faqs)
2. **조회용**: 복합 인덱스 (status + date)
3. **조인용**: 외래키 인덱스
4. **정렬용**: displayOrder, createdAt

## 🔐 보안 고려사항

### 데이터 암호화
- 비밀번호: bcrypt 해시
- 민감 정보: AES 암호화 (향후)
- PII 마스킹: 로그 저장 시

### 접근 제어
- Row Level Security (향후)
- 컬럼 레벨 권한 (향후)

## 📈 성능 고려사항

### 파티셔닝 (향후)
- posts: 연도별 파티셔닝
- admin_logs: 월별 파티셔닝
- donations: 연도별 파티셔닝

### 아카이빙
- 6개월 이상 오래된 로그 → 아카이브 테이블
- 3년 이상 오래된 상담 → 아카이브

## 🔄 마이그레이션

### 버전 관리
```sql
CREATE TABLE migrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  name VARCHAR(255),
  executedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_version (version)
);
```

---

*최종 업데이트: 2024년 10월 14일*