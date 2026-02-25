'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MEMBER_TYPES = [
  {
    userType: 2,
    label: '정회원',
    description: '정기 후원을 통해 TOV를 지속적으로 응원하고 싶으신 분',
    badge: '정기후원',
    badgeColor: 'bg-blue-100 text-blue-700',
    borderColor: 'border-blue-300 hover:border-blue-500',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    userType: 1,
    label: '후원회원',
    description: '일시적인 후원으로 TOV의 활동을 응원하고 싶으신 분',
    badge: '일시후원',
    badgeColor: 'bg-green-100 text-green-700',
    borderColor: 'border-green-300 hover:border-green-500',
    buttonColor: 'bg-green-600 hover:bg-green-700',
  },
  {
    userType: 0,
    label: '일반회원',
    description: '후원 없이 TOV 회원으로 가입하고 싶으신 분',
    badge: '비후원',
    badgeColor: 'bg-gray-100 text-gray-600',
    borderColor: 'border-gray-200 hover:border-gray-400',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
  },
];

export default function SelectMemberTypePage() {
  const router = useRouter();

  const handleSelect = (userType: number) => {
    router.push(`/register?userType=${userType}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원 종류 선택
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          가입하실 회원 종류를 선택해주세요.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="space-y-4">
          {MEMBER_TYPES.map(({ userType, label, description, badge, badgeColor, borderColor, buttonColor }) => (
            <button
              key={userType}
              onClick={() => handleSelect(userType)}
              className={`w-full text-left bg-white rounded-xl border-2 p-6 shadow-sm transition-all cursor-pointer ${borderColor}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-gray-900">{label}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
                      {badge}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
                <span className={`mt-1 flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-white ${buttonColor}`}>
                  선택
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
