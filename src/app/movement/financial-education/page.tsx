export default function FinancialEducationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">건강한 재정 교육</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <p className="text-lg text-gray-700 mb-6">
              토브협회는 교회와 비영리단체의 재정 투명성 문화를 확산시키기 위해 
              다양한 교육 프로그램을 운영하고 있습니다.
            </p>
          </div>

          <div className="grid gap-8 mb-12">
            <div className="bg-blue-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">정기 교육 프로그램</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">비영리회계 기초과정</h3>
                  <p className="text-gray-700">
                    매월 첫째 주 토요일 / 오전 9시-오후 1시<br/>
                    비영리회계의 기본 개념부터 실무까지 체계적으로 학습
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">교회 재정관리 실무과정</h3>
                  <p className="text-gray-700">
                    매월 셋째 주 토요일 / 오전 9시-오후 1시<br/>
                    교회 특성에 맞춘 재정관리 방법과 실무 교육
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">투명한 재정보고서 작성법</h3>
                  <p className="text-gray-700">
                    분기별 1회 / 오전 10시-오후 3시<br/>
                    이해하기 쉽고 투명한 재정보고서 작성 방법
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">맞춤형 교육</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>교회/단체별 맞춤형 재정교육</li>
                <li>이사회 대상 재정 투명성 교육</li>
                <li>재정담당자 역량 강화 교육</li>
                <li>온라인 화상 교육 지원</li>
                <li>소그룹 집중 교육</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">교육 특전</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>교육 수료증 발급</li>
                <li>교육자료 및 템플릿 제공</li>
                <li>1년간 무료 상담 지원</li>
                <li>재정관리 소프트웨어 할인</li>
                <li>후속 교육 우선 신청 기회</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">온라인 교육 자료실</h2>
            <p className="text-gray-700 mb-4">
              언제 어디서나 학습할 수 있는 온라인 교육 콘텐츠를 제공합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>재정관리 기초 동영상 강의</li>
              <li>회계처리 실무 가이드북</li>
              <li>재정투명성 체크리스트</li>
              <li>우수사례 소개 자료</li>
            </ul>
            <a 
              href="/resources" 
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              자료실 바로가기
            </a>
          </div>

          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">교육 신청</h2>
            <p className="text-gray-700 mb-4">
              교육 프로그램에 참여를 원하시는 분은 아래 연락처로 문의해주세요.
            </p>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>전화:</strong> 02-737-8710
              </p>
              <p className="text-gray-700">
                <strong>이메일:</strong> edu@tov.or.kr
              </p>
            </div>
            <div className="mt-6">
              <a 
                href="/consultation/apply" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                교육 신청하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}