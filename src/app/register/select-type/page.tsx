'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

const RECOMMEND_USER_TYPE = 2;
const MEMBER_TYPES = [
  {
    userType: 2,
    label: '정회원',
    features: [
      '정기회비 납부',
      '의결권 행사(이사회 승인)',
      '협회 주요 사업 결정 참여',
      '회원 전용 자료실 이용',
    ],
  },
  {
    userType: 1,
    label: '후원회원',
    features: [
      '자유로운 후원금 납부',
      '승인 절차 없이 즉시 가입',
      '협회 소식지 정기 구독',
      '기부금 영수증 발행',
    ],
  },
  {
    userType: 0,
    label: '일반회원',
    features: [
      '회비 및 후원금 없음',
      '커뮤니티 활동 가능',
      '자료실 이용',
    ],
  },
];

export default function SelectMemberTypePage() {
  const router = useRouter();

  const handleSelect = (userType: number) => {
    router.push(`/register?userType=${userType}`);
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* 타이틀 섹션 */}
      <div className="pt-20 pb-12 text-center">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">회원가입</h1>
        <p className="mt-3 text-base text-muted-foreground">
          가입하실 회원 종류를 선택해주세요.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            로그인
          </Link>
        </p>
      </div>

      {/* 카드 영역 */}
      <div className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {MEMBER_TYPES.map(({ userType, label, features }) => {
            const highlight = userType === RECOMMEND_USER_TYPE;
            return (
              <div
                key={userType}
                className={[
                  'relative flex flex-col rounded-2xl border',
                  highlight
                    ? 'bg-primary border-primary text-primary-foreground shadow-2xl -translate-y-2'
                    : 'bg-white border-light text-foreground shadow-md',
                ].join(' ')}
              >
                {/* 추천 배지 */}
                {highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-secondary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                      추천
                    </span>
                  </div>
                )}

                {/* 헤더 */}
                <div className={[
                  'px-8 pt-10 pb-6 border-b',
                  highlight ? 'border-white/20' : 'border-light',
                ].join(' ')}>
                  <h2 className="text-2xl font-bold">{label}</h2>
                </div>

                {/* 혜택 목록 */}
                <ul className="flex-1 px-8 pt-7 pb-4 space-y-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm leading-relaxed">
                      <span className={[
                        'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
                        highlight ? 'bg-white/20' : 'bg-secondary/10',
                      ].join(' ')}>
                        <Check className={[
                          'h-3 w-3',
                          highlight ? 'text-white' : 'text-secondary',
                        ].join(' ')} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* 버튼 */}
                <div className="px-8 pt-8 pb-10">
                  <button
                    onClick={() => handleSelect(userType)}
                    className={[
                      'w-full rounded-xl py-3 text-sm font-semibold transition-all cursor-pointer',
                      highlight
                        ? 'bg-white text-primary hover:bg-gray-100'
                        : 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
                    ].join(' ')}
                  >
                    가입하기
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
