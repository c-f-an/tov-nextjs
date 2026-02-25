# TOV Next.js 프로젝트 - 요구사항 분석 메모리

## 현재 아키텍처 이해

### 도메인 엔티티 구조
- **User** (`src/core/domain/entities/User.ts`):
  - UserType enum: NORMAL(0), SPONSOR(1), MEMBER(2), PENDING(3) - 이미 정의되어 있음
  - 현재는 모든 신규 가입자가 NORMAL 타입으로 생성됨
  - DB 칼럼: user_type (int)

- **Sponsor** (`src/core/domain/entities/Sponsor.ts`):
  - SponsorType: individual, organization
  - SponsorStatus: active, inactive, paused
  - userId 필드: User와 1:N 관계 (nullable)

### 레이어 구조 (클린 아키텍처)
```
app/[pages] → api/[routes] → application/use-cases → domain/entities,repositories,services
                                                    ↓
                         infrastructure/repositories → database
```

### 주요 파일 위치
- 회원가입: `/register/page.tsx` → API `/api/auth/register` → `RegisterUseCase`
- 후원신청: `/donation/apply/page.tsx`
- Repository: `src/infrastructure/repositories/MySQL*.ts`
- DTO: `src/core/application/dto/AuthDto.ts`
- DI Container: `src/infrastructure/config/container.ts`

## 구현 시 주의사항

1. **UserType 활용**: User 엔티티에 이미 정회원/후원회원 구분이 가능한 인프라가 있음
2. **Register 플로우 변경 필요**: 현재는 회원가입 후 대시보드로 바로 이동 (AuthContext.tsx:101)
3. **후원 메시지 동적화**: `/donation/apply/page.tsx`의 NOTICE_ITEMS는 하드코딩됨
4. **Sponsor와 User 연결**: CreateSponsorUseCase에서 userId 활용 필요
