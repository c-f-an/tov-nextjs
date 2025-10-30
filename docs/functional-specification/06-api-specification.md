# 🔌 API 명세 (API Specification)

## 📋 개요

TOV 시스템의 RESTful API 엔드포인트 명세입니다. 본 문서는 시스템의 모든 API 엔드포인트를 포괄적으로 다룹니다.

**전체 엔드포인트 수**: 50+ 개

## 🔑 인증 (Authentication)

### 인증 방식
- **JWT (JSON Web Token)** 기반 인증
- **SHA256 해싱** 알고리즘 사용
- **HttpOnly 쿠키**에 토큰 저장

### 토큰 유효기간
- **Access Token**: 15분
- **Refresh Token**: 7일

### 기본 인증 헤더
```http
Authorization: Bearer {access_token}
Cookie: refreshToken={refresh_token}
```

### 토큰 갱신 플로우
1. Access Token 만료 시 자동으로 Refresh Token 확인
2. Refresh Token이 유효하면 새로운 Access Token 발급
3. Refresh Token도 만료된 경우 재로그인 필요

## 📚 API 엔드포인트

### 인증 관련 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| POST | `/api/auth/register` | 회원가입 | ❌ |
| POST | `/api/auth/login` | 로그인 | ❌ |
| POST | `/api/auth/logout` | 로그아웃 | ✅ |
| POST | `/api/auth/refresh` | 토큰 갱신 | ✅ |
| GET | `/api/auth/check` | 인증 상태 확인 | ✅ |

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

#### 로그인
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
Set-Cookie: refreshToken={token}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "role": "USER"
  }
}
```

#### 토큰 갱신
```http
POST /api/auth/refresh
Cookie: refreshToken={refresh_token}

Response: 200 OK
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 사용자 관련 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/user/profile` | 내 프로필 조회 | ✅ |
| PUT | `/api/user/profile` | 프로필 수정 | ✅ |
| POST | `/api/user/profile` | 프로필 생성 | ✅ |
| PATCH | `/api/user/password` | 비밀번호 변경 | ✅ |

#### 프로필 조회
```http
GET /api/user/profile
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "profile": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "churchName": "샘플교회",
    "position": "목사",
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

### 게시물 관련 API (Posts Table 사용)

**중요**: 기존 news 테이블에서 posts 테이블로 마이그레이션 완료

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/posts` | 게시물 목록 | ❌ |
| GET | `/api/posts/[id]` | 게시물 상세 | ❌ |
| POST | `/api/posts` | 게시물 작성 | ✅ ADMIN |
| PUT | `/api/posts/[id]` | 게시물 수정 | ✅ ADMIN |
| DELETE | `/api/posts/[id]` | 게시물 삭제 | ✅ ADMIN |
| PATCH | `/api/posts/[id]/views` | 조회수 증가 | ❌ |
| GET | `/api/posts/featured` | 추천 게시물 | ❌ |
| GET | `/api/posts/recent` | 최근 게시물 | ❌ |

#### 게시물 목록 조회
```http
GET /api/posts?category=notice&page=1&limit=10&search=검색어&status=published

Response: 200 OK
{
  "success": true,
  "posts": [
    {
      "id": 1,
      "title": "공지사항 제목",
      "slug": "notice-title",
      "excerpt": "요약 내용...",
      "category": "notice",
      "status": "published",
      "views": 123,
      "createdAt": "2025-01-15T10:00:00Z",
      "author": {
        "id": 1,
        "name": "관리자"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### 게시물 상세 조회
```http
GET /api/posts/1

Response: 200 OK
{
  "success": true,
  "post": {
    "id": 1,
    "title": "공지사항 제목",
    "slug": "notice-title",
    "content": "전체 내용...",
    "excerpt": "요약 내용...",
    "category": "notice",
    "status": "published",
    "views": 124,
    "featuredImage": "https://...",
    "tags": ["교회", "회계"],
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z",
    "author": {
      "id": 1,
      "name": "관리자",
      "email": "admin@example.com"
    }
  }
}
```

### 배너 관리 API (Banner Management)

#### 공개 배너 API
| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/main-banners` | 활성 메인 배너 목록 | ❌ |

#### 관리자 배너 API
| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/admin/banners` | 전체 배너 목록 | ✅ ADMIN |
| POST | `/api/admin/banners` | 배너 생성 | ✅ ADMIN |
| GET | `/api/admin/banners/[id]` | 배너 상세 조회 | ✅ ADMIN |
| PUT | `/api/admin/banners/[id]` | 배너 수정 | ✅ ADMIN |
| DELETE | `/api/admin/banners/[id]` | 배너 삭제 | ✅ ADMIN |
| PATCH | `/api/admin/banners/[id]/toggle` | 배너 활성화/비활성화 | ✅ ADMIN |
| PATCH | `/api/admin/banners/reorder` | 배너 순서 변경 | ✅ ADMIN |

#### 메인 배너 조회 (공개)
```http
GET /api/main-banners

Response: 200 OK
{
  "success": true,
  "banners": [
    {
      "id": 1,
      "title": "환영합니다",
      "subtitle": "TOV 교회 회계 서비스",
      "description": "전문적인 교회 회계 관리",
      "imageUrl": "https://s3.amazonaws.com/banners/banner1.jpg",
      "linkUrl": "/about",
      "linkText": "자세히 보기",
      "order": 1,
      "isActive": true,
      "gradient": {
        "from": "blue.500",
        "to": "purple.600"
      }
    }
  ]
}
```

#### 배너 생성 (관리자)
```http
POST /api/admin/banners
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "새로운 배너",
  "subtitle": "부제목",
  "description": "설명",
  "imageUrl": "https://s3.amazonaws.com/banners/new-banner.jpg",
  "linkUrl": "/services",
  "linkText": "자세히 보기",
  "order": 1,
  "isActive": true,
  "gradient": {
    "from": "blue.500",
    "to": "purple.600"
  }
}

Response: 201 Created
{
  "success": true,
  "message": "배너가 생성되었습니다",
  "banner": {
    "id": 2,
    "title": "새로운 배너",
    "subtitle": "부제목",
    "imageUrl": "https://s3.amazonaws.com/banners/new-banner.jpg",
    "order": 1,
    "isActive": true
  }
}
```

#### 배너 순서 변경
```http
PATCH /api/admin/banners/reorder
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "banners": [
    { "id": 2, "order": 1 },
    { "id": 1, "order": 2 },
    { "id": 3, "order": 3 }
  ]
}

Response: 200 OK
{
  "success": true,
  "message": "배너 순서가 변경되었습니다"
}
```

### 퀵링크 관리 API (Quick Links)

#### 공개 퀵링크 API
| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/quick-links` | 활성 퀵링크 목록 | ❌ |

#### 관리자 퀵링크 API
| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/admin/quick-links` | 전체 퀵링크 목록 | ✅ ADMIN |
| POST | `/api/admin/quick-links` | 퀵링크 생성 | ✅ ADMIN |
| GET | `/api/admin/quick-links/[id]` | 퀵링크 상세 조회 | ✅ ADMIN |
| PUT | `/api/admin/quick-links/[id]` | 퀵링크 수정 | ✅ ADMIN |
| DELETE | `/api/admin/quick-links/[id]` | 퀵링크 삭제 | ✅ ADMIN |
| PATCH | `/api/admin/quick-links/[id]/toggle` | 퀵링크 활성화/비활성화 | ✅ ADMIN |
| PATCH | `/api/admin/quick-links/reorder` | 퀵링크 순서 변경 | ✅ ADMIN |

#### 퀵링크 조회 (공개)
```http
GET /api/quick-links

Response: 200 OK
{
  "success": true,
  "quickLinks": [
    {
      "id": 1,
      "title": "상담 신청",
      "description": "전문가 상담을 받아보세요",
      "icon": "FaCalendarCheck",
      "url": "/consulting",
      "color": "blue",
      "order": 1,
      "isActive": true
    },
    {
      "id": 2,
      "title": "자료실",
      "description": "다양한 회계 자료",
      "icon": "FaFileAlt",
      "url": "/resources",
      "color": "green",
      "order": 2,
      "isActive": true
    }
  ]
}
```

#### 퀵링크 생성 (관리자)
```http
POST /api/admin/quick-links
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "새로운 퀵링크",
  "description": "설명",
  "icon": "FaBook",
  "url": "/new-section",
  "color": "purple",
  "order": 3,
  "isActive": true
}

Response: 201 Created
{
  "success": true,
  "message": "퀵링크가 생성되었습니다",
  "quickLink": {
    "id": 3,
    "title": "새로운 퀵링크",
    "icon": "FaBook",
    "url": "/new-section",
    "order": 3
  }
}
```

#### 퀵링크 순서 변경
```http
PATCH /api/admin/quick-links/reorder
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "quickLinks": [
    { "id": 2, "order": 1 },
    { "id": 1, "order": 2 },
    { "id": 3, "order": 3 }
  ]
}

Response: 200 OK
{
  "success": true,
  "message": "퀵링크 순서가 변경되었습니다"
}
```

### 자료실 관련 API (Resources)

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/resources` | 자료 목록 조회 | ❌ |
| GET | `/api/resources/[id]` | 자료 상세 조회 | ❌ |
| GET | `/api/resources/[id]/download` | 자료 다운로드 | ✅ |
| POST | `/api/resources` | 자료 등록 | ✅ ADMIN |
| PUT | `/api/resources/[id]` | 자료 수정 | ✅ ADMIN |
| DELETE | `/api/resources/[id]` | 자료 삭제 | ✅ ADMIN |
| GET | `/api/resources/categories` | 카테고리 목록 | ❌ |
| POST | `/api/resources/categories` | 카테고리 생성 | ✅ ADMIN |
| PUT | `/api/resources/categories/[id]` | 카테고리 수정 | ✅ ADMIN |
| DELETE | `/api/resources/categories/[id]` | 카테고리 삭제 | ✅ ADMIN |

#### 자료 목록 조회
```http
GET /api/resources?category=accounting&page=1&limit=10&search=세무

Response: 200 OK
{
  "success": true,
  "resources": [
    {
      "id": 1,
      "title": "교회 세무 가이드",
      "description": "교회 세무 처리 방법",
      "category": "accounting",
      "fileUrl": "https://s3.amazonaws.com/resources/tax-guide.pdf",
      "fileName": "tax-guide.pdf",
      "fileSize": 2048000,
      "downloadCount": 156,
      "createdAt": "2025-01-10T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### 자료 다운로드
```http
GET /api/resources/1/download
Authorization: Bearer {access_token}

Response: 302 Redirect
Location: https://s3.amazonaws.com/resources/tax-guide.pdf?signature=...

또는

Response: 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="tax-guide.pdf"
[Binary File Data]
```

### 재무보고서 관련 API (Financial Reports)

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/financial-reports` | 재무보고서 목록 | ✅ |
| GET | `/api/financial-reports/[id]` | 재무보고서 상세 | ✅ |
| POST | `/api/financial-reports` | 재무보고서 생성 | ✅ ADMIN |
| PUT | `/api/financial-reports/[id]` | 재무보고서 수정 | ✅ ADMIN |
| DELETE | `/api/financial-reports/[id]` | 재무보고서 삭제 | ✅ ADMIN |
| GET | `/api/financial-reports/[id]/export` | 보고서 내보내기 | ✅ |

#### 재무보고서 목록 조회
```http
GET /api/financial-reports?year=2025&quarter=1&type=quarterly

Response: 200 OK
{
  "success": true,
  "reports": [
    {
      "id": 1,
      "title": "2025년 1분기 재무보고서",
      "year": 2025,
      "quarter": 1,
      "type": "quarterly",
      "status": "published",
      "totalIncome": 50000000,
      "totalExpense": 30000000,
      "netIncome": 20000000,
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### 카테고리 관련 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/categories` | 카테고리 목록 | ❌ |
| GET | `/api/categories/[id]` | 카테고리 상세 | ❌ |
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
| DELETE | `/api/consultations/[id]` | 상담 삭제 | ✅ ADMIN |
| GET | `/api/consultations/stats` | 상담 통계 | ✅ ADMIN |

#### 상담 신청
```http
POST /api/consultations
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "type": "religious-income",
  "title": "종교인 소득세 문의",
  "content": "상담 내용...",
  "preferredDate": "2025-02-15",
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

#### 상담 상태 변경
```http
PATCH /api/consultations/123
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "completed",
  "adminNote": "상담 완료되었습니다"
}

Response: 200 OK
{
  "success": true,
  "message": "상담 상태가 변경되었습니다",
  "consultation": {
    "id": 123,
    "status": "completed",
    "updatedAt": "2025-01-20T15:30:00Z"
  }
}
```

### 후원 관련 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/donations` | 후원 목록 | ✅ |
| GET | `/api/donations/[id]` | 후원 상세 | ✅ |
| POST | `/api/donations` | 후원 신청 | ✅ |
| GET | `/api/donations/export` | 후원 내역 다운로드 | ✅ |
| GET | `/api/sponsors` | 후원자 목록 | ✅ ADMIN |
| GET | `/api/donations/stats` | 후원 통계 | ✅ ADMIN |

### 관리자 API

#### 대시보드
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/dashboard` | 대시보드 데이터 |
| GET | `/api/admin/dashboard/stats` | 통계 데이터 |
| GET | `/api/admin/dashboard/recent` | 최근 활동 |
| GET | `/api/admin/dashboard/route-optimized` | 최적화된 대시보드 (성능 개선) |

#### 대시보드 데이터 조회
```http
GET /api/admin/dashboard/route-optimized
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "success": true,
  "stats": {
    "totalUsers": 1250,
    "activeUsers": 856,
    "totalPosts": 342,
    "totalConsultations": 189,
    "pendingConsultations": 23
  },
  "recentActivity": [
    {
      "type": "user_registered",
      "user": "홍길동",
      "timestamp": "2025-01-29T10:30:00Z"
    }
  ],
  "charts": {
    "userGrowth": [...],
    "consultationTrends": [...]
  }
}
```

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
| GET | `/api/admin/users/stats` | 회원 통계 |
| GET | `/api/admin/users/export` | 회원 데이터 내보내기 |

#### 회원 목록 조회
```http
GET /api/admin/users?page=1&limit=20&status=active&search=홍길동

Response: 200 OK
{
  "success": true,
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "홍길동",
      "role": "USER",
      "status": "active",
      "churchName": "샘플교회",
      "position": "목사",
      "createdAt": "2025-01-10T10:00:00Z",
      "lastLoginAt": "2025-01-28T15:20:00Z"
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 20,
    "totalPages": 63
  }
}
```

#### 일괄 작업 예시
```http
PATCH /api/admin/users/bulk
Authorization: Bearer {admin_token}
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
| PATCH | `/api/admin/posts/[id]/publish` | 게시물 발행 |
| PATCH | `/api/admin/posts/[id]/unpublish` | 게시물 비공개 |
| POST | `/api/admin/posts/bulk-delete` | 게시물 일괄 삭제 |
| GET | `/api/admin/posts/stats` | 게시물 통계 |

#### 카테고리 관리
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/categories` | 카테고리 관리 목록 |
| POST | `/api/admin/categories` | 카테고리 생성 |
| PUT | `/api/admin/categories/[id]` | 카테고리 수정 |
| DELETE | `/api/admin/categories/[id]` | 카테고리 삭제 |
| PATCH | `/api/admin/categories/reorder` | 카테고리 순서 변경 |

#### 상담 관리
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/consultations` | 상담 관리 목록 |
| GET | `/api/admin/consultations/[id]` | 상담 관리 상세 |
| PATCH | `/api/admin/consultations/[id]` | 상담 상태 변경 |
| POST | `/api/admin/consultations/[id]/assign` | 상담 담당자 배정 |
| DELETE | `/api/admin/consultations/[id]` | 상담 삭제 |
| GET | `/api/admin/consultations/stats` | 상담 통계 |

#### 자료실 관리
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/resources` | 자료 관리 목록 |
| POST | `/api/admin/resources` | 자료 등록 |
| PUT | `/api/admin/resources/[id]` | 자료 수정 |
| DELETE | `/api/admin/resources/[id]` | 자료 삭제 |
| GET | `/api/admin/resources/stats` | 다운로드 통계 |

#### 후원 관리
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/donations` | 후원 관리 목록 |
| GET | `/api/admin/donations/[id]` | 후원 상세 |
| PATCH | `/api/admin/donations/[id]` | 후원 상태 변경 |
| GET | `/api/admin/donations/stats` | 후원 통계 |
| GET | `/api/admin/donations/export` | 후원 데이터 내보내기 |

#### 시스템 관리
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/settings` | 설정 조회 |
| PUT | `/api/admin/settings` | 설정 수정 |
| GET | `/api/admin/logs` | 로그 조회 |
| GET | `/api/admin/db-monitor` | DB 모니터링 |
| GET | `/api/admin/system/health` | 시스템 상태 |
| POST | `/api/admin/system/cache/clear` | 캐시 초기화 |
| GET | `/api/admin/system/backup` | 백업 관리 |

### 파일 업로드 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| POST | `/api/upload` | 파일 업로드 | ✅ |
| POST | `/api/upload/banner` | 배너 이미지 업로드 | ✅ ADMIN |
| POST | `/api/upload/thumbnail` | 썸네일 업로드 | ✅ |
| POST | `/api/upload/resource` | 자료 파일 업로드 | ✅ ADMIN |
| GET | `/api/upload/presigned-url` | S3 사전서명 URL | ✅ |
| GET | `/api/attachments/[id]/download` | 파일 다운로드 | ❌ |

#### 일반 파일 업로드
```http
POST /api/upload
Authorization: Bearer {access_token}
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
    "url": "https://s3.amazonaws.com/uploads/document.pdf",
    "size": 1024000,
    "mimeType": "application/pdf"
  }
}
```

#### 배너 이미지 업로드 (관리자)
```http
POST /api/upload/banner
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

FormData:
- file: (binary image)
- applyGradient: true (선택)

Response: 200 OK
{
  "success": true,
  "file": {
    "id": 5,
    "filename": "banner-image.jpg",
    "url": "https://s3.amazonaws.com/banners/banner-image.jpg",
    "size": 2048000,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 600
  }
}
```

### 메뉴 관리 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/menus` | 메뉴 목록 | ❌ |
| GET | `/api/admin/menus` | 메뉴 관리 목록 | ✅ ADMIN |
| POST | `/api/admin/menus` | 메뉴 생성 | ✅ ADMIN |
| PUT | `/api/admin/menus/[id]` | 메뉴 수정 | ✅ ADMIN |
| DELETE | `/api/admin/menus/[id]` | 메뉴 삭제 | ✅ ADMIN |
| PATCH | `/api/admin/menus/reorder` | 메뉴 순서 변경 | ✅ ADMIN |

### FAQ 관련 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/faqs` | FAQ 목록 | ❌ |
| GET | `/api/faqs/[id]` | FAQ 상세 | ❌ |
| GET | `/api/faqs/categories` | FAQ 카테고리 | ❌ |
| POST | `/api/admin/faqs` | FAQ 생성 | ✅ ADMIN |
| PUT | `/api/admin/faqs/[id]` | FAQ 수정 | ✅ ADMIN |
| DELETE | `/api/admin/faqs/[id]` | FAQ 삭제 | ✅ ADMIN |

### 뉴스레터 관련 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| POST | `/api/newsletter/subscribe` | 뉴스레터 구독 | ❌ |
| POST | `/api/newsletter/unsubscribe` | 구독 해지 | ❌ |
| GET | `/api/newsletter/verify` | 이메일 인증 | ❌ |
| GET | `/api/admin/newsletter/subscribers` | 구독자 목록 | ✅ ADMIN |
| POST | `/api/admin/newsletter/send` | 뉴스레터 발송 | ✅ ADMIN |

#### 뉴스레터 구독
```http
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "홍길동"
}

Response: 200 OK
{
  "success": true,
  "message": "구독 확인 이메일이 발송되었습니다"
}
```

### 기타 API

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/api/health` | 헬스체크 | ❌ |
| GET | `/api/status` | 시스템 상태 | ❌ |
| POST | `/api/contact` | 문의하기 | ❌ |
| GET | `/api/sitemap` | 사이트맵 | ❌ |
| GET | `/api/robots.txt` | 로봇 규칙 | ❌ |

#### 헬스체크
```http
GET /api/health

Response: 200 OK
{
  "status": "healthy",
  "timestamp": "2025-01-29T10:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "cache": "connected",
    "storage": "connected"
  }
}
```

## 🔒 인증 및 권한

### 인증 레벨
1. **Public** (❌): 인증 불필요
2. **Authenticated** (✅): 로그인 필요
3. **Admin** (✅ ADMIN): 관리자 권한 필요

### 권한 체크 플로우
```
1. 요청 수신
2. JWT 토큰 검증
3. 사용자 인증 확인
4. 권한 레벨 확인
5. 리소스 접근 권한 확인
6. 응답 반환
```

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

#### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "요청한 리소스를 찾을 수 없습니다"
}
```

#### 409 Conflict
```json
{
  "error": "Conflict",
  "message": "이미 존재하는 리소스입니다"
}
```

#### 422 Unprocessable Entity
```json
{
  "error": "Unprocessable Entity",
  "message": "요청을 처리할 수 없습니다",
  "validationErrors": [
    {
      "field": "email",
      "message": "이메일은 필수입니다"
    }
  ]
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "서버 오류가 발생했습니다"
}
```

#### 503 Service Unavailable
```json
{
  "error": "Service Unavailable",
  "message": "서비스를 일시적으로 사용할 수 없습니다"
}
```

## 📊 페이지네이션

### 요청 파라미터
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10, 최대: 100)
- `sort`: 정렬 필드 (예: `createdAt`, `title`)
- `order`: 정렬 순서 (asc/desc, 기본값: desc)

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

### 예시
```http
GET /api/posts?page=2&limit=20&sort=createdAt&order=desc

Response: 200 OK
{
  "success": true,
  "posts": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 250,
    "totalPages": 13,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## 🔍 검색 및 필터

### 검색 파라미터
- `search`: 검색 키워드
- `searchField`: 검색 대상 필드 (선택)
- `filter[field]`: 필터 조건
- `dateFrom`: 시작 날짜
- `dateTo`: 종료 날짜

### 필터 연산자
- `eq`: 같음
- `ne`: 같지 않음
- `gt`: 초과
- `gte`: 이상
- `lt`: 미만
- `lte`: 이하
- `in`: 포함
- `like`: 유사

### 예시
```http
GET /api/posts?search=교회&filter[category]=notice&filter[status]=published&dateFrom=2025-01-01&dateTo=2025-01-31

Response: 200 OK
{
  "success": true,
  "posts": [...],
  "total": 25,
  "appliedFilters": {
    "search": "교회",
    "category": "notice",
    "status": "published",
    "dateRange": {
      "from": "2025-01-01",
      "to": "2025-01-31"
    }
  }
}
```

## 📈 Rate Limiting

### 제한 규칙
- **일반 API**: 분당 60회
- **인증 API**: 분당 10회
- **파일 업로드**: 시간당 100회
- **관리자 API**: 분당 120회

### Rate Limit 헤더
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1737280000
```

### Rate Limit 초과 시
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{
  "error": "Too Many Requests",
  "message": "요청 한도를 초과했습니다",
  "retryAfter": 60
}
```

## 🔄 API 버전 관리

### 버전 표기
- 현재 버전: v1 (기본)
- 버전 지정: `/api/v2/posts`
- 헤더 지정: `API-Version: 2`

### 버전별 지원 정책
- **v1**: 현재 버전 (안정)
- **v2**: 개발 중 (베타)
- 이전 버전은 최소 6개월간 지원

## 📦 일괄 처리 (Batch Operations)

### 일괄 작업 형식
```http
POST /api/batch
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "operations": [
    {
      "method": "POST",
      "url": "/api/posts",
      "body": {...}
    },
    {
      "method": "PATCH",
      "url": "/api/posts/1",
      "body": {...}
    }
  ]
}

Response: 200 OK
{
  "success": true,
  "results": [
    {
      "status": 201,
      "body": {...}
    },
    {
      "status": 200,
      "body": {...}
    }
  ]
}
```

## 📝 API 문서화

### Swagger/OpenAPI (향후 구현)
- 경로: `/api/docs`
- 형식: OpenAPI 3.0
- 인터랙티브 테스트 지원
- 자동 생성된 클라이언트 코드

## 🆕 Recent API Additions (2025년 1월)

### 새로 추가된 주요 API

#### 1. 배너 관리 API (Banner Management)
- 메인 페이지 배너 관리 기능
- 그라데이션 효과 지원
- 드래그 앤 드롭 순서 변경
- 활성화/비활성화 토글

#### 2. 퀵링크 관리 API (Quick Links)
- 홈페이지 빠른 링크 관리
- 아이콘 및 색상 커스터마이징
- 순서 변경 기능
- 실시간 활성화 상태 관리

#### 3. 자료실 API (Resources)
- 파일 업로드 및 다운로드
- 카테고리별 분류
- 다운로드 횟수 추적
- 검색 및 필터링

#### 4. 재무보고서 API (Financial Reports)
- 분기별/연도별 재무보고서
- 수입/지출 내역 관리
- 보고서 내보내기 기능

#### 5. 향상된 관리자 대시보드
- `/api/admin/dashboard/route-optimized`: 성능 최적화된 대시보드
- 실시간 통계 데이터
- 차트 및 그래프 데이터
- 최근 활동 피드

#### 6. Posts 테이블 마이그레이션
- 기존 news 테이블에서 posts 테이블로 전환
- 더 유연한 게시물 관리
- 향상된 카테고리 시스템
- SEO 최적화 (slug 지원)

#### 7. 인증 시스템 강화
- JWT 토큰 기반 인증
- SHA256 해싱
- HttpOnly 쿠키 보안
- Access Token (15분) + Refresh Token (7일)

### API 개선 사항
- 모든 API에 적절한 에러 핸들링 추가
- 페이지네이션 표준화
- 검색 및 필터링 기능 강화
- Rate Limiting 구현
- 일괄 처리 기능 추가

### 향후 계획
- GraphQL API 지원 검토
- WebSocket 실시간 알림
- API 버전 2.0 개발
- 더 세분화된 권한 관리
- API 사용량 분석 대시보드

---

**문서 버전**: 2.0
**최종 업데이트**: 2025년 1월 29일
**총 API 엔드포인트 수**: 50+
**문서 작성자**: TOV Development Team
