# 📊 시스템 개요 (System Overview)

## 🎯 시스템 목적

TOV는 교회 재정 투명성 증진을 위한 종합 플랫폼으로, 다음과 같은 목적을 가지고 있습니다:

1. **교회 재정 투명성 교육** - 교회 회계 및 재정 관리 교육 제공
2. **컨설팅 서비스** - 전문가 상담 및 컨설팅 서비스 제공
3. **정보 제공** - 관련 법령, 매뉴얼, 자료 제공
4. **커뮤니티** - 교회 재정 투명성 운동 확산

## 🏗️ 시스템 아키텍처

### 기술 스택
```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│         Next.js 16 / React 19 / TypeScript      │
│           Tailwind CSS 4 / Lucide React         │
└─────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────┐
│                   Backend                        │
│          Next.js API Routes / Node.js           │
│                JWT Authentication                │
└─────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────┐
│                  Database                        │
│                   MySQL 8.0                      │
└─────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────┐
│              External Services                   │
│   AWS S3 | Email Service | Kakao Maps API       │
└─────────────────────────────────────────────────┘
```

### 프로젝트 구조
```
tov-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # 공개 페이지
│   │   ├── admin/              # 관리자 페이지
│   │   ├── api/                # API Routes
│   │   └── ...
│   ├── core/                   # 핵심 비즈니스 로직
│   │   ├── domain/             # 도메인 모델
│   │   ├── use-cases/          # 유스케이스
│   │   └── repositories/       # 리포지토리 인터페이스
│   ├── infrastructure/         # 인프라 구현
│   │   ├── repositories/       # DB 리포지토리
│   │   └── services/           # 외부 서비스
│   ├── presentation/           # UI 컴포넌트
│   │   └── components/         # React 컴포넌트
│   └── lib/                    # 유틸리티
├── public/                     # 정적 파일
├── docs/                       # 문서
└── ...
```

## 🔒 보안 아키텍처

### 인증 시스템
- **JWT 기반 인증**: Access Token + Refresh Token
- **토큰 저장**: HttpOnly Cookie (Refresh Token), Authorization Header (Access Token)
- **토큰 만료**: Access Token (15분), Refresh Token (7일)
- **토큰 보안**: SHA256 해싱, 토큰 회전 지원, 블랙리스트 관리
- **소셜 로그인**: Google, Naver, Kakao, Apple 지원 (테이블 준비됨)

### 권한 관리
```typescript
enum UserRole {
  USER = "USER",      // 일반 회원
  ADMIN = "ADMIN"     // 관리자
}

enum UserStatus {
  ACTIVE = "active",      // 활성
  INACTIVE = "inactive",  // 비활성
  SUSPENDED = "suspended" // 정지
}

enum LoginType {
  EMAIL = "email",    // 이메일 로그인
  GOOGLE = "google",  // 구글 소셜 로그인
  NAVER = "naver",    // 네이버 소셜 로그인
  KAKAO = "kakao",    // 카카오 소셜 로그인
  APPLE = "apple"     // 애플 소셜 로그인
}
```

## 📊 데이터베이스 구조

### 주요 테이블 (35+ 테이블)
**사용자 & 인증**
- **users**: 사용자 정보
- **user_profiles**: 사용자 프로필 (1:1)
- **refresh_tokens**: JWT 리프레시 토큰
- **jwt_blacklist**: 무효화된 JWT
- **social_accounts**: 소셜 로그인 연동
- **login_attempts**: 로그인 시도 기록

**콘텐츠 관리**
- **posts**: 게시물 (news 테이블 통합)
- **categories**: 계층형 카테고리
- **attachments**: 첨부파일 (다형성)

**메인 페이지**
- **main_banners**: 메인 배너 (gradient 지원)
- **quick_links**: 퀵링크 메뉴

**상담 & 후원**
- **consultations**: 상담 신청
- **donations**: 후원 내역
- **sponsors**: 후원자 관리
- **financial_reports**: 재정 보고서

**자료실 & 리소스**
- **resources**: 자료 관리
- **resource_categories**: 자료 카테고리
- **resource_tags**: 자료 태그
- **resource_download_logs**: 다운로드 추적

**사이트 관리**
- **menus**: 메뉴 관리
- **faqs**: FAQ
- **site_settings**: 사이트 설정
- **popups**: 팝업 관리
- **admin_logs**: 관리자 활동 로그
- **activity_logs**: 사용자 활동 로그

## 🌐 URL 구조

### 공개 영역
- `/` - 홈페이지
- `/about/*` - 소개
- `/movement/*` - 운동 소개
- `/resources/*` - 자료실
- `/posts/*` - 게시판
- `/consultation/*` - 상담
- `/donation/*` - 후원

### 회원 영역
- `/login` - 로그인
- `/register` - 회원가입
- `/mypage` - 마이페이지

### 관리자 영역
- `/admin` - 대시보드
- `/admin/users` - 회원 관리
- `/admin/posts` - 게시물 관리
- `/admin/categories` - 카테고리 관리
- `/admin/banners` - 배너 관리 (NEW)
- `/admin/quick-links` - 퀵링크 관리 (NEW)
- `/admin/consultations` - 상담 관리
- `/admin/donations` - 후원 관리
- `/admin/sponsors` - 후원자 관리
- `/admin/resources` - 자료실 관리
- `/admin/settings` - 시스템 설정
- `/admin/logs` - 로그 조회
- `/admin/db-monitor` - DB 모니터링

## 🔄 데이터 흐름

### 일반적인 요청 흐름
```
1. Client Request
   ↓
2. Next.js Middleware (인증 체크)
   ↓
3. API Route Handler
   ↓
4. Use Case Layer (비즈니스 로직)
   ↓
5. Repository Layer (데이터 접근)
   ↓
6. MySQL Database
   ↓
7. Response to Client
```

## 📈 성능 최적화

### 캐싱 전략
- **정적 페이지**: ISR (Incremental Static Regeneration)
- **동적 데이터**: React Query 캐싱
- **이미지**: Next.js Image Optimization
- **CDN**: AWS CloudFront (프로덕션)

### 최적화 기법
- 코드 스플리팅
- 레이지 로딩
- 이미지 최적화
- DB 쿼리 최적화
- API 응답 압축

## 🚦 모니터링

### 로깅
- **애플리케이션 로그**: Console + File
- **관리자 활동 로그**: DB (admin_logs 테이블)
- **에러 로그**: Sentry (프로덕션)

### 헬스체크
- **API 헬스체크**: `/api/health`
- **DB 모니터링**: `/api/admin/db-monitor`

## 🔧 환경 설정

### 환경 변수 카테고리
1. **Database**:
   - DATABASE_URL, DATABASE_HOST, DATABASE_PORT
   - DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME
2. **Authentication**:
   - JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
3. **Email**:
   - SENDGRID_API_KEY (선택), EMAIL_FROM
   - EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS (Nodemailer 대체)
4. **Storage (AWS S3/Cloudflare R2)**:
   - AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
   - AWS_S3_BUCKET, AWS_CLOUDFRONT_URL
5. **External API**:
   - NEXT_PUBLIC_KAKAO_MAP_API_KEY
   - NEXT_PUBLIC_COMPANY_ADDRESS
6. **Application**:
   - NEXT_PUBLIC_APP_URL, NODE_ENV
   - NEXT_PUBLIC_S3_BUCKET_URL

## 📱 반응형 디자인

### 브레이크포인트
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### 지원 브라우저
- Chrome (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- Edge (최신 2개 버전)

## 🌍 국제화 (i18n)

현재 한국어만 지원하며, 향후 다국어 지원 예정:
- **ko-KR**: 한국어 (기본)
- **en-US**: 영어 (예정)

## 🆕 최근 업데이트 (2026년 2월 기준)

### 신규 기능
1. **후원 시스템 강화** - CMS 자동이체 준비, 후원 처리 로직 개선
2. **마이페이지 개선** - 후원정보 표시 개선
3. **자료실 카테고리** - 카테고리별 자료 관리
4. **조직도 관리** - 조직 구성원 관리 기능
5. **사업/재정 보고서** - 보고서 관리 및 공개 기능

### 프레임워크 업그레이드
- **Next.js 16**: 최신 App Router 기능 활용
- **React 19**: 새로운 렌더링 최적화 적용
- **Tailwind CSS 4**: 새로운 유틸리티 클래스 사용

### 아키텍처 개선
- **Clean Architecture**: 도메인 주도 설계 적용
- **Repository Pattern**: 데이터 접근 추상화
- **DI Container (tsyringe)**: 의존성 주입 컨테이너 구축
- **Use Case Pattern**: 비즈니스 로직 캡슐화
- **Zod Validation**: 런타임 타입 검증 강화

---

*최종 업데이트: 2026년 2월 19일*