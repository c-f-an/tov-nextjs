# 🔌 API 명세 (API Specification)

## 📋 개요

TOV 시스템의 RESTful API 엔드포인트 명세입니다.

## 🔑 인증 (Authentication)

### 기본 인증 헤더
```http
Authorization: Bearer {access_token}
Cookie: refreshToken={refresh_token}
```

## 📚 API 엔드포인트

### 인증 관련 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| POST | `/api/auth/register` | 회원가입 | ❌ |
| POST | `/api/auth/login` | 로그인 | ❌ |
| POST | `/api/auth/logout` | 로그아웃 | ✅ |
| POST | `/api/auth/refresh` | 토큰 갱신 | ✅ |

#### 회원가입
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "churchName": "샘플교회",
  "position": "목사",
  "agreeTerms": true,
  "agreePrivacy": true
}

Response: 201 Created
{
  "success": true,
  "message": "회원가입이 완료되었습니다",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동"
  }
}
```

### 사용자 관련 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/user/profile` | 내 프로필 조회 | ✅ |
| PUT | `/api/user/profile` | 프로필 수정 | ✅ |
| POST | `/api/user/profile` | 프로필 생성 | ✅ |

### 게시물 관련 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/posts` | 게시물 목록 | ❌ |
| GET | `/api/posts/[id]` | 게시물 상세 | ❌ |
| POST | `/api/posts` | 게시물 작성 | ✅ ADMIN |
| PUT | `/api/posts/[id]` | 게시물 수정 | ✅ ADMIN |
| DELETE | `/api/posts/[id]` | 게시물 삭제 | ✅ ADMIN |

#### 게시물 목록 조회
```http
GET /api/posts?category=notice&page=1&limit=10&search=검색어

Response: 200 OK
{
  "posts": [...],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

### 카테고리 관련 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/categories` | 카테고리 목록 | ❌ |
| POST | `/api/categories` | 카테고리 생성 | ✅ ADMIN |
| PUT | `/api/categories/[id]` | 카테고리 수정 | ✅ ADMIN |
| DELETE | `/api/categories/[id]` | 카테고리 삭제 | ✅ ADMIN |

### 상담 관련 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/consultations` | 상담 목록 | ✅ |
| GET | `/api/consultations/[id]` | 상담 상세 | ✅ |
| POST | `/api/consultations` | 상담 신청 | ✅ |
| PATCH | `/api/consultations/[id]` | 상담 상태 변경 | ✅ ADMIN |

#### 상담 신청
```http
POST /api/consultations
Content-Type: application/json

{
  "type": "religious-income",
  "title": "종교인 소득세 문의",
  "content": "상담 내용...",
  "preferredDate": "2024-10-20",
  "preferredTime": "14:00",
  "attachments": []
}

Response: 201 Created
{
  "success": true,
  "consultationId": 123,
  "message": "상담 신청이 접수되었습니다"
}
```

### 후원 관련 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/donations` | 후원 목록 | ✅ |
| POST | `/api/donations` | 후원 신청 | ✅ |
| GET | `/api/donations/export` | 후원 내역 다운로드 | ✅ |
| GET | `/api/sponsors` | 후원자 목록 | ✅ ADMIN |

### 관리자 API

#### 대시보드
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/dashboard` | 대시보드 데이터 |
| GET | `/api/admin/dashboard/stats` | 통계 데이터 |
| GET | `/api/admin/dashboard/recent` | 최근 활동 |

#### 회원 관리
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/users` | 회원 목록 |
| GET | `/api/admin/users/[id]` | 회원 상세 |
| PATCH | `/api/admin/users` | 회원 상태 변경 |
| PATCH | `/api/admin/users/[id]` | 회원 정보 수정 |
| DELETE | `/api/admin/users/[id]` | 회원 삭제 |
| POST | `/api/admin/users/create` | 회원 생성 |
| POST | `/api/admin/users/send-email` | 이메일 발송 |
| PATCH | `/api/admin/users/bulk` | 일괄 작업 |
| DELETE | `/api/admin/users/bulk` | 일괄 삭제 |

#### 일괄 작업 예시
```http
PATCH /api/admin/users/bulk
Content-Type: application/json

{
  "userIds": [1, 2, 3],
  "action": "UPDATE_STATUS",
  "status": "suspended"
}

Response: 200 OK
{
  "success": true,
  "results": {
    "success": 3,
    "failed": 0
  }
}
```

#### 게시물 관리
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/posts` | 게시물 관리 목록 |
| GET | `/api/admin/posts/[id]` | 게시물 관리 상세 |
| POST | `/api/admin/posts` | 게시물 작성 |
| PUT | `/api/admin/posts/[id]` | 게시물 수정 |
| DELETE | `/api/admin/posts/[id]` | 게시물 삭제 |

#### 시스템 관리
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/settings` | 설정 조회 |
| PUT | `/api/admin/settings` | 설정 수정 |
| GET | `/api/admin/logs` | 로그 조회 |
| GET | `/api/admin/db-monitor` | DB 모니터링 |

### 파일 업로드 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| POST | `/api/upload` | 파일 업로드 | ✅ |
| POST | `/api/upload/thumbnail` | 썸네일 업로드 | ✅ |
| GET | `/api/upload/presigned-url` | S3 사전서명 URL | ✅ |
| GET | `/api/attachments/[id]/download` | 파일 다운로드 | ❌ |

#### 파일 업로드
```http
POST /api/upload
Content-Type: multipart/form-data

FormData:
- file: (binary)
- type: "post" | "consultation" | "profile"

Response: 200 OK
{
  "success": true,
  "file": {
    "id": 1,
    "filename": "document.pdf",
    "url": "https://s3.amazonaws.com/...",
    "size": 1024000,
    "mimeType": "application/pdf"
  }
}
```

### 기타 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/health` | 헬스체크 | ❌ |
| GET | `/api/menus` | 메뉴 목록 | ❌ |
| GET | `/api/main-banners` | 메인 배너 | ❌ |
| GET | `/api/quick-links` | 빠른 링크 | ❌ |
| GET | `/api/faqs` | FAQ 목록 | ❌ |
| POST | `/api/newsletter/subscribe` | 뉴스레터 구독 | ❌ |
| POST | `/api/newsletter/unsubscribe` | 구독 해지 | ❌ |

## 🔒 인증 및 권한

### 인증 레벨
1. **Public** (❌): 인증 불필요
2. **Authenticated** (✅): 로그인 필요
3. **Admin** (✅ ADMIN): 관리자 권한 필요

### 에러 응답

#### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "인증이 필요합니다"
}
```

#### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "권한이 없습니다"
}
```

#### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "잘못된 요청입니다",
  "details": {
    "field": "email",
    "error": "유효한 이메일 형식이 아닙니다"
  }
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "서버 오류가 발생했습니다"
}
```

## 📊 페이지네이션

### 요청 파라미터
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10, 최대: 100)
- `sort`: 정렬 필드
- `order`: 정렬 순서 (asc/desc)

### 응답 형식
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🔍 검색 및 필터

### 검색 파라미터
- `search`: 검색 키워드
- `searchField`: 검색 대상 필드
- `filter[field]`: 필터 조건

### 예시
```http
GET /api/posts?search=교회&filter[category]=notice&filter[status]=published
```

## 📈 Rate Limiting

### 제한 규칙
- **일반 API**: 분당 60회
- **인증 API**: 분당 10회
- **파일 업로드**: 시간당 100회

### Rate Limit 헤더
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1697280000
```

## 🔄 API 버전 관리

### 버전 표기
- 현재 버전: v1 (기본)
- 버전 지정: `/api/v2/posts`
- 헤더 지정: `API-Version: 2`

## 📝 API 문서화

### Swagger/OpenAPI (향후 구현)
- 경로: `/api/docs`
- 형식: OpenAPI 3.0
- 인터랙티브 테스트 지원

---

*최종 업데이트: 2024년 10월 14일*