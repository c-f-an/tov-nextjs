# TOV Next.js - Claude Code 프로젝트 규칙

## 기술 스택 참고
- Next.js 16 App Router, React 19, TypeScript 5
- MySQL2 (prepared statements 필수), tsyringe DI
- TailwindCSS 4, Zod 유효성 검사
- JWT 인증 (Access + Refresh Token), bcryptjs
- AWS S3 파일 업로드, SendGrid 이메일

---

## 1. 서브에이전트 자동 선택 규칙

작업 시작 전 아래 기준으로 적절한 서브에이전트를 먼저 실행하라.
직접 구현에 들어가기 전 반드시 해당 에이전트를 호출해야 한다.

| 상황 | 에이전트 |
|------|---------|
| 요구사항이 불명확하거나 구현 계획이 필요한 경우 | `requirements-planner` |
| 기능 구현 완료 후 품질/패턴 검토 | `code-reviewer` |
| 새 DB 테이블, 마이그레이션, 쿼리 최적화, 인덱스 | `db-expert` |
| 새 페이지 또는 UI 컴포넌트 생성 | `ui-scaffolder` |
| 인증/기부/개인정보 처리 등 민감 기능 배포 전 | `security-auditor` |
| 에러, 버그, 예상치 못한 동작 발생 시 | `bug-investigator` |

**예외**: 한 줄 수정, 명확한 오타 수정 등 단순 작업은 에이전트 없이 직접 수행해도 된다.

---

## 2. 코드 변경 시 테스트 규칙

소스 파일을 **변경 또는 생성**할 때마다 아래를 따르라.

### 테스트 파일이 있는 경우
- 관련 테스트를 즉시 실행하라 (PostToolUse 훅이 자동 실행함)
- 테스트 실패 시 코드 또는 테스트를 수정하고 다시 실행하라
- 테스트가 통과한 후에만 작업 완료로 간주하라

### 테스트 파일이 없는 경우
- 변경한 파일의 핵심 로직에 대한 테스트를 **반드시** 생성하라
- `/gen-tests` 스킬을 사용하거나 직접 생성하라

### 테스트 프레임워크 및 규칙
```
테스트 러너: Vitest (미설치 시: npm install -D vitest @vitest/ui 제안)
테스트 위치: [파일명].test.ts (소스와 같은 디렉토리)
           또는 __tests__/[파일명].test.ts
테스트 제외: *.config.*, middleware.ts, globals.css, 순수 타입 파일
```

### 테스트 우선순위
1. **도메인 로직** (use-cases, domain services) → 반드시 테스트
2. **Repository 쿼리** (MySQLXxxRepository) → 핵심 메서드 테스트
3. **API Route handlers** → 인증/에러 케이스 위주
4. **UI 컴포넌트** → 인터랙션이 있는 컴포넌트만

---

## 3. 코드 변경 시 문서화 규칙

아래 경우에 해당하면 문서도 함께 업데이트하라.

### 자동 업데이트 대상
| 변경 내용 | 업데이트할 문서 |
|----------|---------------|
| 새 API Route 추가 | `docs/api/` 디렉토리에 엔드포인트 문서 작성 |
| DB 스키마 변경 | `DB_CONNECTION_GUIDE.md` 관련 섹션 |
| ISSUE_LIST의 항목 해결 | `ISSUE_LIST.md` 또는 `ADMIN_ISSUE_LIST.md`에서 체크 |
| 새 환경변수 추가 | `README.md`의 환경변수 섹션 |
| 배포 관련 변경 | `deploy-on-ec2.sh` 또는 관련 가이드 |

### 문서화 형식 (API)
```markdown
## POST /api/donations
**인증**: 필요 (Bearer Token)
**요청**: { amount: number, donorName: string, ... }
**응답**: { success: true, donationId: number }
**에러**: 400 (유효성 검사 실패), 401 (미인증)
```

### `/update-docs` 스킬로 대화형 문서화도 가능

---

## 4. 아키텍처 준수 규칙

- 레이어 의존성 방향: `app/api` → `application/use-cases` → `domain` ← `infrastructure`
- 도메인 레이어에 mysql2, aws-sdk 등 인프라 코드 사용 금지
- 모든 Repository는 `infrastructure/repositories/MySQLXxx.ts` 패턴 따름
- tsyringe `@injectable()` 데코레이터 누락 주의
- SQL 쿼리는 반드시 prepared statements (`?` 플레이스홀더) 사용

---

## 5. 빌드 에러 체크 규칙

아래 상황에서 반드시 `/check-build` 스킬을 실행하라.

| 상황 | 행동 |
|------|------|
| 소스 파일 2개 이상 수정 후 | `/check-build` 실행 |
| 새 파일 생성 후 | `/check-build` 실행 |
| import/export 구조 변경 후 | `/check-build` 실행 |
| 타입 정의 변경 후 | `/check-build` 실행 |
| 작업 완료 선언 직전 | `/check-build` 실행 |

`/check-build` 결과 에러가 있으면 작업 완료로 간주하지 말고 반드시 수정하라.

**예외**: 단순 텍스트/스타일 변경, 주석 수정은 생략 가능

---

## 6. 일반 규칙

- 한국어로 커뮤니케이션 (코드와 기술 용어는 영어)
- 불필요한 console.log 남기지 않기
- 환경변수는 반드시 `process.env`로 접근, 코드에 하드코딩 금지
