import Link from 'next/link'
import { FileText, Download, Scale, BookOpen, ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const lawCategories = [
  {
    title: '종교인 과세 특례',
    icon: Scale,
    laws: [
      { name: '소득세법 제21조 (기타소득)', link: '#', updated: '2024.01.01' },
      { name: '소득세법 시행령 제41조 (종교인소득)', link: '#', updated: '2023.12.28' },
      { name: '종교인소득 과세특례 적용 지침', link: '#', updated: '2023.11.15' }
    ]
  },
  {
    title: '법인세법',
    icon: BookOpen,
    laws: [
      { name: '법인세법 제3조 (비영리법인의 납세의무)', link: '#', updated: '2024.01.01' },
      { name: '법인세법 시행령 제2조 (수익사업의 범위)', link: '#', updated: '2023.12.20' },
      { name: '종교법인 법인세 실무 가이드', link: '#', updated: '2023.10.30' }
    ]
  },
  {
    title: '부가가치세법',
    icon: FileText,
    laws: [
      { name: '부가가치세법 제26조 (재화·용역의 공급에 대한 면세)', link: '#', updated: '2024.01.01' },
      { name: '종교법인의 부가가치세 면세 범위', link: '#', updated: '2023.12.15' },
      { name: '부가가치세 신고 실무 지침', link: '#', updated: '2023.11.20' }
    ]
  },
  {
    title: '기타 관련 법령',
    icon: Scale,
    laws: [
      { name: '상속세 및 증여세법 (공익법인)', link: '#', updated: '2024.01.01' },
      { name: '국세기본법 (가산세 및 처벌규정)', link: '#', updated: '2023.12.30' },
      { name: '공익법인 설립·운영에 관한 법률', link: '#', updated: '2023.11.01' }
    ]
  }
]

const recentUpdates = [
  {
    date: '2024.01.15',
    title: '종교인소득 비과세 한도 상향 조정',
    description: '사택제공 이익 비과세 한도가 월 50만원에서 60만원으로 상향'
  },
  {
    date: '2024.01.01',
    title: '공익법인 결산서류 공시 의무 강화',
    description: '공시 대상 법인 기준 변경 및 공시 서류 범위 확대'
  },
  {
    date: '2023.12.20',
    title: '종교법인 수익사업 판정 기준 명확화',
    description: '부대사업과 수익사업의 구분 기준 상세화'
  }
]

export default function LawsPage() {
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
        <h1 className="text-4xl font-bold mb-4">관계법령 자료실</h1>
        <p className="text-lg text-gray-600">
          교회 세무와 관련된 주요 법령 정보와 최신 개정사항을 제공합니다.
        </p>
      </div>

      {/* 최신 개정사항 알림 */}
      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <AlertCircle className="h-5 w-5" />
            최신 법령 개정사항
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <div key={index} className="border-l-4 border-blue-400 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-blue-700">{update.date}</span>
                  <h4 className="font-semibold">{update.title}</h4>
                </div>
                <p className="text-sm text-gray-700">{update.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 법령 카테고리 */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {lawCategories.map((category, index) => {
          const Icon = category.icon
          return (
            <Card key={index}>
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {category.laws.map((law, lawIndex) => (
                    <div
                      key={lawIndex}
                      className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{law.name}</h4>
                        <p className="text-xs text-gray-600">최종 개정: {law.updated}</p>
                      </div>
                      <button className="flex items-center gap-1 text-primary hover:text-primary/80">
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm">보기</span>
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 법령 해석 자료 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>주요 유권해석 및 판례</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">종교인 소득 vs 근로소득 선택 기준</h4>
                <span className="text-sm text-gray-600">기획재정부 2023-1234</span>
              </div>
              <p className="text-sm text-gray-700">
                종교단체와 종교관련종사자 간 선택의 일치 필요성 및 변경 절차에 관한 해석
              </p>
              <button className="mt-2 text-sm text-primary hover:text-primary/80">
                전문 보기 →
              </button>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">종교법인 부대사업 수익의 과세 여부</h4>
                <span className="text-sm text-gray-600">대법원 2023두12345</span>
              </div>
              <p className="text-sm text-gray-700">
                종교 목적에 직접 사용되는 부대시설 운영수익의 비과세 요건
              </p>
              <button className="mt-2 text-sm text-primary hover:text-primary/80">
                전문 보기 →
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 법령 검색 도구 */}
      <div className="bg-gray-100 rounded-lg p-6">
        <h3 className="font-bold mb-4">법령 검색 도구</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link 
            href="https://www.law.go.kr" 
            target="_blank"
            className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="font-semibold">국가법령정보센터</h4>
              <p className="text-sm text-gray-600">법령 원문 및 연혁 조회</p>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </Link>
          
          <Link 
            href="https://www.nts.go.kr" 
            target="_blank"
            className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="font-semibold">국세청 법령정보</h4>
              <p className="text-sm text-gray-600">세법 해석 및 실무 지침</p>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  )
}