# 데이터베이스 사용 현황 분석 문서

> 최종 업데이트: 2025-01-21

## 목차
1. [개요](#개요)
2. [DB 연동 페이지](#db-연동-페이지)
3. [정적 데이터 페이지](#정적-데이터-페이지)
4. [하이브리드 페이지](#하이브리드-페이지)
5. [데이터베이스 테이블 매핑](#데이터베이스-테이블-매핑)
6. [API 엔드포인트 목록](#api-엔드포인트-목록)
7. [개선 권장사항](#개선-권장사항)

## 개요

현재 토브협회 웹사이트는 Clean Architecture 패턴을 기반으로 구현되어 있으며, 대부분의 데이터베이스 접근은 API 라우트를 통해 이루어집니다.

### 아키텍처 구조
```
Pages/Components → API Routes → Use Cases → Repositories → Prisma → Database
```

## DB 연동 페이지

### 1. 게시판 관련
| 페이지 | 경로 | API 엔드포인트 | 데이터 | DB 테이블 |
|--------|------|----------------|---------|-----------|
| 게시판 목록 | `/board/[category]` | `/api/posts`, `/api/categories` | 게시글, 카테고리 | `posts`, `categories` |
| 게시글 상세 | `/board/[category]/[id]` | `/api/posts/[id]` | 게시글 상세 | `posts`, `users`, `categories` |
| 게시글 작성 | `/board/[category]/write` | `/api/posts` (POST) | 게시글 작성 | `posts` |

### 2. 상담 관련
| 페이지 | 경로 | API 엔드포인트 | 데이터 | DB 테이블 |
|--------|------|----------------|---------|-----------|
| 상담 신청 | `/consultation/apply` | `/api/consultations` (POST) | 상담 신청 | `consultations` |
| 상담 목록 | `/consultation/list` | `/api/consultations` | 상담 목록 | `consultations`, `users` |
| 상담 상세 | `/consultation/[id]` | `/api/consultations/[id]` | 상담 상세 | `consultations`, `users` |

### 3. 후원 관련
| 페이지 | 경로 | API 엔드포인트 | 데이터 | DB 테이블 |
|--------|------|----------------|---------|-----------|
| 후원 신청 | `/donation/apply` | `/api/sponsors`, `/api/donations` | 후원자, 후원금 | `sponsors`, `donations` |

### 4. FAQ
| 페이지 | 경로 | API 엔드포인트 | 데이터 | DB 테이블 |
|--------|------|----------------|---------|-----------|
| FAQ | `/faq` | `/api/faqs` | FAQ 목록 | `faqs` |

### 5. 인증 관련
| 페이지 | 경로 | API 엔드포인트 | 데이터 | DB 테이블 |
|--------|------|----------------|---------|-----------|
| 로그인 | `/login` | `/api/auth/login` | 사용자 인증 | `users`, `refresh_tokens` |
| 회원가입 | `/register` | `/api/auth/register` | 사용자 등록 | `users`, `user_profiles` |

### 6. 관리자 페이지
| 페이지 | 경로 | API 엔드포인트 | 데이터 | DB 테이블 |
|--------|------|----------------|---------|-----------|
| 게시글 관리 | `/admin/posts` | `/api/posts` | 게시글 목록 | `posts`, `categories`, `users` |
| 상담 관리 | `/admin/consultations` | `/api/consultations` | 상담 목록 | `consultations`, `users` |
| 후원 관리 | `/admin/donations` | `/api/donations` | 후원 목록 | `donations`, `sponsors` |
| 카테고리 관리 | `/admin/categories` | `/api/categories` | 카테고리 목록 | `categories` |
| 후원자 관리 | `/admin/sponsors` | `/api/sponsors` | 후원자 목록 | `sponsors`, `users` |
| 회원 관리 | `/admin/users` | `/api/users` | 회원 목록 | `users`, `user_profiles` |

## 정적 데이터 페이지

### 1. 협회소개 섹션
| 페이지 | 경로 | 데이터 소스 |
|--------|------|------------|
| 협회소개 메인 | `/about` | 정적 콘텐츠 |
| 인사말 | `/about/greeting` | 정적 콘텐츠 |
| 설립목적 | `/about/purpose` | 정적 콘텐츠 |
| 주요사업 | `/about/business` | 정적 콘텐츠 |
| 조직도 | `/about/organization` | 정적 콘텐츠 |
| 오시는길 | `/about/location` | 정적 콘텐츠 |

### 2. 자료실 섹션
| 페이지 | 경로 | 데이터 소스 |
|--------|------|------------|
| 자료실 메인 | `/resources` | 정적 콘텐츠 |
| 종교인소득 | `/resources/religious-income` | 정적 콘텐츠 |
| 비영리재정 | `/resources/nonprofit-finance` | 정적 콘텐츠 |
| 결산공시 | `/resources/settlement` | 정적 콘텐츠 |
| 관계법령 | `/resources/laws` | 정적 콘텐츠 |

### 3. 안내 페이지
| 페이지 | 경로 | 데이터 소스 |
|--------|------|------------|
| 상담 안내 | `/consultation/guide` | 정적 콘텐츠 |
| 후원 안내 | `/donation/guide` | 정적 콘텐츠 |
| 재정보고 | `/donation/report` | 정적 콘텐츠 |

### 4. 기타 페이지
| 페이지 | 경로 | 데이터 소스 |
|--------|------|------------|
| 교육 프로그램 | `/education` | 정적 콘텐츠 |
| 개인정보처리방침 | `/privacy` | 정적 콘텐츠 |
| 이용약관 | `/terms` | 정적 콘텐츠 |
| 사이트맵 | `/sitemap` | 정적 콘텐츠 |

## 하이브리드 페이지

### 1. 홈페이지 (`/`)
| 컴포넌트 | 데이터 소스 | 현재 상태 | 연동 예정 테이블 |
|----------|-----------|-----------|-----------------|
| MainBanner | 정적 데이터 | Mock 데이터 사용 중 | `main_banners` |
| LatestNews | 정적 데이터 | Mock 데이터 사용 중 | `posts`, `categories` |
| QuickLinks | 정적 데이터 | 하드코딩 | `quick_links` |
| ConsultationBanner | 정적 데이터 | 하드코딩 | - |
| FinancialReport | 정적 데이터 | 하드코딩 | `financial_reports` |

> **참고**: 홈페이지 컴포넌트들은 현재 모두 정적 데이터를 사용하고 있으나, 향후 DB 연동이 필요한 부분입니다.

### 2. 마이페이지 (`/mypage`)
| 기능 | 현재 상태 | 연동 예정 테이블 |
|------|----------|-----------------|
| 사용자 정보 | 정적 UI만 구현 | `users`, `user_profiles` |
| 나의 상담 내역 | 미구현 | `consultations` |
| 나의 후원 내역 | 미구현 | `sponsors`, `donations` |
| 나의 게시글 | 미구현 | `posts` |

## 데이터베이스 테이블 매핑

### 주요 테이블 구조
| 테이블명 | 용도 | 주요 필드 | 연관 테이블 |
|---------|------|----------|------------|
| `users` | 사용자 정보 | id, email, password, name, phone, status | user_profiles, posts, consultations |
| `user_profiles` | 사용자 상세 정보 | user_id, church_name, position, address | users |
| `posts` | 게시글 | id, category_id, user_id, title, content, status | categories, users |
| `categories` | 게시판 카테고리 | id, name, slug, type, parent_id | posts |
| `consultations` | 상담 신청 | id, user_id, name, phone, title, content, status | users |
| `sponsors` | 후원자 | id, user_id, name, phone, email, sponsor_type | users, donations |
| `donations` | 후원금 | id, sponsor_id, amount, payment_date, donation_type | sponsors |
| `faqs` | 자주 묻는 질문 | id, category, question, answer, sort_order | - |
| `main_banners` | 메인 배너 | id, title, image_path, link_url, sort_order | - |
| `quick_links` | 퀵링크 | id, title, icon, link_url, sort_order | - |
| `financial_reports` | 재정 보고서 | id, report_year, report_month, total_income, total_expense | - |
| `refresh_tokens` | JWT 리프레시 토큰 | id, user_id, token_hash, expires_at | users |
| `attachments` | 첨부파일 | id, attachable_type, attachable_id, filename, path | - |
| `site_settings` | 사이트 설정 | id, setting_group, setting_key, setting_value | - |
| `newsletter_subscribers` | 뉴스레터 구독자 | id, email, name, is_active | - |

### 미사용 테이블 (현재 구현 없음)
- `menus` - 메뉴 관리
- `popups` - 팝업 관리
- `activity_logs` - 활동 로그
- `satisfaction_surveys` - 만족도 조사
- `social_accounts` - 소셜 로그인
- `login_attempts` - 로그인 시도 기록
- `two_factor_auth` - 2단계 인증
- `verification_codes` - 인증 코드

## API 엔드포인트 목록

### 인증 관련
| 엔드포인트 | 설명 | 사용 테이블 |
|-----------|------|------------|
| `POST /api/auth/login` | 로그인 | `users`, `refresh_tokens` |
| `POST /api/auth/register` | 회원가입 | `users`, `user_profiles` |
| `POST /api/auth/logout` | 로그아웃 | `refresh_tokens` |
| `POST /api/auth/refresh` | 토큰 갱신 | `refresh_tokens`, `users` |

### 게시판 관련
| 엔드포인트 | 설명 | 사용 테이블 |
|-----------|------|------------|
| `GET /api/posts` | 게시글 목록 | `posts`, `categories`, `users` |
| `GET /api/posts/[id]` | 게시글 상세 | `posts`, `categories`, `users` |
| `POST /api/posts` | 게시글 작성 | `posts` |
| `GET /api/categories` | 카테고리 목록 | `categories` |
| `POST /api/categories` | 카테고리 생성 | `categories` |

### 상담 관련
| 엔드포인트 | 설명 | 사용 테이블 |
|-----------|------|------------|
| `GET /api/consultations` | 상담 목록 | `consultations`, `users` |
| `GET /api/consultations/[id]` | 상담 상세 | `consultations`, `users` |
| `POST /api/consultations` | 상담 신청 | `consultations` |

### 후원 관련
| 엔드포인트 | 설명 | 사용 테이블 |
|-----------|------|------------|
| `GET /api/sponsors` | 후원자 목록 | `sponsors`, `users` |
| `POST /api/sponsors` | 후원자 등록 | `sponsors` |
| `GET /api/donations` | 후원금 목록 | `donations`, `sponsors` |
| `POST /api/donations` | 후원금 등록 | `donations` |

### FAQ 관련
| 엔드포인트 | 설명 | 사용 테이블 |
|-----------|------|------------|
| `GET /api/faqs` | FAQ 목록 | `faqs` |
| `GET /api/faqs/[id]` | FAQ 상세 | `faqs` |
| `POST /api/faqs` | FAQ 등록 | `faqs` |

### 기타
| 엔드포인트 | 설명 | 사용 테이블 |
|-----------|------|------------|
| `GET /api/main-banners` | 메인 배너 목록 | `main_banners` |
| `GET /api/quick-links` | 퀵링크 목록 | `quick_links` |
| `POST /api/newsletter/subscribe` | 뉴스레터 구독 | `newsletter_subscribers` |
| `POST /api/upload` | 파일 업로드 | `attachments` |

## 개선 권장사항

### 1. 우선순위 높음
1. **홈페이지 컴포넌트 DB 연동**
   - `LatestNews`: `/api/posts`를 활용하여 최신 게시글 표시
   - `MainBanner`: `/api/main-banners` 활용
   - `QuickLinks`: `/api/quick-links` 활용

2. **마이페이지 구현**
   - 사용자 정보 조회/수정 API 구현
   - 나의 상담 내역, 후원 내역 조회

3. **카테고리 시드 데이터**
   - 게시판 카테고리 DB 시드 데이터 실행
   - 현재 하드코딩된 카테고리 정보를 DB로 이관

### 2. 중간 우선순위
1. **서버 컴포넌트 활용**
   - 현재 대부분 클라이언트 컴포넌트로 구현
   - 초기 로딩 성능 개선을 위해 서버 컴포넌트 전환

2. **캐싱 전략**
   - 정적 콘텐츠 캐싱
   - API 응답 캐싱 전략 수립

3. **에러 처리**
   - 일관된 에러 처리 패턴 적용
   - 사용자 친화적인 에러 메시지

### 3. 낮은 우선순위
1. **관리자 페이지 고도화**
   - 대시보드 구현
   - 통계 기능 추가

2. **검색 기능**
   - 전체 검색 기능 구현
   - 카테고리별 검색

3. **알림 기능**
   - 상담 답변 알림
   - 공지사항 알림