export default function MovementPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">토브운동</h1>
        <p className="text-xl text-center text-gray-700 mb-16 max-w-3xl mx-auto">
          투명하고 건강한 재정 문화를 만들어가는 토브협회의 다양한 운동에
          함께해주세요.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4">건강한 재정관리</h2>
            <p className="text-gray-600 mb-6">
              교회와 비영리단체의 투명하고 체계적인 재정관리를 위한 실무
              가이드와 컨설팅을 제공합니다.
            </p>
            <a
              href="/movement/financial-management"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              자세히 보기
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4">건강한 재정교육</h2>
            <p className="text-gray-600 mb-6">
              재정 투명성의 중요성과 실천 방법을 교육하여 건강한 재정 문화
              확산에 기여합니다.
            </p>
            <a
              href="/movement/financial-education"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              자세히 보기
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4">결산서 공개 운동</h2>
            <p className="text-gray-600 mb-6">
              교회와 비영리단체의 재정 투명성 향상을 위한 자발적 결산서 공개
              캠페인을 진행합니다.
            </p>
            <a
              href="/movement/financial-disclosure"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              자세히 보기
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4">종교인 소득신고</h2>
            <p className="text-gray-600 mb-6">
              종교인 소득세 신고를 위한 전문적인 정보와 실무 지원을 제공하는
              전문 사이트로 연결됩니다.
            </p>
            <a
              href="https://ptax.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              PTAX 바로가기
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">연대협력</h2>
            <p className="text-gray-600 mb-6">
              투명한 재정 문화 확산을 위해 다양한 기관 및 단체와 협력하여
              시너지를 창출하고 있습니다.
            </p>
            <a
              href="/movement/cooperation"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              자세히 보기
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
