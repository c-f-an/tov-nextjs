import PageHeader from "@/presentation/components/common/PageHeader";

export default function CooperationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <PageHeader
          title="연대협력"
          description="토브협회는 투명하고 건강한 재정문화를 확산시키기 위해 다양한 기관 및 단체와 연대하고 협력하고 있습니다."
        />

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 mb-12">
            <div className="bg-blue-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">협력 분야</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">교육 협력</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>공동 교육프로그램 개발</li>
                    <li>강사 교류 및 파견</li>
                    <li>교육자료 공동 제작</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">정책 협력</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>재정투명성 정책 제안</li>
                    <li>법제도 개선 활동</li>
                    <li>공동 연구 및 조사</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">캠페인 협력</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>투명성 캠페인 공동 진행</li>
                    <li>인식개선 활동</li>
                    <li>우수사례 공유</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">네트워크 협력</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>정보 공유 네트워크 구축</li>
                    <li>실무자 교류 프로그램</li>
                    <li>국제 협력 활동</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">주요 협력기관</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">종교단체</h3>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">시민단체</h3>
                  {/* <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>한국가이드스타</li>
                    <li>아름다운재단</li>
                    <li>한국NPO공동회의</li>
                    <li>시민사회단체연대회의</li>
                  </ul> */}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">전문기관</h3>
                  {/* <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>한국공인회계사회</li>
                    <li>한국세무사회</li>
                    <li>사회복지공동모금회</li>
                    <li>한국사회복지협의회</li>
                  </ul> */}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">교육기관</h3>
                  {/* <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>각 신학대학교</li>
                    <li>NPO스쿨</li>
                    <li>사회적경제 교육기관</li>
                    <li>평생교육원</li>
                  </ul> */}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">협력 성과</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    재정투명성 공동선언문 발표
                  </h3>
                  <p className="text-gray-600">
                    2023년 주요 종교단체와 함께 재정투명성 실천을 위한
                    공동선언문 발표
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    비영리 회계기준 제정 참여
                  </h3>
                  <p className="text-gray-600">
                    한국회계기준원과 협력하여 비영리조직 회계기준 제정 과정에
                    참여
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    투명성 인증제도 개발
                  </h3>
                  <p className="text-gray-600">
                    시민사회단체들과 협력하여 재정투명성 인증제도 개발 및 시행
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">국제 컨퍼런스 개최</h3>
                  <p className="text-gray-600">
                    해외 투명성 관련 기관들과 함께 국제 컨퍼런스를 개최하여
                    우수사례 공유
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">함께하는 방법</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-purple-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">협력 제안</h3>
                <p className="text-sm text-gray-700">
                  협력 분야와 내용을 포함한 제안서 제출
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">협의 및 조정</h3>
                <p className="text-sm text-gray-700">
                  상호 협의를 통한 협력 방안 구체화
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">협약 체결</h3>
                <p className="text-sm text-gray-700">
                  공식 협약 체결 및 협력 활동 시작
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">협력 문의</h2>
            <p className="text-gray-700 mb-4">
              투명한 재정문화 확산을 위한 연대와 협력을 환영합니다.
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-gray-700">
                <strong>전화:</strong> 02-6951-1391
              </p>
              <p className="text-gray-700">
                <strong>이메일:</strong> tov.npo@gmail.com
              </p>
            </div>
            <a
              href="/consultation/apply"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              협력 제안하기
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
