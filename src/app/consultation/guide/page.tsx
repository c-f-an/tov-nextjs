import Link from 'next/link';

const consultationSteps = [
  {
    step: 1,
    title: '상담 신청',
    description: '온라인으로 간편하게 상담을 신청하세요.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    step: 2,
    title: '전문가 배정',
    description: '분야별 전문가가 배정됩니다.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    step: 3,
    title: '상담 진행',
    description: '전화, 이메일, 방문 상담이 진행됩니다.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    step: 4,
    title: '결과 확인',
    description: '상담 결과와 자료를 확인하세요.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  }
];

const consultationTypes = [
  {
    title: '종교인 소득세',
    description: '종교인 소득세 신고 방법, 비과세 한도, 필요경비 처리 등',
    features: ['소득세 신고 안내', '비과세 한도 확인', '필요경비 계산', '절세 방안 제시']
  },
  {
    title: '비영리 회계',
    description: '비영리법인 회계 기준, 장부 작성, 재무제표 작성 등',
    features: ['회계 기준 안내', '장부 작성 방법', '재무제표 작성', '회계 감사 대비']
  },
  {
    title: '결산 공시',
    description: '공익법인 결산서류 공시, 국세청 공시 시스템 사용법 등',
    features: ['공시 의무 안내', '공시 서류 작성', '시스템 사용법', '공시 일정 관리']
  },
  {
    title: '일반 상담',
    description: '비영리 운영 전반에 대한 상담, 법인 설립, 세무 신고 등',
    features: ['법인 설립 절차', '세무 신고 안내', '운영 관련 상담', '기타 문의사항']
  }
];

export default function ConsultationGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600">홈</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link href="/consultation" className="hover:text-blue-600">상담센터</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-900 font-medium">상담안내</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">전문가 상담 서비스</h1>
        <p className="text-xl text-gray-600 mb-8">
          15년 이상의 경력을 가진 전문가들이 직접 상담해드립니다
        </p>
        <Link
          href="/consultation/apply"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          상담 신청하기
        </Link>
      </div>

      {/* Consultation Process */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">상담 진행 절차</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {consultationSteps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <div className="text-sm text-gray-500 mb-2">STEP {item.step}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Types */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">상담 분야</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {consultationTypes.map((type) => (
            <div key={type.title} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
              <p className="text-gray-600 mb-4">{type.description}</p>
              <ul className="space-y-2">
                {type.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-12">왜 토브협회 상담인가요?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">무료</div>
            <h3 className="font-semibold mb-2">상담료 없음</h3>
            <p className="text-sm text-gray-600">
              모든 상담은 무료로 제공됩니다. 부담 없이 문의하세요.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">전문가</div>
            <h3 className="font-semibold mb-2">검증된 전문성</h3>
            <p className="text-sm text-gray-600">
              세무사, 회계사 등 각 분야 전문가가 직접 상담합니다.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">맞춤형</div>
            <h3 className="font-semibold mb-2">개별 맞춤 상담</h3>
            <p className="text-sm text-gray-600">
              각 단체의 상황에 맞는 최적의 솔루션을 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center bg-blue-600 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">지금 바로 상담을 시작하세요</h2>
        <p className="mb-6">온라인으로 간편하게 신청하고, 전문가의 도움을 받아보세요.</p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/consultation/apply"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
          >
            상담 신청
          </Link>
          <Link
            href="/consultation/faq"
            className="inline-block px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
          >
            자주 묻는 질문
          </Link>
        </div>
      </div>
    </div>
  );
}