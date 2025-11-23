import PageHeader from "@/presentation/components/common/PageHeader";

export default function FinancialDisclosurePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <PageHeader
          title="결산서 공개 운동"
          description="결산서 공개 운동은 교회와 비영리단체의 재정 투명성을 높이고, 후원자와 구성원들의 신뢰를 강화하기 위한 자발적 참여 캠페인입니다."
        />

        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">
              왜 결산서를 공개해야 할까요?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>후원자와 구성원들의 신뢰 향상</li>
              <li>재정 운영의 책임성 강화</li>
              <li>투명한 운영으로 기부문화 활성화</li>
              <li>내부 재정관리 역량 향상</li>
              <li>사회적 신뢰도 제고</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">참여 방법</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>결산서 공개 서약서 작성</li>
                <li>토브협회 검토 및 승인</li>
                <li>결산서 공개 인증마크 발급</li>
                <li>홈페이지/게시판 결산서 게시</li>
                <li>연간 결산서 업데이트</li>
              </ol>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">지원 내용</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>결산서 작성 가이드 제공</li>
                <li>표준 양식 및 템플릿 제공</li>
                <li>결산서 검토 서비스</li>
                <li>공개 인증마크 사용권</li>
                <li>우수사례 홍보 지원</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">참여 현황</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold text-purple-600">0</p>
                <p className="text-gray-700">참여 교회</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-600">0</p>
                <p className="text-gray-700">참여 단체</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-600">0</p>
                <p className="text-gray-700">전체 참여기관</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-blue-200 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">결산서 공개 우수사례</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg">사례 없음.</h3>
              </div>

              {/* <div className="border-b pb-4">
                <h3 className="font-semibold text-lg">○○교회</h3>
                <p className="text-gray-600">
                  매년 정기총회에서 상세한 결산서를 공개하고, 홈페이지를 통해
                  누구나 열람할 수 있도록 게시. 투명성으로 신뢰도 크게 향상.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg">△△복지재단</h3>
                <p className="text-gray-600">
                  분기별 재정보고서를 홈페이지와 소식지에 공개. 후원금 사용
                  내역을 구체적으로 명시하여 후원자 증가.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">□□선교회</h3>
                <p className="text-gray-600">
                  외부 회계감사를 받은 결산서를 매년 공개. 투명한 재정운영으로
                  기업 후원 유치 성공.
                </p>
              </div> */}
            </div>
          </div>

          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              결산서 공개 운동 참여하기
            </h2>
            <p className="text-gray-700 mb-4">
              투명한 재정문화를 만들어가는 결산서 공개 운동에 동참해주세요.
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-gray-700">
                <strong>전화:</strong> 02-6951-1391
              </p>
              <p className="text-gray-700">
                <strong>이메일:</strong> tov.npo@gmail.com
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="/consultation/apply"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                참여 신청하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
