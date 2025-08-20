import Link from 'next/link'
import { FileText, Download, Calendar, CheckCircle, ArrowLeft, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const resources = [
  {
    category: '결산 절차',
    icon: Calendar,
    items: [
      { title: '연말 결산 체크리스트', type: 'PDF', size: '1.2MB', updated: '2024.01.25' },
      { title: '결산 실무 프로세스 가이드', type: 'PDF', size: '2.8MB', updated: '2024.01.20' },
      { title: '결산 조정 항목 점검표', type: 'XLSX', size: '456KB', updated: '2024.01.15' }
    ]
  },
  {
    category: '공시 의무',
    icon: FileText,
    items: [
      { title: '공익법인 결산서류 공시 가이드', type: 'PDF', size: '2.1MB', updated: '2024.01.10' },
      { title: '국세청 공시 시스템 사용 매뉴얼', type: 'PDF', size: '3.5MB', updated: '2024.01.05' },
      { title: '공시 의무 위반 사례 및 주의사항', type: 'PDF', size: '980KB', updated: '2023.12.28' }
    ]
  },
  {
    category: '보고서 양식',
    icon: CheckCircle,
    items: [
      { title: '표준 재무제표 양식 (종교법인용)', type: 'XLSX', size: '856KB', updated: '2024.01.01' },
      { title: '수지계산서 작성 양식', type: 'XLSX', size: '520KB', updated: '2024.01.01' },
      { title: '감사보고서 표준 양식', type: 'DOC', size: '380KB', updated: '2023.12.20' }
    ]
  }
]

const timeline = [
  { month: '12월', task: '결산 준비 및 장부 마감' },
  { month: '1월', task: '재무제표 작성 및 내부 검토' },
  { month: '2월', task: '외부 감사 실시 (해당 법인)' },
  { month: '3월', task: '정기총회 승인 및 공시 준비' },
  { month: '4월', task: '국세청 공시 완료 (기한: 4/30)' }
]

export default function SettlementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 뒤로가기 */}
      <Link 
        href="/resources" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        자료실로 돌아가기
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">결산공시 자료실</h1>
        <p className="text-lg text-gray-600">
          교회 결산 절차와 공시 의무 이행을 위한 실무 자료를 제공합니다.
        </p>
      </div>

      {/* 결산 일정 타임라인 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            연간 결산 일정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="relative z-10 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {item.month}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{item.task}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 자료 목록 */}
      <div className="space-y-8 mb-12">
        {resources.map((category) => {
          const Icon = category.icon
          return (
            <Card key={category.category}>
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-600">
                            {item.type} • {item.size} • 업데이트: {item.updated}
                          </p>
                        </div>
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                        <Download className="h-4 w-4" />
                        다운로드
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        }}}
      </div>

      {/* 공시 의무 안내 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">공시 대상 법인</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <span>총자산 5억원 이상인 공익법인</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <span>수입금액과 출연재산 합계 3억원 이상</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <span>외부 감사 대상 공익법인</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">공시 서류</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>재무상태표 및 운영성과표</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>기부금 모집 및 사용실적</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>외부감사보고서 (해당시)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>임원 현황 및 보수 지급 내역</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 주의사항 */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="font-bold text-red-800 mb-2">공시 의무 위반시 제재사항</h3>
        <ul className="space-y-1 text-sm text-red-700">
          <li>• 미공시 또는 거짓 공시: 자산총액의 0.5% 가산세</li>
          <li>• 공시 서류 미보관: 미보관 비용의 0.07% 가산세</li>
          <li>• 상속세 및 증여세 면제 혜택 배제 가능</li>
        </ul>
      </div>
    </div>
  )
}