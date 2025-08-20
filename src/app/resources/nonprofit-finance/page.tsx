import Link from 'next/link'
import { FileText, Download, BookOpen, Calculator, ArrowLeft, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const resources = [
  {
    category: '회계 기준',
    icon: Calculator,
    items: [
      { title: '비영리법인 회계기준 실무 적용 가이드', type: 'PDF', size: '3.2MB', updated: '2024.01.20' },
      { title: '종교법인 특례 회계처리 기준', type: 'PDF', size: '2.1MB', updated: '2024.01.15' },
      { title: '복식부기 전환 실무 매뉴얼', type: 'PDF', size: '4.5MB', updated: '2023.12.10' }
    ]
  },
  {
    category: '재무제표 작성',
    icon: FileText,
    items: [
      { title: '재무상태표 작성 실무 (엑셀 양식 포함)', type: 'XLSX', size: '856KB', updated: '2024.01.10' },
      { title: '운영성과표 작성 가이드', type: 'PDF', size: '1.8MB', updated: '2024.01.05' },
      { title: '주석 작성 예시 및 체크리스트', type: 'DOC', size: '620KB', updated: '2023.12.20' }
    ]
  },
  {
    category: '내부 통제',
    icon: BookOpen,
    items: [
      { title: '교회 재정 내부통제 시스템 구축 가이드', type: 'PDF', size: '2.8MB', updated: '2023.11.25' },
      { title: '재무 감사 대응 체크리스트', type: 'PDF', size: '980KB', updated: '2023.11.15' },
      { title: '횡령 예방을 위한 실무 지침', type: 'PDF', size: '1.5MB', updated: '2023.10.30' }
    ]
  }
]

const bestPractices = [
  {
    title: '투명한 재정 운영',
    items: [
      '정기적인 재정 보고',
      '외부 감사 실시',
      '재정 위원회 운영'
    ]
  },
  {
    title: '체계적인 회계 관리',
    items: [
      '복식부기 도입',
      '전산화 시스템 구축',
      '정기 결산 실시'
    ]
  },
  {
    title: '법적 의무 준수',
    items: [
      '세무 신고 기한 준수',
      '공시 의무 이행',
      '관련 서류 보관'
    ]
  }
]

export default function NonprofitFinancePage() {
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
        <h1 className="text-4xl font-bold mb-4">비영리재정 자료실</h1>
        <p className="text-lg text-gray-600">
          비영리법인의 투명하고 체계적인 재정 관리를 위한 실무 자료를 제공합니다.
        </p>
      </div>

      {/* 중요 공지 */}
      <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">2024년 회계기준 개정사항</h3>
            <p className="text-sm text-gray-700">
              2024년부터 적용되는 비영리법인 회계기준 주요 개정사항을 반영한 자료로 업데이트되었습니다.
            </p>
          </div>
        </div>
      </div>

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
        })}
      </div>

      {/* 우수 사례 */}
      <div className="bg-blue-50 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">비영리재정 관리 우수 사례</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {bestPractices.map((practice, index) => (
            <div key={index} className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-3">{practice.title}</h3>
              <ul className="space-y-2">
                {practice.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-gray-700">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 교육 프로그램 안내 */}
      <Card>
        <CardHeader>
          <CardTitle>관련 교육 프로그램</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold">비영리법인 회계실무 기초과정</h4>
              <p className="text-sm text-gray-600 mt-1">
                매월 둘째 주 토요일 • 오전 9시-12시 • 온라인/오프라인 동시 진행
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold">재무제표 작성 실무 워크샵</h4>
              <p className="text-sm text-gray-600 mt-1">
                분기별 1회 • 오후 2시-5시 • 실습 위주 진행
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              href="/education" 
              className="text-primary hover:text-primary/80 font-medium"
            >
              교육 프로그램 자세히 보기 →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}