export default function FinancialManagementPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">건강한 재정관리</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <p className="text-lg text-gray-700 mb-6">
              토브협회는 교회와 비영리단체가 투명하고 체계적인 재정관리를 실천할 수 있도록 
              다양한 프로그램과 서비스를 제공하고 있습니다.
            </p>
          </div>

          <div className="grid gap-8 mb-12">
            <div className="bg-blue-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">재정관리 컨설팅</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>회계 시스템 구축 및 개선</li>
                <li>내부 통제 시스템 설계</li>
                <li>재정 운영 규정 수립</li>
                <li>예산 수립 및 관리 방안</li>
                <li>재정 투명성 향상 방안</li>
              </ul>
            </div>

            <div className="bg-green-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">실무자 교육 프로그램</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>비영리회계 기초 과정</li>
                <li>교회회계 실무 과정</li>
                <li>결산 및 세무신고 실무</li>
                <li>재정관리 소프트웨어 활용법</li>
                <li>투명한 재정보고서 작성법</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">재정 건강성 진단</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>현행 재정관리 시스템 분석</li>
                <li>재정 투명성 수준 평가</li>
                <li>개선 과제 도출 및 제안</li>
                <li>맞춤형 솔루션 제공</li>
                <li>지속적인 모니터링 지원</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">참여 방법</h2>
            <p className="text-gray-700 mb-4">
              건강한 재정관리에 관심이 있으신 교회나 비영리단체는 아래 연락처로 문의해주세요.
            </p>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>전화:</strong> 02-737-8710
              </p>
              <p className="text-gray-700">
                <strong>이메일:</strong> tov@tov.or.kr
              </p>
            </div>
            <div className="mt-6">
              <a 
                href="/consultation/apply" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                상담 신청하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}