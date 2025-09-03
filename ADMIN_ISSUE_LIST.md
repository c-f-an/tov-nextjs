# Admin 기능 이슈 리스트

## 현재 구현 상태 분석

### 구현된 부분
1. **Admin UI 페이지들**
   - `/admin` - 대시보드 (mock 데이터)
   - `/admin/posts` - 게시글 관리
   - `/admin/users` - 회원 관리 (mock 데이터)
   - `/admin/consultations` - 상담 관리
   - `/admin/donations` - 후원 관리
   - `/admin/categories` - 카테고리 관리
   - `/admin/sponsors` - 후원자 관리
   - `/admin/settings` - 사이트 설정
   - `/admin/profile` - 프로필 설정

2. **AdminLayout 컴포넌트**
   - 사이드바 네비게이션
   - 상단 헤더
   - 로그아웃 기능

3. **미들웨어 인증**
   - `/admin` 경로 보호
   - JWT 토큰 검증

### 미구현 부분
1. **Admin API 엔드포인트**
   - `/api/admin/*` 경로에 API가 전혀 없음
   - 모든 admin 페이지가 mock 데이터 사용 중

2. **권한 관리 시스템**
   - User 테이블에 role/isAdmin 필드 없음
   - Admin 권한 체크 로직 없음
   - 일반 사용자와 관리자 구분 불가

3. **실제 기능 연동**
   - 대시보드 통계 데이터
   - 회원 관리 CRUD
   - 게시글 일괄 관리
   - 상담/후원 관리
   - 사이트 설정 저장

## 개발 필요 항목

### 1. 데이터베이스 스키마 수정
- [ ] users 테이블에 `role` 또는 `is_admin` 필드 추가
- [ ] admin_logs 테이블 생성 (관리자 활동 로그)
- [ ] site_settings 테이블 생성 (사이트 설정 저장)

### 2. Admin API 엔드포인트 개발
- [ ] `/api/admin/dashboard` - 대시보드 통계 API
- [ ] `/api/admin/users` - 회원 관리 API (목록, 상태변경, 권한변경)
- [ ] `/api/admin/posts` - 게시글 관리 API (일괄삭제, 상태변경)
- [ ] `/api/admin/consultations` - 상담 관리 API
- [ ] `/api/admin/donations` - 후원 관리 API
- [ ] `/api/admin/settings` - 사이트 설정 API
- [ ] `/api/admin/logs` - 관리자 활동 로그 API

### 3. 권한 관리 시스템
- [ ] Admin 권한 체크 미들웨어 개선
- [ ] Role 기반 접근 제어 (RBAC) 구현
- [ ] Admin 사용자 생성/관리 기능

### 4. Admin 페이지 기능 구현
- [ ] 대시보드 실제 데이터 연동
- [ ] 회원 관리 (검색, 필터, 상태변경, 메일발송)
- [ ] 게시글 일괄 관리 (선택삭제, 카테고리 이동)
- [ ] 상담 신청 관리 (상태변경, 답변)
- [ ] 후원 내역 관리 (통계, 엑셀 다운로드)
- [ ] 사이트 설정 (로고, 메타정보, 약관 등)

### 5. 보안 강화
- [ ] Admin 로그인 2차 인증
- [ ] IP 화이트리스트
- [ ] 관리자 활동 로그 기록
- [ ] 세션 타임아웃 설정

### 6. 추가 기능
- [ ] 통계 대시보드 차트 구현
- [ ] 회원 일괄 메일 발송
- [ ] 백업/복원 기능
- [ ] 시스템 모니터링

## 우선순위 개발 계획

### Phase 1 (긴급)
1. users 테이블에 role 필드 추가
2. Admin 권한 체크 로직 구현
3. 기본 Admin API 엔드포인트 생성

### Phase 2 (중요)
1. 대시보드 통계 API 및 연동
2. 회원 관리 기능 구현
3. 게시글 관리 기능 개선

### Phase 3 (선택)
1. 사이트 설정 기능
2. 관리자 활동 로그
3. 고급 통계 및 차트

## 기술 스택
- Next.js 14 (App Router)
- MySQL (기존 DB 활용)
- JWT 인증 (기존 시스템 활용)
- TailwindCSS (UI)