# 🔐 사용자 인증 및 권한 (Authentication & Authorization)

## 📋 개요

TOV 시스템의 사용자 인증 및 권한 관리 시스템에 대한 명세입니다.

## 🔑 인증 시스템 (Authentication)

### JWT 토큰 구조

#### Access Token
```json
{
  "userId": 1,
  "email": "user@example.com",
  "loginType": "email",
  "role": "ADMIN",
  "iat": 1697280000,
  "exp": 1697280900  // 15분 (900초)
}
```

#### Refresh Token
```json
{
  "userId": 1,
  "tokenId": "uuid-v4",
  "iat": 1697280000,
  "exp": 1697884800  // 7일 (604800초)
}
```

### 토큰 저장 방식
- **Access Token**: Authorization 헤더 (Bearer token)
- **Refresh Token**: HttpOnly Cookie (SHA256 해시 후 DB 저장)
- **보안**:
  - HTTPS 전송 필수
  - SameSite 쿠키 설정
  - SHA256 해싱으로 DB 저장
  - JWT 블랙리스트 관리 (jwt_blacklist 테이블)
  - 토큰 회전(rotation) 지원

## 👤 회원가입

### 회원가입 프로세스
```
1. 이메일/비밀번호 입력
   ↓
2. 유효성 검증
   - 이메일 형식 체크
   - 비밀번호 강도 체크 (최소 8자)
   - 중복 이메일 체크
   ↓
3. 추가 정보 입력 (선택)
   - 이름
   - 연락처
   - 교회명
   - 직분
   ↓
4. 계정 생성
   ↓
5. 환영 이메일 발송 (설정 시)
   ↓
6. 자동 로그인
```

### 회원가입 필드

| 필드 | 타입 | 필수 | 검증 규칙 |
|------|------|------|-----------|
| email | string | ✅ | 이메일 형식, 중복 체크 |
| password | string | ✅ | 최소 8자, 영문+숫자 |
| confirmPassword | string | ✅ | password와 일치 |
| name | string | ✅ | 2-50자 |
| phone | string | ❌ | 휴대폰 번호 형식 |
| churchName | string | ❌ | 최대 100자 |
| position | string | ❌ | 최대 50자 |
| denomination | string | ❌ | 최대 50자 |
| agreeTerms | boolean | ✅ | true 필수 |
| agreePrivacy | boolean | ✅ | true 필수 |

### API 엔드포인트
- **POST** `/api/auth/register`

## 🔓 로그인

### 로그인 프로세스
```
1. 이메일/비밀번호 입력
   ↓
2. 자격 증명 확인
   ↓
3. 계정 상태 확인 (active/inactive/suspended)
   ↓
4. JWT 토큰 생성
   ↓
5. 토큰 전송 및 저장
   ↓
6. 대시보드 리다이렉트
```

### 로그인 유형
- **이메일 로그인**: 기본 로그인 방식
- **소셜 로그인**: (테이블 준비 완료, 구현 예정)
  - Google OAuth 2.0
  - Naver Login
  - Kakao Login
  - Apple Sign In

### 로그인 보안 강화
- **로그인 시도 추적**: login_attempts 테이블에 기록
  - IP 주소 기록
  - User Agent 기록
  - 성공/실패 상태
  - 실패 사유
- **멀티 디바이스 세션 관리**: user_devices 테이블
  - 디바이스별 세션 추적
  - 신뢰할 수 있는 디바이스 관리
  - 최종 활동 시간 추적

### API 엔드포인트
- **POST** `/api/auth/login`

## 🔒 로그아웃

### 로그아웃 프로세스
```
1. 로그아웃 요청
   ↓
2. Refresh Token 무효화 (DB)
   ↓
3. 쿠키 삭제
   ↓
4. 클라이언트 토큰 제거
   ↓
5. 홈페이지 리다이렉트
```

### API 엔드포인트
- **POST** `/api/auth/logout`

## 🔄 토큰 갱신

### 자동 갱신 프로세스
```
1. Access Token 만료 감지
   ↓
2. Refresh Token으로 갱신 요청
   ↓
3. Refresh Token 유효성 검증
   ↓
4. 새 Access Token 생성
   ↓
5. 선택적: 새 Refresh Token 생성 (Rotation)
   ↓
6. 토큰 전송 및 저장
```

### API 엔드포인트
- **POST** `/api/auth/refresh`

## 👥 사용자 역할 (Roles)

### 역할 정의
| 역할 | 코드 | 설명 | 권한 레벨 |
|------|------|------|-----------|
| 일반 회원 | USER | 기본 회원 권한 | 1 |
| 관리자 | ADMIN | 전체 시스템 관리 권한 | 9 |

### 역할별 권한

#### USER (일반 회원)
- ✅ 공개 콘텐츠 열람
- ✅ 마이페이지 접근
- ✅ 상담 신청
- ✅ 후원 신청
- ✅ 게시물 댓글 작성
- ❌ 관리자 페이지 접근
- ❌ 다른 회원 정보 열람

#### ADMIN (관리자)
- ✅ 모든 USER 권한
- ✅ 관리자 대시보드 접근
- ✅ 회원 관리 (CRUD)
- ✅ 게시물 관리 (CRUD)
- ✅ 상담 관리
- ✅ 후원 관리
- ✅ 시스템 설정
- ✅ 로그 조회

## 🚦 계정 상태 (Status)

### 상태 정의
| 상태 | 코드 | 설명 | 로그인 가능 |
|------|------|------|-------------|
| 활성 | active | 정상 활동 가능 | ✅ |
| 비활성 | inactive | 휴면 계정 | ❌ |
| 정지 | suspended | 관리자 정지 | ❌ |
| 삭제 | deleted | 탈퇴/삭제 | ❌ |

### 상태 전환 규칙
```
active → inactive: 90일 미접속
active → suspended: 관리자 정지 조치
inactive → active: 재로그인
suspended → active: 관리자 정지 해제
* → deleted: 회원 탈퇴 또는 관리자 삭제
```

## 🛡️ 보안 기능

### 비밀번호 보안
- **암호화**: bcrypt (salt rounds: 10)
- **최소 요구사항**: 8자 이상, 영문+숫자
- **비밀번호 재설정**: 이메일 인증 링크

### 로그인 보안
- **실패 제한**: 5회 실패 시 15분 잠금
- **이상 접속 감지**: IP 변경 감지
- **세션 관리**: 동시 로그인 제한 (선택)

### CSRF 보호
- **토큰 검증**: API 요청 시 CSRF 토큰 검증
- **SameSite Cookie**: CSRF 공격 방지

## 📊 관리자 기능

### 회원 관리
- **회원 목록 조회**: 필터링, 검색, 페이지네이션
- **회원 상세 조회**: 전체 프로필 정보
- **회원 정보 수정**: 개인정보, 권한, 상태
- **일괄 작업**:
  - 일괄 상태 변경
  - 일괄 이메일 발송
  - 일괄 계정 정지
  - 일괄 삭제

### 로그 관리
- **로그인 로그**: login_attempts 테이블에 모든 로그인 시도 기록
- **활동 로그**: activity_logs 테이블에 사용자 활동 기록
- **관리자 로그**: admin_logs 테이블에 관리 작업 상세 기록 (JSON details)
- **디바이스 로그**: user_devices 테이블에 디바이스별 세션 추적

## 🔧 설정

### 인증 관련 환경변수
```env
# JWT 설정
JWT_ACCESS_SECRET=your-access-secret-key-at-least-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-at-least-32-chars
JWT_ACCESS_EXPIRY=15m   # 15분 (실제 구현)
JWT_REFRESH_EXPIRY=7d   # 7일 (실제 구현)

# 보안 설정
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=15m

# 소셜 로그인 (준비됨, 구현 예정)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
```

## 📱 클라이언트 구현

### 인증 상태 관리
```typescript
// React Context 사용
const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}>({...});
```

### 보호된 라우트
```typescript
// 인증 필요 페이지
<ProtectedRoute requiredRole="USER">
  <MyPage />
</ProtectedRoute>

// 관리자 전용 페이지
<ProtectedRoute requiredRole="ADMIN">
  <AdminDashboard />
</ProtectedRoute>
```

## 🚨 에러 처리

### 인증 관련 에러 코드
| 코드 | 메시지 | 설명 |
|------|--------|------|
| AUTH001 | Invalid credentials | 잘못된 이메일/비밀번호 |
| AUTH002 | Account suspended | 계정 정지 상태 |
| AUTH003 | Account inactive | 비활성 계정 |
| AUTH004 | Token expired | 토큰 만료 |
| AUTH005 | Invalid token | 유효하지 않은 토큰 |
| AUTH006 | Unauthorized | 권한 없음 |
| AUTH007 | Too many attempts | 로그인 시도 초과 |

## 🆕 2FA (이중 인증) - 준비 완료

### Two-Factor Authentication
시스템에 2FA 지원 테이블이 준비되어 있습니다:

**two_factor_auth 테이블**:
- user_id (UNIQUE): 사용자 ID
- secret (암호화): TOTP 시크릿 키
- recovery_codes (JSON): 복구 코드 목록
- enabled_at: 활성화 일시
- last_used_at: 마지막 사용 일시

### 구현 예정 기능
- Google Authenticator 연동
- SMS 인증 코드
- 복구 코드 생성
- 신뢰할 수 있는 디바이스 관리

## 🔐 추가 보안 기능 (구현됨)

### Refresh Token 관리
- **DB 저장**: refresh_tokens 테이블에 SHA256 해시로 저장
- **디바이스 정보**: device_info, ip_address 기록
- **만료 관리**: expires_at 자동 체크
- **토큰 무효화**: revoked_at, revoked_reason 지원

### JWT 블랙리스트
- **jwt_blacklist 테이블**: 무효화된 JWT 관리
- **JTI (JWT ID)**: 각 토큰의 고유 ID
- **자동 정리**: 만료된 토큰 자동 삭제

### 비밀번호 재설정
- **password_reset_tokens 테이블**:
  - email: 재설정 요청 이메일
  - token: 재설정 토큰 (해시)
  - created_at: 생성 시간 (1시간 유효)

### 이메일/SMS 인증
- **verification_codes 테이블**:
  - identifier: 이메일 또는 전화번호
  - code: 인증 코드
  - type: 'email', 'sms', '2fa'
  - expires_at: 만료 시간
  - attempts: 시도 횟수 (최대 3회)

---

*최종 업데이트: 2025년 1월 29일*