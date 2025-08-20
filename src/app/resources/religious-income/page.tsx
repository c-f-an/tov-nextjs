import Link from 'next/link'
import { FileText, Download, BookOpen, HelpCircle, ArrowLeft } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const resources = [
  {
    category: '신고 가이드',
    icon: FileText,
    items: [
      { title: '2024년 종교인 소득세 신고 안내서', type: 'PDF', size: '2.5MB', updated: '2024.01.15' },
      { title: '종교인 소득 원천징수 실무 가이드', type: 'PDF', size: '1.8MB', updated: '2024.01.10' },
      { title: '비과세 소득 판단 기준', type: 'PDF', size: '980KB', updated: '2023.12.20' }
    ]
  },
  {
    category: '신고 서식',
    icon: BookOpen,
    items: [
      { title: '종교인소득 지급명세서 (엑셀)', type: 'XLSX', size: '156KB', updated: '2024.01.05' },
      { title: '종교인소득 원천징수영수증', type: 'HWP', size: '89KB', updated: '2024.01.05' },
      { title: '종교인소득 간이세액표', type: 'PDF', size: '520KB', updated: '2024.01.01' }
    ]
  },
  {
    category: '교육 자료',
    icon: BookOpen,
    items: [
      { title: '종교인 과세 이해하기 (초급)', type: 'PPT', size: '5.2MB', updated: '2023.11.15' },
      { title: '세무 실무자를 위한 심화 교육', type: 'PDF', size: '3.8MB', updated: '2023.10.20' },
      { title: '자주 묻는 질문 100선', type: 'PDF', size: '1.2MB', updated: '2023.09.10' }
    ]
  }
]

const faqs = [
  {
    question: '종교인 소득과 근로소득의 차이점은 무엇인가요?',
    answer: '종교인 소득은 종교 활동의 대가로 받는 소득으로, 근로소득보다 필요경비 인정 범위가 넓습니다.'
  },
  {
    question: '비과세 대상 소득에는 어떤 것들이 있나요?',
    answer: '사택 제공 이익, 종교 활동비, 도서비 등이 일정 한도 내에서 비과세됩니다.'
  },
  {
    question: '원천징수를 하지 않아도 되는 경우가 있나요?',
    answer: '월 소득이 일정 금액 이하인 경우 원천징수 의무가 없을 수 있습니다.'
  }
]

export default function ReligiousIncomePage() {
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
        <h1 className="text-4xl font-bold mb-4">종교인소득 자료실</h1>
        <p className="text-lg text-gray-600">
          종교인 소득세 신고와 관련된 각종 가이드, 서식, 교육 자료를 제공합니다.
        </p>
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

      {/* FAQ 섹션 */}
      <div className="bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <HelpCircle className="h-6 w-6" />
          자주 묻는 질문
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-2">Q. {faq.question}</h3>
              <p className="text-gray-700">A. {faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link 
            href="/consultation/faq" 
            className="text-primary hover:text-primary/80 font-medium"
          >
            더 많은 FAQ 보기 →
          </Link>
        </div>
      </div>

      {/* 추가 안내 */}
      <div className="mt-8 bg-gray-100 rounded-lg p-6">
        <h3 className="font-bold mb-2">추가 도움이 필요하신가요?</h3>
        <p className="text-gray-700 mb-4">
          자료실에서 찾으시는 정보가 없거나 추가 상담이 필요하신 경우, 
          전문 상담사가 도와드립니다.
        </p>
        <Link 
          href="/consultation" 
          className="inline-block px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          상담 신청하기
        </Link>
      </div>
    </div>
  )
}