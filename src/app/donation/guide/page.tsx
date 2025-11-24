import Link from "next/link";
import PageHeader from "@/presentation/components/common/PageHeader";

const donationBenefits = [
  {
    title: "기부금 영수증 발급",
    description: "연말정산시 세액공제 혜택을 받으실 수 있습니다.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "정기 소식지 발송",
    description: "토브협회의 활동 소식을 정기적으로 전해드립니다.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "투명한 재정 공개",
    description: "후원금 사용 내역을 투명하게 공개합니다.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
];

const donationTypes = [
  {
    type: "정기후원",
    description: "매월 일정 금액을 후원해주시는 방법입니다.",
    features: [
      "매월 자동 결제",
      "안정적인 사업 운영 지원",
      "언제든지 변경/해지 가능",
      "소액부터 가능",
    ],
  },
  {
    type: "일시후원",
    description: "원하실 때 자유롭게 후원해주시는 방법입니다.",
    features: [
      "1회성 후원",
      "원하는 금액 자유 선택",
      "특별 프로젝트 지원",
      "즉시 후원 가능",
    ],
  },
];

const howToUse = [
  {
    title: "교육 프로그램 운영",
    description: "비영리단체 실무자 교육",
    percentage: 0,
  },
  {
    title: "상담 서비스 제공",
    description: "무료 전문가 상담",
    percentage: 0,
  },
  {
    title: "자료 개발 및 배포",
    description: "실무 가이드북 제작",
    percentage: 0,
  },
  {
    title: "운영비",
    description: "사무실 운영 및 인건비",
    percentage: 0,
  },
];

export default function DonationGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600">
              홈
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link href="/donation" className="hover:text-blue-600">
              후원하기
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-900 font-medium">후원안내</li>
        </ol>
      </nav>

      <PageHeader
        title="함께 만드는 투명한 비영리"
        description="여러분의 후원이 건강한 비영리 생태계를 만듭니다"
      />
      <div className="text-center mb-16">
        <Link
          href="/donation/apply"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          후원 신청하기
        </Link>
      </div>

      {/* Why Donate */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">후원자 혜택</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {donationBenefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {benefit.icon}
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Donation Types */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">후원 방법</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
          {donationTypes.map((item) => (
            <div key={item.type} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-3">{item.type}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <ul className="space-y-2">
                {item.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How We Use Donations */}
      <section className="mb-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-12">후원금 사용처</h2>
        <div className="mx-auto">
          {howToUse.map((item) => (
            <div key={item.title} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {item.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bank Account Info */}
      <section className="mb-16">
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-6">후원 계좌 안내</h2>
          <div className="mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">은행명</p>
              <p className="font-semibold mb-4">국민은행</p>
              <p className="text-sm text-gray-600 mb-2">계좌번호</p>
              <p className="text-xl font-bold text-blue-600 mb-4">
                123-456-789012
              </p>
              <p className="text-sm text-gray-600 mb-2">예금주</p>
              <p className="font-semibold">사단법인 토브협회</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          지금 바로 후원에 참여해주세요
        </h2>
        <p className="text-gray-600 mb-8">
          여러분의 관심과 후원이 더 나은 비영리 문화를 만들어갑니다
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/donation/apply"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            후원 신청
          </Link>
          <Link
            href="/donation/report"
            className="inline-block px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            재정 보고서
          </Link>
        </div>
      </div>
    </div>
  );
}
