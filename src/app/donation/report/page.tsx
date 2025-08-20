import Link from 'next/link'
import { FileText, Download, TrendingUp, DollarSign, Users, ArrowLeft, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const financialReports = [
  {
    year: 2024,
    quarter: '1분기',
    status: '공개',
    income: '152,340,000',
    expense: '143,210,000',
    balance: '9,130,000'
  },
  {
    year: 2023,
    quarter: '연간',
    status: '공개',
    income: '580,450,000',
    expense: '562,380,000',
    balance: '18,070,000'
  },
  {
    year: 2023,
    quarter: '4분기',
    status: '공개',
    income: '165,230,000',
    expense: '158,920,000',
    balance: '6,310,000'
  },
  {
    year: 2023,
    quarter: '3분기',
    status: '공개',
    income: '142,180,000',
    expense: '138,460,000',
    balance: '3,720,000'
  }
]

const incomeBreakdown = [
  { category: '정기후원', amount: '65,000,000', percentage: 42.7 },
  { category: '일시후원', amount: '45,000,000', percentage: 29.5 },
  { category: '교육사업 수익', amount: '25,000,000', percentage: 16.4 },
  { category: '기타 수익', amount: '17,340,000', percentage: 11.4 }
]

const expenseBreakdown = [
  { category: '교육 프로그램', amount: '57,284,000', percentage: 40 },
  { category: '상담 서비스', amount: '42,963,000', percentage: 30 },
  { category: '연구개발', amount: '28,642,000', percentage: 20 },
  { category: '운영비', amount: '14,321,000', percentage: 10 }
]

export default function FinancialReportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 뒤로가기 */}
      <Link 
        href="/donation" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        후원하기로 돌아가기
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">재정보고</h1>
        <p className="text-lg text-gray-600">
          투명한 재정 운영을 위해 분기별 재정 현황을 공개합니다.
        </p>
      </div>

      {/* 최근 재정 현황 요약 */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              2024년 1분기 수입
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">152,340,000원</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4" />
              전년 동기 대비 8.5% 증가
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              정기후원자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">324명</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4" />
              전월 대비 12명 증가
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              다음 보고 예정일
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2024.07.15</p>
            <p className="text-sm text-gray-600 mt-1">2분기 재정보고</p>
          </CardContent>
        </Card>
      </div>

      {/* 재정보고서 목록 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>재정보고서</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">기간</th>
                  <th className="text-right py-3 px-4">수입</th>
                  <th className="text-right py-3 px-4">지출</th>
                  <th className="text-right py-3 px-4">잔액</th>
                  <th className="text-center py-3 px-4">보고서</th>
                </tr>
              </thead>
              <tbody>
                {financialReports.map((report, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {report.year}년 {report.quarter}
                    </td>
                    <td className="text-right py-3 px-4">{report.income}원</td>
                    <td className="text-right py-3 px-4">{report.expense}원</td>
                    <td className="text-right py-3 px-4 font-semibold">{report.balance}원</td>
                    <td className="text-center py-3 px-4">
                      <button className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                        <Download className="h-4 w-4" />
                        <span className="text-sm">다운로드</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <button className="text-primary hover:text-primary/80 font-medium">
              더 많은 보고서 보기 →
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 수입/지출 내역 */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>2024년 1분기 수입 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incomeBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-sm text-gray-600">{item.amount}원</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.percentage}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2024년 1분기 지출 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-sm text-gray-600">{item.amount}원</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.percentage}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 외부 감사 정보 */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          외부 감사 정보
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">감사 기관</h3>
            <p className="text-gray-700">삼일회계법인</p>
            <p className="text-sm text-gray-600 mt-1">
              매년 정기 회계감사 실시
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">최근 감사 의견</h3>
            <p className="text-gray-700">적정 의견 (2023년)</p>
            <p className="text-sm text-gray-600 mt-1">
              재무제표가 중요성의 관점에서 공정하게 표시
            </p>
          </div>
        </div>
        <div className="mt-6">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded hover:bg-gray-50">
            <Download className="h-4 w-4" />
            2023년 감사보고서 다운로드
          </button>
        </div>
      </div>

      {/* 투명성 약속 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>투명성 약속</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              모든 재정 내역은 분기별로 홈페이지에 공개합니다.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              외부 회계법인의 정기 감사를 받습니다.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              후원금은 오직 공익 목적으로만 사용됩니다.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              국세청 공익법인 공시 의무를 성실히 이행합니다.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}